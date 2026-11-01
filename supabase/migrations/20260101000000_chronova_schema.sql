-- ==============================================================================
-- CHRONOVA LUXURY WATCHES — PRODUCTION POSTGRES SCHEMA & RLS POLICIES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    origin_country TEXT NOT NULL DEFAULT 'Shveytsariya',
    description TEXT,
    logo_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    model_number TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    movement_type TEXT NOT NULL DEFAULT 'Avtomatik' CHECK (movement_type IN ('Avtomatik', 'Mexanik', 'Kvarts', 'Turbiyon', 'Xronograf')),
    case_material TEXT NOT NULL,
    case_diameter_mm INT NOT NULL CHECK (case_diameter_mm > 0),
    water_resistance_atm INT NOT NULL DEFAULT 5 CHECK (water_resistance_atm >= 0),
    crystal_type TEXT NOT NULL DEFAULT 'Sapfir',
    strap_material TEXT NOT NULL,
    dial_color TEXT NOT NULL,
    warranty_years INT NOT NULL DEFAULT 2 CHECK (warranty_years >= 0),
    base_price_uzs BIGINT NOT NULL CHECK (base_price_uzs >= 0),
    sale_price_uzs BIGINT CHECK (sale_price_uzs IS NULL OR (sale_price_uzs > 0 AND sale_price_uzs < base_price_uzs)),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    dial_color TEXT,
    strap_color TEXT,
    case_size_mm INT,
    price_adjustment_uzs BIGINT NOT NULL DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PRODUCT SPECS
CREATE TABLE IF NOT EXISTS public.product_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    spec_group TEXT NOT NULL,
    spec_name TEXT NOT NULL,
    spec_value TEXT NOT NULL
);

-- 8. INVENTORY MOVEMENTS (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    change_amount INT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('order_fulfillment', 'order_cancellation', 'manual_adjustment', 'initial_stock', 'restock')),
    reference_id TEXT,
    note TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (user_id, product_id)
);

-- 10. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_region TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    delivery_type TEXT NOT NULL DEFAULT 'standard' CHECK (delivery_type IN ('standard', 'express', 'pickup')),
    payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery' CHECK (payment_method IN ('cash_on_delivery', 'card_upon_receipt')),
    subtotal_uzs BIGINT NOT NULL CHECK (subtotal_uzs >= 0),
    discount_uzs BIGINT NOT NULL DEFAULT 0 CHECK (discount_uzs >= 0),
    delivery_fee_uzs BIGINT NOT NULL DEFAULT 0 CHECK (delivery_fee_uzs >= 0),
    total_uzs BIGINT NOT NULL CHECK (total_uzs >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    tracking_token TEXT NOT NULL UNIQUE,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. ORDER ITEMS (IMMUTABLE SNAPSHOT)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    sku_snapshot TEXT NOT NULL,
    unit_price_uzs BIGINT NOT NULL CHECK (unit_price_uzs >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_uzs BIGINT NOT NULL CHECK (total_price_uzs >= 0)
);

-- 12. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    comment TEXT,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value BIGINT NOT NULL CHECK (discount_value > 0),
    min_order_amount_uzs BIGINT NOT NULL DEFAULT 0,
    max_uses INT,
    current_uses INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge_text TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL DEFAULT '/katalog',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. NOTIFICATION OUTBOX (RELIABLE TELEGRAM DISPATCH)
CREATE TABLE IF NOT EXISTS public.notification_outbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel TEXT NOT NULL DEFAULT 'telegram',
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    attempts INT NOT NULL DEFAULT 0,
    last_error TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    sent_at TIMESTAMPTZ
);

-- 18. SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published_featured ON public.products(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(base_price_uzs);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id, status);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_pending ON public.notification_outbox(status) WHERE status = 'pending';

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
$$;

-- PROFILES
CREATE POLICY "Public profiles can be viewed by owner or admin"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- BRANDS & CATEGORIES (Public Read, Admin Write)
CREATE POLICY "Public read active brands" ON public.brands FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write brands" ON public.brands FOR ALL USING (public.is_admin());

CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

-- PRODUCTS & DETAILS (Public Read Published, Admin Write)
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write variants" ON public.product_variants FOR ALL USING (public.is_admin());

CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin write product images" ON public.product_images FOR ALL USING (public.is_admin());

CREATE POLICY "Public read product specs" ON public.product_specs FOR SELECT USING (true);
CREATE POLICY "Admin write product specs" ON public.product_specs FOR ALL USING (public.is_admin());

-- WISHLISTS
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- ORDERS & ORDER ITEMS
-- Non-admin customers can only read their own orders; Admin has full access
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin full access orders" ON public.orders FOR ALL
USING (public.is_admin());

CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin())));

CREATE POLICY "Admin full access order items" ON public.order_items FOR ALL
USING (public.is_admin());

-- ORDER STATUS HISTORY
CREATE POLICY "Users view order history" ON public.order_status_history FOR SELECT
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_status_history.order_id AND (orders.user_id = auth.uid() OR public.is_admin())));

CREATE POLICY "Admin write order history" ON public.order_status_history FOR ALL
USING (public.is_admin());

-- REVIEWS
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT
USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users insert reviews" ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin moderate reviews" ON public.reviews FOR ALL
USING (public.is_admin());

-- BANNERS
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write banners" ON public.banners FOR ALL USING (public.is_admin());

-- SENSITIVE TABLES (ADMIN ONLY)
CREATE POLICY "Admin only inventory_movements" ON public.inventory_movements FOR ALL USING (public.is_admin());
CREATE POLICY "Admin only coupons" ON public.coupons FOR ALL USING (public.is_admin());
CREATE POLICY "Admin only audit_logs" ON public.audit_logs FOR ALL USING (public.is_admin());
CREATE POLICY "Admin only notification_outbox" ON public.notification_outbox FOR ALL USING (public.is_admin());
CREATE POLICY "Admin only settings" ON public.settings FOR ALL USING (public.is_admin());
