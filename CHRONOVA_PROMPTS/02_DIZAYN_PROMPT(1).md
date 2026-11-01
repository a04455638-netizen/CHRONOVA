# FAZA 2 — PREMIUM UI/UX DIZAYN PROMPTI

CHRONOVA uchun Apple kabi toza, premium Swiss watch boutique ruhidagi o‘ziga xos (boshqa brend UI'ini nusxalamaydigan) interfeys yarat.

Vizual yo‘nalish: minimalizm + editorial luxury. Light palitra: ivory `#F7F5F0`, graphite `#1E2226`, muted gold `#B89B65`, white `#FFFFFF`. Dark: deep charcoal `#0D1013`, surfaces `#161B1F`, text `#F5F2EB`, accent `#C3A875`. Kontrast WCAG AA darajasida. Katta typographic hero (elegant display-serif sarlavha + o‘qilishi oson sans UI), premium whitespace, 12-column grid, 8px spacing, radius 12–20px, nozik border/shadow.

Desktop navigatsiya: logo, katalog, brendlar, kolleksiyalar, qidiruv, favorites, savat, login, til, theme. Mobile: barcha navigationlar uchun accessible drawer, har bir ikonkaning labeli. Hero: to‘liq mos soat fotosi, CTA 'Kolleksiyani ko‘rish'. Katalog: original mahsulot kartasi, badge, rasm, model, price, stock, quick view, favorite. Mahsulot: galereya, zoom, variants, specs accordion, reviews, delivery/guarantee. Savat: drawer + page. Checkout: bir sahifali, maydonlarga aniq validation. Account: buyurtma status timeline.

Admin dizayni do‘kondan aniq ajralgan: professional SaaS dashboard, desktop sidebar/mobile drawer, KPI, grafiklar, orders table filter, status badges, bulk actions (confirm), product media upload, stock warning, audit log. Adminning har bir actioni aniq loading/error/success ko‘rsatsin.

Animatsiya: yengil hover, stagger, skeleton, page transitions, scroll reveal; `prefers-reduced-motion` qo‘llansin. Performance ustuvor: next/image, lazy-loading, LCP hero priority, responsive srcset, image ratios. Accessibility: keyboard, focus-ring, semantic HTML, aria-label, accessible modal, readable fonts.

Rasmlar: model va brendga aniq mos, litsenziyasi aniq yoki admin yuklagan; generic mahsulotlar uchun litsenziyali o‘z soat suratlari. Hech qachon boshqa model rasmini tagiga noto‘g‘ri nom yozma. Video bo‘lsa click-to-play, captions, tezlikni pasaytirmasin.

Tailwind reusable design tokens, shadcn/ui yoki accessible custom components, dark mode flicker bo‘lmasin, butun UI uz/ru/en 100% tarjima qilinsin. Layout, mobile 360px, tablet 768px, desktop 1440px test qil. Vaqtinchalik butun sahifalarni to‘ldiruvchi lorem ipsum ishlatma. Dizayn tokenlari va komponentlarni `DESIGN_SYSTEM.md`da hujjatlashtir.
