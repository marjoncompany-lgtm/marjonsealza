# PayMongo module — prepared, not integrated

Status: **source code prepared for later integration; not connected to the public storefront and not deployed by this package operation.**

This folder contains the existing Cloudflare Worker implementation and supporting webhook/signature code, plus the D1 migration SQL and focused tests. It is intentionally kept separate so the storefront is not switched over now.

## Included routes in `worker/index.ts`

- `GET /health` — readiness response
- `GET /api/products` — reads the D1 catalog
- `POST /api/checkout` — validates cart items against the server catalog, creates an order, and requests a PayMongo Hosted Checkout Session
- `GET /api/orders/:reference` — reads limited order status
- `POST /webhooks/paymongo` — verifies signature, checks mode and order/session/payment amount, and processes events idempotently
- `/api/admin/*` — token-protected product/order administration with audit logging

## Required bindings and configuration for a future integration

Cloudflare Worker binding:
- `PAYMENTS_DB` — D1 database with the included schema

Worker variables:
- `APP_BASE_URL` — final public storefront origin
- `PAYMONGO_MODE` — `test` until test validation is complete
- `PAYMONGO_PAYMENT_METHODS` — comma-separated supported methods

Worker secrets (configure only in Cloudflare, not in source control or chat):
- `PAYMONGO_SECRET_KEY`
- `PAYMONGO_WEBHOOK_SECRET`
- `ADMIN_API_TOKEN` — use a unique random value of at least 32 characters

## Future integration steps — deliberately not performed

1. Review the current PayMongo API version, payload shape, supported methods, and webhook event formats against official PayMongo documentation.
2. Configure test credentials and webhook secret in Cloudflare.
3. Configure the D1 binding and verify migrations against the intended environment before applying them.
4. Connect the storefront checkout and admin UI to the Worker endpoints.
5. Run test-mode checkout and webhook end-to-end tests, including duplicates, retries, failure, refund, and amount/currency mismatch.
6. Run `npm test`, `npm run build`, and the production health check.
7. Only after explicit approval, deploy and switch traffic.

## Safety notes

- Do not use real/live credentials before the test flow passes.
- Never mark an order paid from a browser redirect; rely on verified webhook events.
- Never put secrets in frontend code, Git commits, logs, or chat.
- This is prepared source, not proof of a successful production integration. The current live Worker readiness remains unverified here and was previously observed as `ready: false`.

## Official documentation to re-check before integration

- Hosted Checkout: https://docs.paymongo.com/docs/payment-channels-hosted-checkout
- Webhook setup and management: https://docs.paymongo.com/docs/developer-tools-webhook-setup-management

The API payloads, available payment methods, and webhook event envelopes must be checked against the current official documentation during integration; this package alone does not certify live API compatibility.
