# CHRONOVA — UI/UX DIZAYN TIZIMI (DESIGN SYSTEM)

## 1. Vizual Yo‘nalish va Estetika
CHRONOVA butigi Shveytsariya yuqori soatsozlik san’ati (Haute Horlogerie) va zamonaviy editorial minimalizm uyg‘unligida yaratilgan:
- **Editorial Luxury**: Nafis display-serif sarlavhalar (`Playfair Display`), aniq o‘qiluvchi sans UI shrifti (`Outfit`).
- **Whitespace & 12-Column Grid**: 8px modul tizimi, keng va havodor bo‘shliqlar, 16px va 24px yumaloq burchaklar (`rounded-2xl`, `rounded-3xl`).
- **Mikro-interaksiyalar**: Silliq kattalashuv (zoom hover), nozik oltin tilla jilolar (`gold-glow`), soat harakatiga mos silliq o‘tishlar.

---

## 2. Ranglar Palitrasi (WCAG AA)

### Light Mode (Fil suyagi va Oltin)
- **Ivory fon**: `#FAF9F6` / `#F7F5F0`
- **Surface**: `#FFFFFF`
- **Graphite (Matn)**: `#1E2226` / `#14171A`
- **Muted Gold (Aksent)**: `#B89B65` / `#9E824F`

### Dark Mode (Chuqur Ko‘mir va Tilla)
- **Deep Charcoal fon**: `#0D1013`
- **Surfaces**: `#161B1F` / `#1E242B`
- **Text Primary**: `#F5F2EB`
- **Text Muted**: `#9EABB7`
- **Luxury Gold Accent**: `#C3A875` / `#D8C08E`

---

## 3. Komponentlar Arxitekturasi
1. **Header & Navbar**:
   - `glass-nav` (blur 16px) bilan doimiy yopishqoq (sticky top).
   - O‘zbek, Rus va Ingliz tillari selektori.
   - Dark / Light rejimi almashgichi (flickersiz, localStorage bilan bog‘langan).
   - Qidiruv modali, sevimlilar hisoblagichi, xarid savatchasi indikatori.
2. **ProductCard**:
   - Asl soat surati, optik kattalashtirish (zoom on hover).
   - Brend, model, mexanizm, korpus diametri, narx (UZS).
   - Qoldiq 3 tadan kam qolganda ogohlantiruvchi badge.
   - Tezkor savatga qo‘shish va sevimlilarga saqlash.
3. **CartDrawer & Savat Sahifasi**:
   - Qulay slide-out oyna va alohida sahifa.
   - Miqdorni o‘zgartirishda zaxira tekshiruvi.
   - Promokod kiritish va live chegirma hisobi.
4. **Checkout Sahifasi**:
   - Bir sahifada barcha zarur maydonlar: Ism, +998 telefon validatsiyasi, O‘zbekiston viloyatlari selektori, manzil, kuryerga izoh.
   - Standart (bepul) yoki Ekspress VIP (+50 000 so‘m) yetkazish.
   - "Ko‘rib to‘lash" (naqd yoki karta) xavfsiz to‘lov kafolati.
5. **Admin SaaS Panel**:
   - Do‘kon foydalanuvchi interfeysidan ajratilgan maxsus boshqaruv konsoli.
   - KPI bloklari, savdo grafigi, zaxira monitoringi, statuslarni yangilash.
