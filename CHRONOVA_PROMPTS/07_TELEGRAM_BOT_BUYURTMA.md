# FAZA 7 — ADMIN TELEGRAM BOTIGA BUYURTMA

Har bir yangi haqiqiy buyurtma Supabase transaction orqali saqlansin. Transaction ichida `notification_outbox` row yarat. Server-side dispatcher Telegram Bot API `sendMessage` orqali **faqat admin chat ID** ga xabar yuborsin. Secretlar `TELEGRAM_BOT_TOKEN` va `TELEGRAM_ADMIN_CHAT_ID` faqat server env'da saqlansin (NEXT_PUBLIC_ emas). HTML parse_mode bo‘lsa barcha user-supplied satrlarni escape qilish; max length va spam limit.

Xabarda: 🕒 CHRONOVA yangi buyurtma; order number, sana/vaqt (Asia/Tashkent), mijoz ismi, telefon, mahsulotlar nom/SKU/son/narx, jami, viloyat/manzil, to‘lov turi, order status, `/admin/orders/[id]` deep link. PII faqat belgilangan shaxsiy admin chatga; groupga default yuborma. Bot token loglarga chiqmasin.

Reliability: order commit bo‘lgach cron/queue worker pending outbox jobsni yuborsin; retry exponential backoff, dead-letter/error visibility, duplicate prevention via idempotency lock. Telegram API fail bo‘lsa checkout success + DB order saqlanadi va admin panelda notification_failed status ko‘rinadi. Unauthorized cron calls denied (`CRON_SECRET`). Client browserdan Telegram API chaqirilmasin.

Telegramdan status o‘zgartirish tugmalari OPTIONAL: agar qo‘shilsa bot webhook secret verification, admin Telegram user/chat allowlist, signature/secret path validation, order FSM guard, audit log, idempotency. Productionda Telegramga asosiy admin auth sifatida tayanma. Testlar: valid order->1 notification; repeat worker->no repeat; Telegram 500->retry; invalid user content escaped; no leaked secrets; fake order denied.

`TELEGRAM_SETUP.md`: @BotFather yordamida bot ochish, admin chat IDni xavfsiz olish, env, botga /start yozish, end-to-end sinov, troubleshooting. Real tokenni so‘rama, kodga hardcode qilma.
