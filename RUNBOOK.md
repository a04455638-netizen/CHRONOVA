# CHRONOVA — PRODUCTION RUNBOOK VA NOSOZLIKLARNI BARTARAF ETISH (RUNBOOK.MD)

Ushbu runbook platformada yuzaga kelishi mumkin bo‘lgan nosozliklar, avariyaviy holatlar va ularni bartaraf etish algoritmlarini o‘z ichiga oladi.

---

## 1. Telegram Bildirishnomalari Yetib Bormasa
### Alomat:
Mijoz do‘kondan buyurtma berdi, ammo admin Telegram chatiga xabar kelmadi.
### Harakatlar:
1. `/admin/outbox` sahifasiga kiring.
2. Qaysi xabarlar `failed` yoki `pending` holatda ekanini tekshiring.
3. `last_error` ustuniga qarang:
   - `Unauthorized`: Bot tokeni noto‘g‘ri yoki bekor qilingan.
   - `chat not found`: `TELEGRAM_ADMIN_CHAT_ID` xato yoki admin botga `/start` bosmagan.
4. Xatolikni tuzatgach, **"Navbatni Qayta Ishlash"** tugmasini bosing.

---

## 2. Zaxira Nomutanosibligi (Stock Inconsistency)
### Alomat:
Mahsulot do‘konda "Mavjud emas" ko‘rinyapti, ammo omborda soat bor.
### Harakatlar:
1. `/admin/mahsulotlar` bo‘limiga kiring.
2. Kerakli modelni topib, tahrirlash tugmasini bosing.
3. "Ombordagi Zaxira" maydoniga haqiqiy sonni kiriting va saqlang.
4. Saytda darhol soat sotuvga qaytadi.

---

## 3. Saytni Qaytarish (Rollback) Tartibi
1. Vercel boshqaruv panelida **Deployments** bo‘limiga kiring.
2. Oxirgi barqaror versiyaning uch nuqta menyusidan **"Rollback to this deployment"** ni tanlang.
3. Rollback 30 soniya ichida to‘liq kuchga kiradi.
