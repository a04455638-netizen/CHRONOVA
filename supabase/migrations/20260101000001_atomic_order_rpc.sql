-- ==============================================================================
-- CHRONOVA — ATOMIC ORDER TRANSACTION RPC & INVENTORY LOCK
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.create_order_atomic(
    p_user_id UUID,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_delivery_region TEXT,
    p_delivery_city TEXT,
    p_delivery_address TEXT,
    p_delivery_notes TEXT,
    p_delivery_type TEXT,
    p_payment_method TEXT,
    p_coupon_code TEXT,
    p_items JSONB, -- Array of { product_id: UUID, variant_id: UUID, quantity: INT }
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_tracking_token TEXT;
    v_subtotal BIGINT := 0;
    v_discount BIGINT := 0;
    v_delivery_fee BIGINT := 0;
    v_total BIGINT := 0;
    v_item RECORD;
    v_prod RECORD;
    v_var RECORD;
    v_item_price BIGINT;
    v_item_total BIGINT;
    v_unit_sku TEXT;
    v_unit_name TEXT;
    v_outbox_payload JSONB;
    v_items_summary JSONB := '[]'::jsonb;
    v_existing_order_id UUID;
BEGIN
    -- 1. Idempotency check: if key already exists, return existing order
    IF p_idempotency_key IS NOT NULL AND p_idempotency_key <> '' THEN
        SELECT id, order_number INTO v_existing_order_id, v_order_number
        FROM public.orders
        WHERE idempotency_key = p_idempotency_key;

        IF v_existing_order_id IS NOT NULL THEN
            RETURN jsonb_build_object(
                'success', true,
                'order_id', v_existing_order_id,
                'order_number', v_order_number,
                'idempotent_replay', true
            );
        END IF;
    END IF;

    -- 2. Generate unique order number (e.g. CHR-26-92813)
    v_order_number := 'CHR-' || to_char(now(), 'YY') || '-' || lpad(floor(random() * 90000 + 10000)::text, 5, '0');
    v_tracking_token := encode(gen_random_bytes(16), 'hex');

    -- Delivery fee calculation
    IF p_delivery_type = 'express' THEN
        v_delivery_fee := 50000; -- 50,000 UZS express
    ELSE
        v_delivery_fee := 0; -- Free standard delivery
    END IF;

    -- 3. Create placeholder order to satisfy foreign keys
    v_order_id := uuid_generate_v4();

    -- 4. Process each item in cart: Lock row FOR UPDATE, check stock, compute verified price
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, quantity INT)
    LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Xarid miqdori 1 tadan kam bo‘lishi mumkin emas.';
        END IF;

        -- Lock and fetch product
        SELECT * INTO v_prod
        FROM public.products
        WHERE id = v_item.product_id AND is_published = true
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Tanlangan mahsulot topilmadi yoki sotuvdan olingan: %', v_item.product_id;
        END IF;

        -- Price verification from DB (never trust client)
        IF v_prod.sale_price_uzs IS NOT NULL AND v_prod.sale_price_uzs > 0 THEN
            v_item_price := v_prod.sale_price_uzs;
        ELSE
            v_item_price := v_prod.base_price_uzs;
        END IF;

        v_unit_sku := v_prod.sku;
        v_unit_name := v_prod.name;

        -- Check variant if provided
        IF v_item.variant_id IS NOT NULL THEN
            SELECT * INTO v_var
            FROM public.product_variants
            WHERE id = v_item.variant_id AND product_id = v_prod.id AND is_active = true
            FOR UPDATE;

            IF FOUND THEN
                v_item_price := v_item_price + v_var.price_adjustment_uzs;
                v_unit_sku := v_var.sku;
                IF v_var.stock_quantity < v_item.quantity THEN
                    RAISE EXCEPTION 'Kechirasiz, variant (%) bo‘yicha yetarli qoldiq mavjud emas: mavjud %, so‘ralgan %',
                        v_unit_name, v_var.stock_quantity, v_item.quantity;
                END IF;
                -- Decrement variant stock
                UPDATE public.product_variants
                SET stock_quantity = stock_quantity - v_item.quantity
                WHERE id = v_var.id;
            END IF;
        ELSE
            -- Check product base stock
            IF v_prod.stock_quantity < v_item.quantity THEN
                RAISE EXCEPTION 'Kechirasiz, mahsulot (%) bo‘yicha yetarli qoldiq mavjud emas: mavjud %, so‘ralgan %',
                    v_unit_name, v_prod.stock_quantity, v_item.quantity;
            END IF;
        END IF;

        -- Decrement product stock
        UPDATE public.products
        SET stock_quantity = stock_quantity - v_item.quantity
        WHERE id = v_prod.id;

        -- Record inventory audit trail
        INSERT INTO public.inventory_movements (
            product_id, variant_id, change_amount, reason, reference_id, note, created_by
        ) VALUES (
            v_prod.id, v_item.variant_id, -v_item.quantity, 'order_fulfillment', v_order_number, 'Buyurtma uchun zaxiradan yechildi', p_user_id
        );

        v_item_total := v_item_price * v_item.quantity;
        v_subtotal := v_subtotal + v_item_total;

        -- Save snapshot to order_items
        INSERT INTO public.order_items (
            order_id, product_id, variant_id, product_name_snapshot, sku_snapshot, unit_price_uzs, quantity, total_price_uzs
        ) VALUES (
            v_order_id, v_prod.id, v_item.variant_id, v_unit_name, v_unit_sku, v_item_price, v_item.quantity, v_item_total
        );

        -- Add to summary for Telegram notification
        v_items_summary := v_items_summary || jsonb_build_object(
            'name', v_unit_name,
            'sku', v_unit_sku,
            'qty', v_item.quantity,
            'price_uzs', v_item_price,
            'total_uzs', v_item_total
        );
    END LOOP;

    -- 5. Coupon validation
    IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) <> '' THEN
        DECLARE
            v_c RECORD;
        BEGIN
            SELECT * INTO v_c
            FROM public.coupons
            WHERE code = upper(trim(p_coupon_code))
              AND is_active = true
              AND (expires_at IS NULL OR expires_at > now())
              AND (max_uses IS NULL OR current_uses < max_uses)
            FOR UPDATE;

            IF FOUND AND v_subtotal >= v_c.min_order_amount_uzs THEN
                IF v_c.discount_type = 'percentage' THEN
                    v_discount := (v_subtotal * v_c.discount_value) / 100;
                ELSE
                    v_discount := v_c.discount_value;
                END IF;

                IF v_discount > v_subtotal THEN
                    v_discount := v_subtotal;
                END IF;

                UPDATE public.coupons SET current_uses = current_uses + 1 WHERE id = v_c.id;
            END IF;
        END;
    END IF;

    v_total := (v_subtotal - v_discount) + v_delivery_fee;

    -- 6. Insert Order Header
    INSERT INTO public.orders (
        id, order_number, user_id, customer_name, customer_phone, customer_email,
        delivery_region, delivery_city, delivery_address, delivery_notes,
        delivery_type, payment_method, subtotal_uzs, discount_uzs, delivery_fee_uzs,
        total_uzs, status, tracking_token, idempotency_key
    ) VALUES (
        v_order_id, v_order_number, p_user_id, p_customer_name, p_customer_phone, p_customer_email,
        p_delivery_region, p_delivery_city, p_delivery_address, p_delivery_notes,
        p_delivery_type, p_payment_method, v_subtotal, v_discount, v_delivery_fee,
        v_total, 'pending', v_tracking_token, p_idempotency_key
    );

    -- 7. Insert Order Status History
    INSERT INTO public.order_status_history (
        order_id, previous_status, new_status, comment, changed_by
    ) VALUES (
        v_order_id, NULL, 'pending', 'Mijoz tomonidan yangi buyurtma rasmiylashtirildi', p_user_id
    );

    -- 8. Prepare Telegram Outbox payload
    v_outbox_payload := jsonb_build_object(
        'order_id', v_order_id,
        'order_number', v_order_number,
        'customer_name', p_customer_name,
        'customer_phone', p_customer_phone,
        'region', p_delivery_region,
        'city', p_delivery_city,
        'address', p_delivery_address,
        'payment_method', p_payment_method,
        'total_uzs', v_total,
        'subtotal_uzs', v_subtotal,
        'discount_uzs', v_discount,
        'items', v_items_summary,
        'created_at', to_char(timezone('Asia/Tashkent', now()), 'YYYY-MM-DD HH24:MI:SS')
    );

    INSERT INTO public.notification_outbox (
        channel, payload, status, idempotency_key
    ) VALUES (
        'telegram', v_outbox_payload, 'pending', 'outbox-' || v_order_number
    );

    -- 9. Return structured order summary
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'tracking_token', v_tracking_token,
        'subtotal_uzs', v_subtotal,
        'discount_uzs', v_discount,
        'total_uzs', v_total
    );
END;
$$;
