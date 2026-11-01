# CHRONOVA — TELEGRAM BUYURTMA BOTINI SOZLASH QO‘LLANMASI (TELEGRAM_SETUP.MD)

CHRONOVA do‘konida har bir yangi buyurtma kelib tushishi bilan adminning shaxsiy Telegram akkauntiga darhol to‘liq formatlangan xabar jo‘natiladi.

---

## 1. Telegram Bot Ochish (BotFather orqali)
1. Telegramda rasmiy **@BotFather** botiga kiring.
2. `/newbot` buyrug‘ini yuboring.
3. Bot uchun nom kiriting (masalan: `CHRONOVA Buyurtmalar Boti`).
4. Bot uchun username kiriting (masalan: `chronova_orders_bot`).
5. @BotFather sizga maxfiy **API Token** beradi (masalan: `7123456789:AAH...`).
   > **DIQQAT**: Ushbu tokenni hech kimga ko‘rsatmang va gitga commit qilmang!

---

## 2. Admin Chat ID'ni Olish
1. Telegramda **@userinfobot** ga kiring va `/start` bosing.
2. Bot sizga shaxsiy `Id` raqamingizni chiqarib beradi (masalan: `987654321`).
3. O‘zingiz ochgan yangi botga (`@chronova_orders_bot`) o‘ting va **/start** tugmasini bosing (aks holda bot sizga xabar yubora olmaydi).

---

## 3. Loyiha .env Faylini To‘ldirish
Loyiha ildizidagi `.env.local` yoki ishlab chiqarish serveridagi `.env` fayliga quyidagi qatorlarni kiriting:

```bash
TELEGRAM_BOT_TOKEN="7123456789:AAH..."
TELEGRAM_ADMIN_CHAT_ID="987654321"
CRON_SECRET="chronova_super_secret_cron_pass_2026"
NEXT_PUBLIC_SITE_URL="https://chronova.uz"
```

---

## 4. Sinovdan O‘tkazish (End-to-End Test)
1. Brauzerda `/admin` paneliga kiring (login: `admin@chronova.uz`, parol: `ChronovaAdmin2026!`).
2. Chap menyudan **"Sozlamalar"** bo‘limini oching.
3. **"Bot Aloqasini Sinash"** tugmasini bosing.
4. Telegramingizga test buyurtma xabari yetib keladi!

---

## 5. Ishonchlilik va Xavfsizlik (Outbox Pattern)
- Telegram serveri vaqtincha javob bermasa yoki internet uzilsa ham, mijozning buyurtmasi yo‘qolmaydi: u `notification_outbox` jadvalida saqlanib turadi.
- Admin panelidagi **"Telegram Outbox"** sahifasi orqali yetkazilmagan xabarlarni qayta yuborish mumkin.
- Barcha kiritilgan ismlar va manzillar Telegram HTML xavfsizligi uchun avtomatik `escapeHtml` filtridan o‘tkaziladi.
