# CHRONOVA — MA’MURIYAT VA MENEJERLAR UCHUN QO‘LLANMA (ADMIN_GUIDE.MD)

CHRONOVA admin paneli do‘kon faoliyatini to‘liq boshqarish, yangi soatlarni joylash, buyurtmalarni monitoring qilish va yetkazib berish xizmatini muvofiqlashtirish uchun mo‘ljallangan.

---

## 1. Kirish
- **URL**: `/admin` yoki `/admin/login`
- **Standart login**: `admin@chronova.uz`
- **Standart parol**: `ChronovaAdmin2026!`
- Kirish server-side sessiya va himoyalangan xavfsiz kuki (`chronova_admin_session`) orqali nazorat qilinadi.

---

## 2. Bo‘limlar va Funksiyalar

### 1. Boshqaruv (KPI Dashboard)
- Kunlik va umumiy tushum monitoringi.
- Kutilayotgan (`pending`) yangi buyurtmalar hisoblagichi.
- Zaxirasi kam qolgan (3 dona va undan kam) soatlar bo‘yicha avtomatik ogohlantirish.
- So‘nggi buyurtmalar ro‘yxati.

### 2. Mahsulotlar (Katalog CRUD)
- **Yangi soat qo‘shish**: Soat nomi, brend, kategoriya, model raqami (Ref), unikal SKU, mexanizm turi, korpus diametri, suvga chidamlilik, oyna turi, narxi (UZS), aksiya narxi, zaxira soni va rasm URL'i kiritiladi.
- **Tahrirlash**: Istalgan parametr yoki zaxira sonini bir zumda yangilash.
- **O‘chirish**: Tasdiqlash oynasi orqali xavfsiz o‘chirish.

### 3. Buyurtmalar Boshqaruvi
- Barcha buyurtmalarni statuslar bo‘yicha filtrlash (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`).
- Mijoz ismi, telefon raqami yoki buyurtma kodi bo‘yicha tezkor qidiruv.
- **Buyurtma tafsilotlari (`/admin/buyurtmalar/[id]`)**:
  - Mijozning to‘liq ismi, telefoni, yetkazish viloyati va aniq manzili.
  - Snapshot qilingan mahsulotlar (narx o‘zgarganda ham buyurtma paytidagi narx saqlanadi).
  - Statusni o‘zgartirish va tarixga menejer izohini qoldirish.
  - **"Chekni Chop Etish"** tugmasi orqali kuryer yoki mijoz uchun tayyor kvitansiya chiqarish.

### 4. Kupon & Aksiya
- Promokodlar ro‘yxati (`CHRONOVA10`, `VIP500` va h.k.).
- Foizli yoki qat’iy summali chegirmalarni ko‘rish.

### 5. Sharhlar Moderatsiyasi
- Mijozlar qoldirgan baho va sharhlarni tekshirish.
- Tasdiqlangan sharhlar darhol tegishli soat sahifasida ko‘rinadi; nomaqbul sharhlar rad etiladi.

### 6. Telegram Outbox
- Telegram botiga yuborilgan har bir bildirishnomaning holatini (sent / failed / pending) ko‘rish.
- Agar xabar uzatilmagan bo‘lsa, **"Navbatni Qayta Ishlash"** orqali qayta jo‘natish.
