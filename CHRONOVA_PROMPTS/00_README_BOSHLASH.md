# CHRONOVA — production soat internet-do‘koni

Bu ZIP — Antigravity agentiga navbatma-navbat beriladigan **fazali promptlar**. Brendning vaqtinchalik nomi: **CHRONOVA** (o‘zgartirilishi oson). Interfeys: o‘zbekcha (lotin) birinchi, ruscha va inglizcha qo‘shimcha.

## Qanday ishlatish kerak
1. Avval `01_MASTER_PROMPT.md` faylini agentga yuboring.
2. Keyin `02_DIZAYN_PROMPT.md`, so‘ng `03` dan `10` gacha navbat bilan yuboring. Har faza tugagach `npm run lint`, `npm run typecheck`, `npm run build` va testlarni muvaffaqiyatli bajartiring.
3. `.env.example`dagi qiymatlarni o‘zingizning Supabase va Telegram konfiguratsiyangiz bilan to‘ldiring. **Maxfiy tokenlarni promptga, gitga yoki brauzer kodiga kiritmang.**
4. Yakunda `11_QABUL_QILISH_CHECKLIST.md` bilan natijani tekshiring.

## Tavsiya etilgan arxitektura
Next.js App Router + TypeScript + Tailwind CSS, asosiy storefront `/`, admin `/admin`, yagona Supabase Postgres/Auth/Storage. Telegram server-side notificatsiya; Vercel deployment. Admin uchun serverdagi rol tekshiruvi, Supabase RLS.

**Eslatma:** Bu arxiv kod emas, ishlaydigan kod yaratish uchun batafsil promptlar to‘plami. Real production uchun domen, servis kalitlari, deploy va testlar zarur.
