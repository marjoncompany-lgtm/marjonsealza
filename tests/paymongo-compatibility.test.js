import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeWebhookEnvelope } from '../worker/paymongo-webhook-utils.js';

const worker = await readFile(new URL('../worker/index.ts', import.meta.url), 'utf8');
const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');

test('legacy PAYMONGO_PAYMENT_METHODS paymaya setting maps to current Maya method name', () => {
  assert.match(worker, /configured\.map\(x => x\.toLowerCase\(\) === 'paymaya' \? 'maya' : x\.toLowerCase\(\)\)/);
  assert.match(worker, /const allowed = new Set\(\[[^\]]*'maya'/);
});

test('webhook parser supports documented event envelope and checkout session resource', () => {
  assert.match(worker, /normalizeWebhookEnvelope/);
  assert.match(worker, /normalizeWebhookEnvelope/);
  const event = normalizeWebhookEnvelope({ data: { id: 'evt_1', attributes: { type: 'checkout_session.payment.paid', livemode: false, data: { id: 'cs_1', attributes: { payments: [] } } } } });
  assert.equal(event.eventType, 'checkout_session.payment.paid');
  assert.equal(event.resource.id, 'cs_1');
  assert.match(worker, /const payments = Array\.isArray\(attributes\.payments\) \? attributes\.payments : \[\]/);
});

test('deployment docs link to official PayMongo checkout and webhook references', () => {
  assert.match(readme, /docs\.paymongo\.com\/docs\/payment-channels-hosted-checkout/);
  assert.match(readme, /docs\.paymongo\.com\/docs\/developer-tools-webhook-setup-management/);
});

test('webhook normalizer accepts PayMongo send.webhook envelope fields', () => {
  const event = normalizeWebhookEnvelope({ event_type: 'send.webhook', data: { type: 'checkout_session.payment.paid', livemode: false, data: { id: 'cs_2' } } });
  assert.equal(event.eventType, 'checkout_session.payment.paid');
  assert.equal(event.resource.id, 'cs_2');
});
