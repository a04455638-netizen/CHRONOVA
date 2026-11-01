# FAZA 6 — PRODUCTION ADMIN PANEL

`/admin/login` va role-gated `/admin/*` panel yarat. Dashboard today/last 30d KPI (orders, revenue, pending, low-stock, top products), grafiklar real data bilan. CRUD products/brands/categories; image upload + ordering + alt text; variants and SKU; stock changes with reason/audit logs; product publish draft toggle; banner manager; discount codes; customer orders search/filter, order detail, status transitions, cancellation/refund policy; approved review workflow; role-limited staff access (optional).

Admin telefon va delivery adresni faqat buyurtmani bajarish uchun ko‘rsin. Har bir mutatsiyada server auth/authorization, Zod, audit events, error/loading/success, confirmation for destructive action. Soft delete where appropriate; order history never silently erased. Pagination server-side; CSV export only authorized with PII safeguard. `ADMIN_GUIDE.md` va route-level authorization tests yoz.
