-- ==============================================================================
-- CHRONOVA — SEED DATA: LUXURY BRANDS, CATEGORIES, WATCHES & SPECS
-- ==============================================================================

-- 1. BRANDS
INSERT INTO public.brands (id, name, slug, origin_country, description, display_order)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'Rolex', 'rolex', 'Shveytsariya', 'Dunyoning eng nufuzli va ishonchli Shveytsariya lyuks soat brendi.', 1),
    ('b0000001-0000-0000-0000-000000000002', 'Omega', 'omega', 'Shveytsariya', 'Oyga parvoz qilgan afsonaviy Master Chronometer aniqligidagi soatlar.', 2),
    ('b0000001-0000-0000-0000-000000000003', 'Patek Philippe', 'patek-philippe', 'Shveytsariya', 'Oliy toifadagi an’anaviy soatsozlik san’atining cho‘qqisi.', 3),
    ('b0000001-0000-0000-0000-000000000004', 'Audemars Piguet', 'audemars-piguet', 'Shveytsariya', 'Royal Oak kabi inqilobiy va avangard dizaynlarga ega brend.', 4),
    ('b0000001-0000-0000-0000-000000000005', 'Cartier', 'cartier', 'Fransiya/Shveytsariya', 'Qirollik zargarligi va nafis fransuz soatsozlik merosi.', 5),
    ('b0000001-0000-0000-0000-000000000006', 'Tissot', 'tissot', 'Shveytsariya', '1853-yildan buyon Shveytsariya sifatini innovatsiya bilan uyg‘unlashtiruvchi brend.', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, display_order)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Klassik va Dress', 'klassik', 'Har qanday rasmiy tadbir va biznes kostyumiga mos nafis soatlar', 1),
    ('c0000001-0000-0000-0000-000000000002', 'Xronograflar', 'xronograf', 'Sekundomer funksiyasiga ega, poyga va aviatsiya ruhiyati aks etgan modellar', 2),
    ('c0000001-0000-0000-0000-000000000003', 'Diver va Suv sporti', 'diver', 'Yuqori suvga chidamlilik va aylanuvchi bezelga ega professional sho‘ng‘uvchi soatlar', 3),
    ('c0000001-0000-0000-0000-000000000004', 'Sport va Har kungi', 'sport', 'Po‘lat korpusli, zarbalarga chidamli va universal uslubdagi soatlar', 4),
    ('c0000001-0000-0000-0000-000000000005', 'Ayollar Kolleksiyasi', 'ayollar', 'Olmos va nozik detallar bilan bezatilgan go‘zal soatlar', 5)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUCTS
