# Deployment Checklist

- [ ] Review and merge changes into the existing website repo; do not replace production with this starter blindly.
- [ ] Replace demo catalog with approved products/prices, sourced from a server-controlled database.
- [ ] Confirm Worker and Pages projects/domains.
- [ ] Create/confirm D1 database ID and inspect the current schema plus Wrangler migration history before applying migrations. Do not apply migrations blindly to the existing database.
- [ ] Run `npm run db:inspect:remote` and review the existing tables/columns before any remote migration. Save/export a backup before schema changes.
- [ ] Apply only tracked migrations with `npm run db:migrate:remote`; never run a fresh-install SQL script against the existing production database.
- [ ] Set `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET`, `ADMIN_API_TOKEN` as encrypted Worker secrets.
- [ ] Confirm `APP_BASE_URL`, `PAYMONGO_MODE`, `PAYMONGO_PAYMENT_METHODS`.
- [ ] Configure frontend `VITE_API_BASE_URL` to the Worker URL in the Pages build environment.
- [ ] Register PayMongo test webhook for `checkout_session.payment.paid`.
- [ ] Confirm webhook health/readiness; note that a missing secret should keep readiness false.
- [ ] Run `npm ci`, `npm test`, and `npm run build`.
- [ ] Test checkout creation, redirect, webhook signature, order paid status, duplicate webhook, invalid signature, wrong amount/currency, and cancelled return.
- [ ] Test mobile, keyboard accessibility, policies, support contact, and broken links.
- [ ] Verify deployed URLs, TLS, CORS, D1 access, Worker logs, and rollback path.
- [ ] Switch to live only after successful test evidence and merchant approval.

## Important before live use
- [ ] Validate the exact PayMongo API v2 response/event payload fields against the current merchant account and official docs; run successful, failed, delayed, and refunded test events.
- [ ] Make webhook processing retry-safe when database updates fail after an event has been stored; consider a processing/processed state and transactional/idempotent reconciliation.
- [ ] Add rate limiting/WAF controls to checkout, order lookup, admin and contact endpoints.
- [ ] Replace the single shared admin bearer token with named admin accounts, MFA, session expiry, role-based access, and an audit log before giving access to staff.
- [ ] Implement real shipping/fulfillment rules, stock reservation, transactional email/SMS provider, customer refund workflow, analytics consent, sitemap/robots, and approved legal copy if required by the business.
- [ ] Review migration 0002 against the live D1 schema and take a backup first. Wrangler migration tracking prevents ordinary repeated application, but if migrations were previously applied manually, reconcile the migration history and current schema before using `npm run db:migrate:remote`.
- [ ] Generate and commit package-lock.json using `npm install`; use `npm ci` for reproducible builds.


## Admin security hardening (v4)
- [ ] Set `ADMIN_API_TOKEN` as a Cloudflare Worker secret; use a randomly generated value of at least 32 characters.
- [ ] Apply `migrations/0003_admin_audit_log.sql` to the existing D1 database before enabling admin actions.
- [ ] Confirm `/api/admin/*` requests without a valid token return 401 and a too-short/missing secret returns 503.
- [ ] Confirm audit rows are created for admin API actions and denied attempts. IP addresses are HMAC-hashed, not stored raw.
- [ ] Keep the admin token out of frontend environment variables, source control, URLs, and logs.
- [ ] Put Cloudflare Access or equivalent identity-aware access in front of admin UI/API before public production use.

## Additional pre-live payment checks (v6)
- [ ] Verify PayMongo's current checkout-session webhook payload shape using a real test-mode event.
- [ ] Confirm test-mode and live-mode webhook secrets are configured separately in Worker secrets.
- [ ] Send duplicate webhook deliveries and verify processed events are idempotent.
- [ ] Simulate an event with a missing/mismatched session ID and confirm the order is not marked paid.
- [ ] Simulate a missing or mismatched paid payment record and confirm the order is not marked paid.
- [ ] Run `npm ci` and `npm run build` in a network-enabled environment before deploying.


## Version 9 verification note (2026-10-20)
- `npm test`: 17/17 passed.
- `npm run build`: blocked because project dependencies are not installed in the verification environment (`react`, `@types/react`, and Vite modules are missing).
- `npm install --offline`: blocked because required packages are not in the local npm cache. Install dependencies with network access, then rerun `npm run build`.
- PayMongo webhook normalizer now supports both the standard event envelope and the documented `send.webhook` envelope. A real dashboard test event is still required before live use.
- No production deployment was performed in this stage.

- [ ] If the test webhook omits an event ID, verify retries reuse the same deterministic payload hash and successful events are processed once.


## Version 12 migration workflow (2026-10-20)
- Database scripts now use `wrangler d1 migrations apply` with the configured `migrations_dir` instead of directly executing ALTER TABLE files every time.
- Before using the remote command, inspect the existing D1 schema and migration history. The original production database predates this starter; if any migration SQL was already run manually, reconcile history first to avoid duplicate-column errors.
- No remote migration was run by this code update.


