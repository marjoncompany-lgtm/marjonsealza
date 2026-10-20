# Marjon Sealza LIFE & STORE — Implementation Codebase

This is a production-oriented **integration codebase** based on the Master Plan v3. It includes a Vite/React storefront and a Cloudflare Worker API using D1 and PayMongo Hosted Checkout v2.

> This codebase is not proof that the existing `marjonsealza.life` source has been modified or deployed. Merge these files into the existing project after reviewing its current source. Do not replace the existing production website blindly.

## Included
- Admin interface available at `/admin` in the frontend build (protected by the Worker admin token)
- Responsive portfolio/store starter frontend (React + Vite)
- Server-side catalog and checkout validation
- PayMongo Hosted Checkout v2 session creation
- PayMongo webhook signature verification using raw request body, timestamp, and mode-specific signature
- Idempotent webhook event processing and D1 order updates
- Public order-status endpoint
- Admin endpoints protected by a server-side bearer secret
- D1 schema, Wrangler config, environment example, and tests

## Requirements
- Node.js 20+ and npm
- Cloudflare account with Workers and D1
- PayMongo account and enabled payment methods
- HTTPS production domain

## Admin interface
- Open `/admin` on the same frontend origin to use the store administration screen.
- The interface requests the Worker API token and does not persist it in browser storage. The token-only gate is a minimal admin control, not a substitute for named user accounts, MFA, and role-based access.

## Local setup
1. `npm install`
2. Copy `.dev.vars.example` to `.dev.vars` and fill in test-mode credentials locally.
3. Create D1 database and update `wrangler.toml` with its database ID.
4. Apply the initial schema, then the storefront migration: `npx wrangler d1 execute marjonsealza-payments --local --file=./migrations/0001_initial.sql` and `npx wrangler d1 execute marjonsealza-payments --local --file=./migrations/0002_storefront_admin.sql`. For the existing remote database, take a backup and inspect the schema before applying each migration once; do not rerun the ALTER TABLE migration.
5. Start frontend: `npm run dev`
6. Start API in another terminal: `npm run dev:worker`

The frontend expects `VITE_API_BASE_URL` to point to the Worker API. Vite environment variables are public; never put secrets in `VITE_*`.

## Build
- `npm run build`
- Cloudflare Pages static output directory: `dist`
- Deploy the Worker separately with `npx wrangler deploy`

## Worker secrets
Set secrets using Wrangler or the Cloudflare dashboard:
- `PAYMONGO_SECRET_KEY` — `sk_test_...` for test, `sk_live_...` for live
- `PAYMONGO_WEBHOOK_SECRET` — the webhook signing secret for the matching PayMongo test/live webhook
- `ADMIN_API_TOKEN` — long random admin API token

Example:
`npx wrangler secret put PAYMONGO_SECRET_KEY`
`npx wrangler secret put PAYMONGO_WEBHOOK_SECRET`
`npx wrangler secret put ADMIN_API_TOKEN`

Do not paste these secrets into ChatGPT, source files, `.env` files committed to Git, or frontend code.

## PayMongo setup
1. Configure a PayMongo webhook for the current environment at `https://YOUR_WORKER_HOST/webhooks/paymongo`.
2. Subscribe to `checkout_session.payment.paid`; add refund events if the refund workflow is implemented.
3. Make sure the webhook secret and API key are both from the same test/live mode.
4. Enable only payment methods approved and enabled for the merchant account. Update `PAYMONGO_PAYMENT_METHODS` to the allowed methods.
5. Test payment and webhook delivery in test mode. Only switch to live after a successful end-to-end test and explicit business approval.

## Security and known implementation boundaries
- Checkout is created server-side from a server-owned product catalog; client-supplied price is ignored.
- Webhook signature is checked against the raw body using PayMongo's `Paymongo-Signature` format (`t`, `te`, `li`) and the mode-appropriate signature.
- The Worker stores webhook event IDs idempotently and only marks matching orders paid after a verified paid event with expected amount/currency/mode.
- Admin routes require `Authorization: Bearer <ADMIN_API_TOKEN>`. This is a minimal service-token gate, not a full multi-user admin identity system. Replace it with proper identity, MFA, roles, audit policy, and session management before broad production use.
- This starter does not implement stock reservation, shipping integrations, automated email/SMS delivery, customer accounts, refund execution, analytics consent management, a per-user audit log, MFA, or full legal advice. Add/test those before claiming the full Master Plan is complete.
- Order status lookup uses an unguessable order reference, but it is still a public status endpoint. Keep response fields minimal and do not expose private customer data.
- Review CORS origins, rate limits, retention, privacy policy, merchant payment-method eligibility, and applicable Philippine obligations before production.

## Suggested rollout
1. Merge into a preview branch, not production.
2. Run `npm run build` and `npm test`.
3. Deploy Worker and D1 migration to a test environment.
4. Run the complete PayMongo test checkout + webhook journey.
5. Review security and accessibility; then deploy Pages preview.
6. Verify `marjonsealza.life`, `www`, Worker health, webhook delivery, and rollback before live activation.


### Admin security hardening (v4)
Adds an audit trail for admin API activity and denied authentication attempts. Configure a randomly generated `ADMIN_API_TOKEN` with at least 32 characters as a Worker secret, then apply `migrations/0003_admin_audit_log.sql`. Never place the token in `VITE_*` frontend variables. For public production use, put Cloudflare Access or equivalent identity-aware access in front of the admin UI/API; a shared bearer token is not a substitute for individual accounts and MFA.

## Version 6 webhook reliability hardening

