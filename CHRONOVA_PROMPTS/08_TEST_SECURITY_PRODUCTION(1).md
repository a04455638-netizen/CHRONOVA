# FAZA 8 — SECURITY, TESTLAR, DEPLOY

End-to-end tests (Playwright): browse/filter, variants, cart, guest checkout, duplicate submit, own order tracking, admin login/RBAC, CRUD, change status, Telegram outbox retry, mobile. Unit/integration Vitest for price math, stock locks, coupons, validation, permissions, i18n. DB RLS negative tests. `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` clean.

Security audit: no secrets exposed to browser, no mass assignment, no IDOR, rate limit checkout/login/tracking, bot webhook verification, input validation, HTML escaping, CSP/security headers, Supabase RLS, storage permissions, audit logs, privacy policy/cookie consent if analytics, backups and restore drill, dependency audit. Server-side bot token; logs redact phone/address and secrets.

Deploy guide: Vercel project + Supabase hosted prod project + env keys; migration run in CI with protected credentials; CI gates, preview/staging, backups, rollback, Sentry/monitoring optional, domain DNS, HTTPS, email settings, robots indexing correct, cron setup for outbox, alerts for undelivered notifications, admin bootstrap. Environment-specific URL config (`NEXT_PUBLIC_SITE_URL`). CI workflow `.github/workflows/ci.yml`.

Deliver `PRODUCTION_DEPLOY.md`, `RUNBOOK.md`, `.env.example` and acceptance test evidence. Do NOT say production ready without a successful deployment smoke test and secrets configured.
