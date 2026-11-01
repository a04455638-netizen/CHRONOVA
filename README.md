# CHRONOVA — Shveytsariya Lyuks Soatlari Internet-Do‘koni

**CHRONOVA** — bu yuqori toifadagi Shveytsariya soatlarini (Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier, Tissot) sotishga ixtisoslashgan to‘liq ishlaydigan production internet-do‘koni va boshqaruv platformasi.

---

## 💎 Texnologiyalar To‘plami (Tech Stack)
- **Frontend & Backend**: Next.js 15 (App Router, Server Components & Route Handlers), React 19, TypeScript (Strict).
- **Styling & UI**: Tailwind CSS (maxsus luxury tokenlar, fil suyagi, qora ko‘mir va oltin ranglar palitrasi), Lucide Icons, WCAG AA mosligi.
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS), atomik tranzaksiyalar va zaxira qulflari (`FOR UPDATE`).
- **Xabarnomalar**: Telegram Bot API (Outbox pattern, idempotency va ishonchli xabar jo‘natish).
- **Ko‘p tillilik**: O‘zbek (birlamchi lotin), Rus va Ingliz tillari.
- **Mavzu**: Tilla jiloli Luxury Dark Mode (standart) va Nafis Light Mode (flickersiz).

---

## 🏛 Sayt Arxitekturasi va Sahifalar (15+ Marshrut)

### Mijoz Sayti (Storefront)
1. `/` — Asosiy Bosh Sahifa (Editorial Hero, Brenda va Kategoriya vitrinasi, Saralangan soatlar, Sertifikatlar).
2. `/katalog` — Keng qamrovli soatlar katalogi (Real-vaqt filtrlar: brend, kategoriya, narx oralig‘i, mexanizm, zaxira qoldig‘i, saralash).
3. `/mahsulot/[slug]` — Mahsulotning batafsil sahifasi (Optik kattalashtiruvchi galereya, texnik xususiyatlar jadvali, sharhlar va bir bosqichli xarid).
4. `/savat` — To‘liq xarid savati (Mahsulotlar ro‘yxati, miqdor tekshiruvi, promokod hisobi).
5. `/checkout` — Bir sahifali qulay buyurtma (Ism, +998 telefon validatsiyasi, viloyatlar tanlovi, manzil, yetkazish tezligi, "Ko‘rib to‘lash" kafolati).
6. `/buyurtma-tasdiqlandi` — Buyurtma qabul qilingani haqida tasdiqlovchi sahifa va Telegram xabarnoma statusi.
7. `/tracking` — Buyurtmani unikal raqam va telefon orqali real-vaqtda kuzatish (Stepper timeline).
8. `/brendlar` — Shveytsariya manufakturalari merosi va modellar ko‘rgazmasi.
9. `/biz-haqimizda` — Butik tarixi, COSC va Master Chronometer kafolati.
10. `/aloqa` — Toshkentdagi butik manzili, telefonlar va 24/7 konsyerj bilan bog‘lanish shakli.
11. `/faq` — Savol-javoblar markazi (Asl nusxalik, yetkazish, to‘lov va xavfsizlik).
12. `/kafolat-va-yetkazish` — Rasmiy xalqaro kafolat va kuryerlik shartlari.
13. `/sevimlilar` — Saqlangan soatlar ro‘yxati.

### Admin SaaS Paneli (`/admin`)
1. `/admin/login` — Himoyalangan xavfsiz admin kirish oynasi.
2. `/admin` — Boshqaruv paneli (KPI metrikalar: umumiy tushum, jami buyurtmalar, kutilayotganlar, zaxirasi kam qolgan modellar ogohlantirishi, oxirgi buyurtmalar).
3. `/admin/mahsulotlar` — Mahsulotlar to‘liq CRUD (Yangi soat yaratish, tahrirlash, zaxirani o‘zgartirish, o‘chirish).
4. `/admin/buyurtmalar` — Barcha buyurtmalar ro‘yxati va status bo‘yicha filtrlash.
5. `/admin/buyurtmalar/[id]` — Buyurtma tafsiloti, snapshot qilingan soatlar, statusni o‘zgartirish va chekni chop etish.
6. `/admin/kuponlar` — Chegirma promokodlari boshqaruvi.
7. `/admin/sharhlar` — Mijozlar sharhlarini tasdiqlash va moderatsiya qilish.
8. `/admin/outbox` — Telegram botiga yuborilayotgan xabarlar navbati va qayta jo‘natish boshqaruvi.
9. `/admin/sozlamalar` — Do‘kon sozlamalari va Telegram bot aloqasini test qilish.

---

## 🚀 Loyihani Ishga Tushirish

### 1. Bog‘liqliklarni o‘rnatish:
```bash
npm install
```

### 2. Mahalliy serverni ishga tushirish:
```bash
npm run dev
```
Sayt `http://localhost:3000` manzilida ochiladi.

### 3. Tizimni tekshirish va yig‘ish (Production Build):
```bash
npm run typecheck
npm run build
```

---

## 🔐 Standart Admin Kirish Ma’lumotlari
- **Email**: `admin@chronova.uz`
- **Parol**: `ChronovaAdmin2026!`
(Ushbu qiymatlarni `.env.local` orqali xohlagancha o‘zgartirish mumkin).

---

## 📄 Hujjatlar
- [DESIGN_SYSTEM.md](file:///c:/Users/windows/Desktop/online%20soat%20dkon/DESIGN_SYSTEM.md) — Ranglar, shriftlar va UI komponentlar qo‘llanmasi
- [DATABASE.md](file:///c:/Users/windows/Desktop/online%20soat%20dkon/DATABASE.md) — Postgres schema, RLS siyosatlari va atomik tranzaksiyalar
- [ADMIN_GUIDE.md](file:///c:/Users/windows/Desktop/online%20soat%20dkon/ADMIN_GUIDE.md) — Menejerlar uchun qo‘llanma
- [TELEGRAM_SETUP.md](file:///c:/Users/windows/Desktop/online%20soat%20dkon/TELEGRAM_SETUP.md) — Botni ulash va test qilish
- [PRODUCTION_DEPLOY.md](file:///c:/Users/windows/Desktop/online%20soat%20dkon/PRODUCTION_DEPLOY.md) — Vercel va Supabase deploy bosqichlari
- [RUNBOOK.md](file:///c:/Users/windows/Desktop/online%20soat%20dkon/RUNBOOK.md) — Nosozliklarni bartaraf etish