- Webhook idempotency now skips only events with `processed_at` set. An event that was received but failed order/session or amount validation remains retryable instead of being permanently swallowed as a duplicate.
- Successful checkout events must match the stored checkout session ID exactly; a missing session ID is not accepted.
- An order can become `paid` only when the event contains an actual payment record with status `paid` and its amount/currency exactly match the order. Session-level amount fallbacks are intentionally rejected.
- Added regression tests for retry safety, strict checkout-session linkage, and amount/currency checks.

Verification: `npm test` passes 11/11 tests. A fresh `npm install --ignore-scripts --no-audit --no-fund` attempt timed out in this environment, so `npm run build` remains unverified. No live Worker or website deployment was performed in this stage.


## Official PayMongo references

Implementation decisions in this codebase should be checked against PayMongo's current documentation before production activation:

- Hosted Checkout v2: https://docs.paymongo.com/docs/payment-channels-hosted-checkout
- Webhook event payloads: https://docs.paymongo.com/docs/developer-tools-webhooks-events
- Webhook signature and setup: https://docs.paymongo.com/docs/developer-tools-webhook-setup-management

The current configuration normalizes the legacy `paymaya` environment value to the `maya` payment-method identifier. The actual availability of each method still depends on the merchant account and PayMongo settings. A code-level test is not a substitute for sending a real PayMongo test event to the configured endpoint.


## Frontend-to-Worker connection

The storefront defaults to the existing PayMongo Worker URL when `VITE_API_BASE_URL` is not supplied. For another environment, set `VITE_API_BASE_URL` to the correct API origin at build time. CORS allows the configured app origin and its `www` equivalent; keep `APP_BASE_URL` set to the canonical public URL.


### Webhook payload compatibility
The Worker normalizes both the standard PayMongo event envelope (`data.id`, `data.attributes.type`, `data.attributes.data`) and the `send.webhook` envelope documented for Hosted Checkout (`data.type`, `data.livemode`, `data.data`). Before enabling live payments, send a real test-mode `checkout_session.payment.paid` event from the PayMongo dashboard and confirm the stored order changes to `paid` only when the session ID, payment status, amount, currency, and mode match.


## Version 10 — webhook idempotency fallback

Some documented Hosted Checkout `send.webhook` examples do not show a top-level event ID. The handler now uses the provider event ID when present and otherwise derives a deterministic SHA-256 key from the exact signed raw payload. This makes identical retries idempotent without trusting an unsigned identifier. Validate this fallback against an actual PayMongo test event before live activation.

## Version 11 — executable webhook verification tests

The webhook signature verifier and event-envelope normalizer are now in `worker/paymongo-webhook-utils.js`, which is imported by the deployed Worker and tested directly by Node's test runner. The tests generate valid HMAC signatures and exercise the real verifier, including modified raw bodies, wrong mode, malformed signatures, and stale timestamps. Event normalization tests cover both documented envelope forms. Missing `livemode` is preserved as unknown and is rejected by the mode comparison rather than silently becoming test mode.

Verification: `node --test` passes 23/23 tests. An `npm install --no-audit --no-fund` attempt timed out in this environment; therefore `npm run build` remains unverified. No production deployment was performed.

## Production database safety

- `npm run db:inspect:remote` prints the current D1 tables and indexes for review.
- Back up/export production data before any schema change.
- Use only `npm run db:migrate:remote` for tracked migrations after reviewing the current schema and migration history.
- There is deliberately no `db:migrate:fresh:remote` command.


## Version 15 checkout failure safety

- Validates supported PayMongo payment-method configuration before creating a pending order.
- Applies a 15-second timeout to the Checkout Session API request.
- Marks the pending order failed if the provider request throws or times out, and handles malformed JSON as a failed provider response.
- Regression tests cover invalid configuration order, network timeout handling, and malformed provider JSON.


### Verified production database note (2026-10-20)
A read-only inspection confirmed the existing D1 database has the original `store_orders` and `payment_webhook_events` tables and no migration-history table was present in `sqlite_master`. Do not apply remote migrations until a backup is taken and migration-history/baseline handling is reviewed. This inspection made no production writes.

### Direct storefront routes
- `/store` displays the catalog-focused view.
- `/checkout` displays the checkout-focused view.
- Cart quantities persist in `sessionStorage` while the browser tab remains open.
- These routes are implemented in this source archive but are not yet deployed to `marjonsealza.life`.


## Version 18 — verified production D1 baseline

On 2026-10-20, the existing D1 database was exported before an additive schema migration. The existing order and webhook tables were empty at the baseline. The migrations for storefront fields, products, webhook processing state, and admin audit logging were applied; migration filenames were recorded in `d1_migrations`. Read-only verification confirmed the expected tables, three starter products, and zero orders/webhook events afterward.

This does not mean the storefront is deployed or payments are ready. The live Worker health endpoint previously returned `ready:false`, and the required PayMongo/Admin secrets remain unconfigured. The full npm build and a real test-mode payment flow must still be completed before release. The time-limited export URL should not be treated as a durable backup; save a separate backup copy before future schema changes.


### Placeholder catalog safety
The three starter catalog rows in the production D1 database are currently marked unavailable. The fallback catalog in this source also defaults to unavailable. Do not activate products or accept customer payments until actual product/service descriptions, prices, and payment eligibility are approved.

## Version 19 — live readiness gate

Run `npm run production:health` before attempting checkout validation. It calls the public health endpoint for the existing PayMongo Worker and fails closed unless the JSON payload says `ready: true`. It never prints secret values or changes production. The last verified Worker configuration had no secrets configured and health reported `ready: false`; configure secrets securely in Cloudflare and rerun this check. A ready health response is necessary but not sufficient: complete a real PayMongo test checkout and signed webhook test before enabling live payments.
