import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../worker/index.ts', import.meta.url), 'utf8');

test('webhook idempotency only skips events that were fully processed', () => {
  assert.match(source, /SELECT event_id, processed_at FROM payment_webhook_events WHERE event_id=\?/);
  assert.match(source, /if \(existingEvent\?\.processed_at\) return json\(\{ received: true, duplicate: true \}\)/);
  assert.match(source, /INSERT OR IGNORE INTO payment_webhook_events/);
});

test('paid orders require a matching checkout session and stored session id', () => {
  assert.match(source, /!sessionId \|\| !order\.checkout_session_id \|\| order\.checkout_session_id !== sessionId/);
});

test('paid orders require an actual paid payment record and exact amount/currency', () => {
  assert.match(source, /const paidAmount = Number\(paid\?\.attributes\?\.amount\)/);
  assert.match(source, /if \(!paid \|\| !Number\.isSafeInteger\(paidAmount\).*paidAmount !== order\.total_amount \|\| currency !== order\.currency/);
  assert.doesNotMatch(source, /paid\?\.attributes\?\.amount \?\? attributes\.amount_total/);
});
