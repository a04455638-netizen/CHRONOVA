# QABUL QILISH / RELEASE CHECKLIST

- [ ] Mijoz sayti, admin sahifalar, mobile nav, uz/ru/en, theme ishlaydi.
- [ ] Mahsulot rasmlari to‘g‘ri modelga mos, storage upload ishlaydi.
- [ ] Admin real mahsulot yaratadi -> store'da chiqadi, admin stock update store'ga ta’sir qiladi.
- [ ] Guest checkout serverda narx/stockni tekshiradi; duplicate submit bir buyurtma bo‘ladi.
- [ ] Order + item snapshot + status history + outbox bir transaction.
- [ ] Admin Telegram chatga haqiqiy buyurtma xabari keladi, failure retry, no duplicate.
- [ ] Telegram token browser source/networkda hech qachon ko‘rinmaydi.
- [ ] RLS: begona client orderi ochilmaydi; no admin bypass.
- [ ] Search/filter/cart/checkout/ratings/admin CRUD barcha tugmalari test qilingan.
- [ ] `lint`, `typecheck`, unit, E2E, `build` PASS.
- [ ] Production env, Supabase migrations, HTTPS domain, cron, backup, monitoring configured.
- [ ] Staging va production smoke tests PASS; rollback rejasi mavjud.