INSERT INTO public.products (
    id, brand_id, category_id, name, slug, model_number, sku, description,
    movement_type, case_material, case_diameter_mm, water_resistance_atm,
    crystal_type, strap_material, dial_color, warranty_years,
    base_price_uzs, sale_price_uzs, stock_quantity, is_featured, is_published
) VALUES
(
    'p0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000003',
    'Rolex Submariner Date 41mm',
    'rolex-submariner-date-41',
    '126610LN',
    'ROL-SUB-126610LN',
    'Sho‘ng‘uvchilar uchun etalon bo‘lgan afsonaviy Rolex Submariner Date. Oystersteel po‘lat korpusi, qora Cerachrom keramik bezeli va 3235 avtomatik kalibri bilan 70 soatlik quvvat zaxirasini ta’minlaydi.',
    'Avtomatik', 'Oystersteel (904L)', 41, 30, 'Sapfir', 'Oystersteel po‘lat', 'Qora', 5,
    185000000, 178000000, 4, true, true
),
(
    'p0000001-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000002',
    'c0000001-0000-0000-0000-000000000002',
    'Omega Speedmaster Professional Moonwatch',
    'omega-speedmaster-professional-moonwatch',
    '310.30.42.50.01.002',
    'OMG-SPD-3861-SAP',
    'Oydagi birinchi soat bo‘lgan Speedmaster Moonwatch. Co-Axial Master Chronometer Calibre 3861 mexanizmi, qora siferblat va sapfir oynasi bilan jihozlangan.',
    'Mexanik', '316L Zanglamas po‘lat', 42, 5, 'Sapfir', 'Po‘lat bilaguzuk', 'Qora', 5,
    115000000, NULL, 6, true, true
),
(
    'p0000001-0000-0000-0000-000000000003',
    'b0000001-0000-0000-0000-000000000003',
    'c0000001-0000-0000-0000-000000000001',
    'Patek Philippe Calatrava 5227G',
    'patek-philippe-calatrava-5227g',
    '5227G-001',
    'PP-CAL-5227G',
    'Klassik dumaloq soatning mutlaq ramzi. 18 karatli oq oltin korpus, fil suyagi tusli laklangan siferblat va ko‘rinmas ilgakli ochiluvchi orqa qopqoq.',
    'Avtomatik', '18K Oq Oltin', 39, 3, 'Sapfir', 'Alligator terisi', 'Fil suyagi (Ivory)', 5,
    420000000, 399000000, 2, true, true
),
(
    'p0000001-0000-0000-0000-000000000004',
    'b0000001-0000-0000-0000-000000000004',
    'c0000001-0000-0000-0000-000000000004',
    'Audemars Piguet Royal Oak Selfwinding 41mm',
    'audemars-piguet-royal-oak-41',
    '15510ST.OO.1320ST.06',
    'AP-RO-15510ST',
    'Jerald Jenta tomonidan yaratilgan afsonaviy sakkiz burchakli bezel va "Grande Tapisserie" moviy siferblatli Royal Oak. Zamonaviy 4302 avtomatik kalibri.',
    'Avtomatik', 'Zanglamas po‘lat', 41, 5, 'Sapfir', 'Monolit po‘lat', 'Moviy (Blue)', 5,
    490000000, NULL, 3, true, true
),
(
    'p0000001-0000-0000-0000-000000000005',
    'b0000001-0000-0000-0000-000000000005',
    'c0000001-0000-0000-0000-000000000001',
    'Cartier Santos de Cartier Medium',
    'cartier-santos-medium',
    'WSSA0029',
    'CRT-SAN-MED',
    '1904-yilda Alberto Santos-Dyumont uchun yaratilgan birinchi erkaklar bilak soati. Qavariq burchakli kvadrat korpus, ko‘k sapfir toshli toj va QuickSwitch tasmasi.',
    'Avtomatik', 'Zanglamas po‘lat', 35, 10, 'Sapfir', 'SmartLink po‘lat + charm', 'Kumushrang oq', 3,
    98000000, 92000000, 5, true, true
),
(
    'p0000001-0000-0000-0000-000000000006',
    'b0000001-0000-0000-0000-000000000006',
    'c0000001-0000-0000-0000-000000000004',
    'Tissot PRX Powermatic 80',
    'tissot-prx-powermatic-80',
    'T137.407.11.051.00',
    'TIS-PRX-80-BLK',
    '1978-yilgi dizaynning retro-zamonaviy qayta tug‘ilishi. 80 soatlik quvvat zaxirasiga ega Nivachron spiralsimon mexanizm, vafli teksturali siferblat va o‘rnatilgan bilaguzuk.',
    'Avtomatik', '316L Zanglamas po‘lat', 40, 10, 'Sapfir', 'Integratsiyalashgan po‘lat', 'Qora vafli', 2,
    9800000, 8900000, 15, true, true
)
ON CONFLICT (slug) DO NOTHING;

-- 4. PRODUCT IMAGES (Real, curated luxury watch photography from Unsplash)
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
(
    'p0000001-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    'Rolex Submariner Date 41mm qora siferblat va po‘lat bilaguzuk',
    1, true
),
(
    'p0000001-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1547996160-71dfa6309d15?auto=format&fit=crop&w=1200&q=85',
    'Rolex Submariner korpus va bezel detali',
    2, false
),
(
    'p0000001-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=85',
    'Omega Speedmaster Professional Moonwatch xronograf',
    1, true
),
(
    'p0000001-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85',
    'Patek Philippe Calatrava nafis dress soat',
    1, true
),
(
    'p0000001-0000-0000-0000-000000000004',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=85',
    'Audemars Piguet Royal Oak moviy teksturali siferblat',
    1, true
),
(
    'p0000001-0000-0000-0000-000000000005',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    'Cartier Santos de Cartier po‘lat korpusli soat',
    1, true
),
(
    'p0000001-0000-0000-0000-000000000006',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=85',
    'Tissot PRX Powermatic 80 po‘lat bilaguzukli soat',
    1, true
);

-- 5. COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount_uzs, is_active)
VALUES
    ('CHRONOVA10', 'percentage', 10, 5000000, true),
    ('PREMIUM500', 'fixed', 500000, 10000000, true)
ON CONFLICT (code) DO NOTHING;

-- 6. SETTINGS
INSERT INTO public.settings (key, value)
VALUES
    ('store_contact', '{"phone": "+998 71 200 90 90", "email": "concierge@chronova.uz", "address": "Toshkent sh., Amir Temur shoh ko‘chasi, 108"}'::jsonb),
    ('delivery_rules', '{"standard_fee": 0, "express_fee": 50000, "free_threshold": 1000000}'::jsonb)
ON CONFLICT (key) DO NOTHING;
