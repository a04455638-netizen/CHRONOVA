# CHRONOVA — MA’LUMOTLAR BAZASI VA MIGRATSIYA HUJJATI (DATABASE.MD)

## 1. Arxitektura
CHRONOVA PostgreSQL ma’lumotlar bazasi Supabase platformasida ishlaydi. Barcha moliyaviy amallar va buyurtmalar yaxlit (atomic) tranzaksiyalar orqali bajariladi.

---

## 2. Jadvallar Ro‘yxati
1. `profiles`: Foydalanuvchilar va ma’murlar (id UUID references auth.users, full_name, phone, role ('customer' | 'admin' | 'manager')).
2. `brands`: Shveytsariya soat brendlari (Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier, Tissot).
3. `categories`: Soat toifalari (Klassik, Xronograflar, Diver, Sport, Ayollar).
4. `products`: Soatlar (nomi, model ref, SKU unique, mexanizm, material, diametr, suvga chidamlilik, oyna, narx UZS, aksiya narxi, zaxira qoldig‘i, is_published, is_featured).
5. `product_variants`: Rang, tasma va korpus o‘lchami variantlari.
6. `product_images`: Haqiqiy yuqori sifatli fotosuratlar galereyasi.
7. `product_specs`: Har bir soatning texnik parametrlari (Kalibr, Quvvat zaxirasi, Aniqlik).
8. `inventory_movements`: Zaxira o‘zgarishlari auditi (savdo, bekor qilish, qo‘lda to‘ldirish).
9. `orders`: Mijoz buyurtmalari (buyurtma raqami, ism, telefon, viloyat, shahar, manzil, yetkazish turi, to‘lov turi, oraliq summa, chegirma, yetkazish to‘lovi, jami UZS, status, tracking token, idempotency_key).
10. `order_items`: O‘zgarmas buyurtma mahsulotlari snapshotlari (product_name_snapshot, sku_snapshot, unit_price_uzs, quantity, total_price_uzs).
11. `order_status_history`: Buyurtma statusi o‘zgarishlari vaqti va sabablari tarixi.
12. `coupons` & `coupon_redemptions`: Promokodlar va ularning ishlatilish nazorati.
13. `reviews`: Mijozlar fikrlari va 1-5 yulduzli baholari (moderatsiyadan so‘ng e’lon qilinadi).
14. `notification_outbox`: Telegram Bot API uchun ishonchli xabarnomalar navbati.

---

## 3. Row Level Security (RLS) Matritsasi

| Jadval | Public / Mehmon | Autentifikatsiyalangan Mijoz | Admin / Menejer |
| :--- | :--- | :--- | :--- |
| `products` | Faqat `is_published=true` (SELECT) | `is_published=true` (SELECT) | To‘liq CRUD (ALL) |
| `brands` & `categories` | Faqat `is_active=true` (SELECT) | `is_active=true` (SELECT) | To‘liq CRUD (ALL) |
| `orders` | Ruxsat yo‘q (RPC orqali yaratiladi) | Faqat o‘zining buyurtmalari (`user_id = auth.uid()`) | Barcha buyurtmalar (ALL) |
| `order_items` | Ruxsat yo‘q | Faqat o‘zining buyurtma qismlari | Barcha qismlar (ALL) |
| `reviews` | Faqat `approved` sharhlar | O‘z sharhini kiritish (`INSERT`) | Moderatsiya va o‘chirish (ALL) |
| `inventory_movements` | Ruxsat yo‘q | Ruxsat yo‘q | To‘liq audit (ALL) |
| `notification_outbox` | Ruxsat yo‘q | Ruxsat yo‘q | Faqat Admin / Cron worker |

---

## 4. Atomik Buyurtma Tranzaksiyasi: `create_order_atomic`
- Klientdan kelgan narxga hech qachon ishonilmaydi: DB'dagi joriy narx olinadi.
- Zaxira `FOR UPDATE` lock orqali bloklanadi: parallel xaridlar paytida ortiqcha sotuv (oversell) yuz bermaydi.
- Idempotency tekshiriladi: qayta bosilganda bitta buyurtma ikki marta ochilmaydi.
- Tranzaksiya ichida `orders`, `order_items`, `order_status_history` va `notification_outbox` bir vaqtda yaratiladi.
