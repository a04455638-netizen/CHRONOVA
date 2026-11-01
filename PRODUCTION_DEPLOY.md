# CHRONOVA — PRODUCTION DEPLOYMENT QO‘LLANMASI (PRODUCTION_DEPLOY.MD)

Ushbu hujjat loyihani real server (Vercel) va Supabase bulut ma’lumotlar bazasida ishga tushirish qadamlarini bayon etadi.

---

## 1. Supabase Loyihasini Sozlash
1. [supabase.com](https://supabase.com) platformasiga kiring va yangi loyiha (`CHRONOVA-PROD`) oching.
2. **Project Settings -> Database** bo‘limiga o‘tib, DB parolini saqlang.
3. **SQL Editor** orqali `supabase/migrations/` papkasidagi fayllarni navbati bilan bajaring:
   - `20260101000000_chronova_schema.sql` (jadvallar, indekslar, RLS)
   - `20260101000001_atomic_order_rpc.sql` (atomik buyurtma tranzaksiyasi)
   - `20260101000002_seed_luxury_watches.sql` (boshlang‘ich soatlar va brendlar)

---

## 2. Vercel Platformasiga Deploy Qilish
1. GitHub reponi Vercel bilan bog‘lang.
2. **Framework Preset**: Next.js (avtomatik tanlanadi).
3. **Environment Variables** bo‘limiga quyidagi o‘zgaruvchilarni kiriting:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
NEXT_PUBLIC_SITE_URL=https://chronova.uz

SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
TELEGRAM_BOT_TOKEN=[YOUR_TELEGRAM_BOT_TOKEN]
TELEGRAM_ADMIN_CHAT_ID=[YOUR_ADMIN_CHAT_ID]
CRON_SECRET=[YOUR_RANDOM_CRON_SECRET]

ADMIN_EMAIL=admin@chronova.uz
ADMIN_PASSWORD=[SECURE_PRODUCTION_PASSWORD]
```

4. **Deploy** tugmasini bosing.

---

## 3. Cron Job (Outbox Dispatcher) Sozlash
Buyurtmalar doimiy ravishda Telegram botiga yetib borishi uchun Vercel Cron yoki har 1 daqiqada ishlaydigan cron sozlang:
- **URL**: `https://chronova.uz/api/telegram/dispatch`
- **Method**: `POST`
- **Header**: `Authorization: Bearer [CRON_SECRET]`

---

## 4. Smoke Test Checklist
- [ ] Bosh sahifa va katalog silliq yuklanadi.
- [ ] Soat tanlab xarid savatiga qo‘shiladi.
- [ ] Checkout formasi to‘ldirilib buyurtma tasdiqlanadi.
- [ ] Admin Telegram botiga yangi buyurtma keladi.
- [ ] `/admin` ga kirib buyurtma statusi o‘zgartiriladi va mijoz trackingda yangilanishni ko‘radi.
