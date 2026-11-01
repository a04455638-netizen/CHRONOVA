# FAZA 4 — SUPABASE DB, RLS, STORAGE, MIGRATION

Production-ready SQL migrations yarat. Jadvallar: profiles, roles/role assignments, brands, categories, products, product_variants, product_images, product_specs, inventory_movements, carts (optional), wishlists, addresses, orders, order_items, order_status_history, coupons, coupon_redemptions, reviews, banners, settings, audit_logs, notification_outbox. `UUID`, FK, constraints, unique slug, SKU unique, indexed search/filter, timestamps, deletion behavior, `CHECK(price >=0, stock>=0)`. phone/address PII'ni minimallashtir.

RLS: public only active/published products, categories, approved reviews; customers read/write only own profiles/orders/reviews according to rules; admin only role-verified policy; sensitive tables clientdan to‘g‘ridan-to‘g‘ri o‘qilmasin. SECURITY DEFINER funksiyalarda search_path qat’iy, revoke grants. `service_role` hech qachon clientda yo‘q. Storage products public read (published) va authorized admin upload only; media MIME, size limit, secure paths. Admin role server-side provisioning guide.

Postgres RPC/transaction: create_order atomik price/stock server verification, idempotency key, unique order reference; stock update race-safe. Orders va order_items snapshot (name, sku, price), coupon validatsiya, order status FSM. Telegram outbox record o‘sha transactionda yaralsin. Seeds faqat aniq demo data deb belgilansin; production fake stock/rating bo‘lmasin.

SQL migrations, rollback/backup strategy, indexes, RLS positive/negative tests, `DATABASE.md` va policy matrix yarat.
