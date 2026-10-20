import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const preflight = readFileSync(new URL('../scripts/preflight.mjs', import.meta.url), 'utf8');

test('Wrangler points at the existing production D1 database instead of a placeholder', () => {
  assert.match(config, /database_id\s*=\s*"4f16fddd-9145-4a7f-b8a1-f05425c5f0f6"/);
  assert.doesNotMatch(config, /REPLACE_WITH|YOUR_DATABASE_ID/);
});

test('a static deployment preflight is available and does not claim to verify remote secrets', () => {
  assert.equal(pkg.scripts.preflight, 'node scripts/preflight.mjs');
  assert.match(preflight, /PAYMONGO_WEBHOOK_SECRET/);
  assert.match(preflight, /cannot verify Cloudflare secrets/);
});


test('initial migration is idempotent for tables already present in production', () => {
  const initial = readFileSync(new URL('../migrations/0001_initial.sql', import.meta.url), 'utf8');
  assert.match(initial, /CREATE TABLE IF NOT EXISTS store_orders/);
  assert.match(initial, /CREATE TABLE IF NOT EXISTS payment_webhook_events/);
  assert.match(initial, /CREATE INDEX IF NOT EXISTS/);
});

test('deployment checklist records the observed production migration-history gap', () => {
  const checklist = readFileSync(new URL('../DEPLOYMENT_CHECKLIST.md', import.meta.url), 'utf8');
  assert.match(checklist, /no migration-history table in `sqlite_master`/);
  assert.match(checklist, /No production database writes or migrations were performed/);
});
