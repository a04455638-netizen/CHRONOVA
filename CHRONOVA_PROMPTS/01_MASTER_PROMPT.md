# FAZA 1 — ASOSIY TEXNIK TOPSHIRIQ

Sen senior full-stack Next.js engineer, UI/UX designer, DBA va production DevOps mutaxassisisan. **CHRONOVA** nomli premium soatlar e-commerce platformasini haqiqiy production uchun yarat. Demo sahifa emas: mijoz sayti + to‘liq ishlaydigan admin panel + Supabase ma’lumotlar bazasi + Telegram buyurtma botiga bildirishnoma.

## Stack va loyiha tuzilmasi
- Next.js App Router, TypeScript strict, Tailwind CSS, server components va server actions/route handlers kerakli joyda.
- Supabase PostgreSQL, Supabase Auth va Storage. `@supabase/ssr` kabi amaldagi tavsiya etilgan sessiya boshqaruvi; zamonaviy qo‘llab-quvvatlanadigan kutubxonalar.
- Bitta Next.js repository: public `/` va himoyalangan `/admin`. `src/app`, `src/components`, `src/lib`, `src/types`, `supabase/migrations`, `tests`.
- Render: SEO, performance, responsive, accessibility, i18n: uz / ru / en (fallback uz), dark/light mode.
- Valyuta UZS; pul qiymatlarini DB'da `integer` (so‘m) yoki `numeric` bilan aniq saqla, floating point xatolaridan qoch.
- Landing, katalog, kategoriya, mahsulot, qidiruv, favorites, savat, checkout, hisobim, buyurtmalarim, tracking, biz haqimizda, aloqa, FAQ, yetkazish/qaytarish/siyosatlar: 10+ sahifa.
- Admin: dashboard, mahsulot CRUD, variant/stock, kategoriya, buyurtmalar va statuslar, mijozlar (faqat kerakli ma’lumot), chegirmalar, banner/kontent, reviews moderatsiyasi, audit logs, settings.

## Savdo logikasi
- Soatlar tegishli brend/modelga mos rasmlar bilan bo‘lsin. Hech qachon random, noto‘g‘ri product rasmi ishlatilmasin. Sifatli rasm yo‘q bo‘lsa placeholder + admin upload; boshqa brendga tegishli rasmni soxtalashtirma.
- Mahsulot variantlari: rang, korpus o‘lchami, strap, SKU, stock; brend, mexanizm, glass, waterproof, warranty, narx, sale price, haqiqiy stock. Admin yaratgan mahsulot store'da darhol chiqsin.
- Guest checkout va foydalanuvchi kabineti. Checkout ism, telefon (+998 validatsiya), viloyat/shahar, manzil, izoh, tanlangan yetkazish, opt-in roziliklar bilan.
- Checkout serverda cart items + joriy narx + stock + discountni qayta tekshirsin; `order_items` snapshot; atomik order create va stock reservation/decrement; parallel buyurtma paytida oversell bo‘lmasin.
- Dastlab faqat `cash on delivery`/admin bilan kelishilgan to‘lov ishlasin; onlayn to‘lovlar faqat haqiqiy provider va webhook bilan keyinchalik qo‘shilsin. Hech qachon 'to‘landi' deb soxtalashtirma.
- Har bir yangi valid orderga Telegram notification yuborilsin; buyurtma DBga yozilgandan keyin. Telegram ishlamasa buyurtma yo‘qolmasin: outbox + retry + idempotency.

## Muhim ishlab chiqish qoidalari
- Har bir sahifa, tugma, filter, search, pagination, form, auth, CRUD haqiqiy ishlasin; skeleton/mock data'ni production xulqi sifatida qoldirma.
- Admin foydalanuvchiga `role='admin'` server va DB RLS bilan tekshirilsin; client-side yashirishning o‘zi yetarli emas.
- Supabase service role secret, Telegram token, webhook secrets faqat server env. Public prefixed env ichiga secret qo‘ymagin.
- TypeScript lint/build/test. loading/error/empty states, toast, confirm, error boundaries, monitoring.
- Har fazada kodni yozib, ishga tushirish va tekshirish uchun komandalari bilan hisobot ber: qaysi fayllar, migrationlar, testlar, nima ishlaydi, nima qolgan.
- Agar credentiallar berilmagan bo‘lsa o‘zing uydirma; `.env.example` hamda kerakli sozlash qo‘llanmasini yarat va integratsiyani local test qilish uchun xavfsiz fake/test mode bilan qur.
- Fayllar real kod bo‘lsin, faqat ish reja / pseudo-code bilan cheklanma. Navbatdagi fazagacha amaldagi fazani yakunla.
