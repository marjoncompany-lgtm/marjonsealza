import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const worker = await readFile(new URL('../worker/index.ts', import.meta.url), 'utf8');

test('payment method configuration is validated before creating an order', () => {
  const methodsCheck = worker.indexOf("if (!methods.length) return bad('No supported payment methods are configured.', 503);");
  const insertOrder = worker.indexOf('INSERT INTO store_orders (id, reference_number, status, customer_name');
  assert.ok(methodsCheck >= 0 && insertOrder >= 0);
  assert.ok(methodsCheck < insertOrder, 'invalid payment methods must not create pending orders');
});

test('checkout provider network failures mark the pending order failed and return a safe error', () => {
  assert.match(worker, /signal: AbortSignal\.timeout\(15000\)/);
  assert.match(worker, /catch \{\s*await env\.PAYMENTS_DB\.prepare\(`UPDATE store_orders SET status='failed', updated_at=CURRENT_TIMESTAMP WHERE id=\? AND status='pending'`\)\.bind\(orderId\)\.run\(\);\s*return bad\('Payment provider could not be reached\./);
});

test('malformed provider JSON is handled as a failed checkout response', () => {
  assert.match(worker, /try \{ result = await response\.json\(\); \} catch \{ result = null; \}/);
  assert.match(worker, /if \(!response\.ok \|\| !result\?\.data\?\.id \|\| !result\?\.data\?\.attributes\?\.checkout_url\)/);
});