## Version 13 deployment preflight (2026-10-20)
- `wrangler.toml` now points to the known existing D1 database `4f16fddd-9145-4a7f-b8a1-f05425c5f0f6`, rather than a placeholder. Verify account access and migration history before any remote command.
- Run `npm run preflight` for static configuration checks. This does not verify remote Worker secrets, PayMongo credentials, or live D1 schema.
- The currently inspected production Worker had no configured secrets, so payment checkout and webhook processing remain unready until secrets are set securely in Cloudflare.


## Checkout failure-safety verification (v15)
- [ ] Confirm configured payment methods are enabled for the merchant's PayMongo account.
- [ ] Test invalid/empty method configuration and verify no pending order is inserted.
- [ ] Simulate provider timeout and verify the order is marked failed and the API returns a safe 502 response.
- [ ] Simulate non-JSON provider response and verify checkout fails safely.
- [ ] Run `npm test`, `npm run preflight`, and `npm run build` before any deployment.


## Version 16 — production D1 schema reconciliation (verified read-only, 2026-10-20)
- Read-only Cloudflare D1 inspection of database `4f16fddd-9145-4a7f-b8a1-f05425c5f0f6` returned the existing `store_orders` and `payment_webhook_events` tables, plus the `_cf_KV` internal table. The current `store_orders` schema contains the original eight columns only; `payment_webhook_events` contains the original seven columns only.
- The same inspection found no migration-history table in `sqlite_master`. This means Wrangler's migration history must be initialized/reconciled before applying the current migration sequence. Do not run `npm run db:migrate:remote` until a backup exists and the baseline strategy is explicitly reviewed.
- Migration `0001_initial.sql` uses `CREATE TABLE IF NOT EXISTS`, so it can safely encounter the two already-existing base tables; however, this alone does not prove the full migration sequence is safe. Migration `0002_storefront_admin.sql` adds columns and is only safe once after verifying those columns are absent.
- No production database writes or migrations were performed during this inspection.

## Version 17 — direct storefront routes and live read-only audit (2026-10-20)
- Public browser check confirmed `https://marjonsealza.life/` returns HTTP 200, but `/store` and `/checkout` both currently fall back to the portfolio homepage. The deployed site has not yet been updated with the storefront app.
- Public browser check confirmed `https://marjonsealza-paymongo.emeritabuilder.workers.dev/health` returns `{"service":"paymongo-webhook","ready":false,"mode":"test"}`.
- Direct `/store` and `/checkout` views are now supported by the codebase; cart state is retained in session storage across those page navigations.
- Added route and cart persistence regression tests. These are source-level tests, not a substitute for browser QA against a built deployment.
- The production Worker currently has no configured secrets according to a read-only Cloudflare API check. Do not enable checkout until `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET`, and `ADMIN_API_TOKEN` are securely configured, then confirm health becomes ready.
- No live site, production Worker, or D1 data was changed in this stage.


## Version 18 — production D1 migration reconciliation (2026-10-20)

- A Cloudflare D1 export job completed before schema changes were applied. The generated export download URL is time-limited; retain a separate accessible backup copy before future production schema changes.
- Baseline inspection found zero rows in `store_orders` and `payment_webhook_events`.
- Applied the three additive migrations to the existing D1 database `4f16fddd-9145-4a7f-b8a1-f05425c5f0f6`: `0001_initial.sql`, `0002_storefront_admin.sql`, and `0003_admin_audit_log.sql`.
- Created/reconciled `d1_migrations` and recorded those three migration filenames. Added a unique index on migration name to prevent duplicate history entries.
- Read-only verification afterward confirmed the expected tables (`store_orders`, `payment_webhook_events`, `store_products`, `admin_audit_log`, `d1_migrations`), all three seeded catalog products, and still-zero order and webhook-event counts.
- These were database schema/catalog changes only. No live website or Worker code was deployed; the public storefront routes still need a real release. The Worker readiness endpoint was not reconfigured by this migration.

- Safety follow-up: all three seeded placeholder products were set to unavailable in production until the owner approves real catalog items and prices. Verify product availability before storefront launch.

## Version 19 — explicit live Worker readiness gate (2026-10-20)
- Added `npm run production:health`, which checks the existing public Worker health endpoint and exits non-zero unless it reports `ready=true`.
- The command never prints secrets and does not change Worker settings or make payments.
- Latest read-only Cloudflare inspection found no Worker secrets configured; the health endpoint was previously observed to return `ready:false`. Treat the gate as blocked until secrets are securely configured and the endpoint is rechecked.
- Production D1 schema reconciliation was performed in v18 after an export job completed. The export URL was time-limited, so obtain/save a durable backup copy before future schema changes.
- This gate does not prove PayMongo checkout/webhook correctness; a real test-mode transaction and signed webhook are still required.
