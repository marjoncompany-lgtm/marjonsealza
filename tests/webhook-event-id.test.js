import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { normalizeWebhookEnvelope, sha256Hex } from '../worker/paymongo-webhook-utils.js';

test('standard PayMongo event envelope is normalized to event ID, type, and checkout session', () => {
  const payload = { data: { id: 'evt_1', attributes: { type: 'checkout_session.payment.paid', livemode: false, data: { id: 'cs_1', attributes: { reference_number: 'MS-12345678' } } } } };
  const result = normalizeWebhookEnvelope(payload);
  assert.equal(result.eventId, 'evt_1');
  assert.equal(result.eventType, 'checkout_session.payment.paid');
  assert.equal(result.livemode, false);
  assert.equal(result.resource.id, 'cs_1');
});

test('Hosted Checkout send.webhook envelope is normalized', () => {
  const payload = { event_type: 'send.webhook', data: { type: 'checkout_session.payment.paid', livemode: false, data: { id: 'cs_2', attributes: { reference_number: 'MS-87654321' } } } };
  const result = normalizeWebhookEnvelope(payload);
  assert.equal(result.eventType, 'checkout_session.payment.paid');
  assert.equal(result.livemode, false);
  assert.equal(result.resource.id, 'cs_2');
});

test('fallback event key uses deterministic SHA-256 of the exact body', async () => {
  const raw = '{"event_type":"send.webhook","data":{"type":"checkout_session.payment.paid"}}';
  assert.equal(await sha256Hex(raw), createHash('sha256').update(raw).digest('hex'));
  assert.equal(await sha256Hex(raw), await sha256Hex(raw));
});

test('missing livemode is not silently treated as a valid test-mode event', () => {
  const result = normalizeWebhookEnvelope({ data: { id: 'evt_missing_mode', attributes: { type: 'checkout_session.payment.paid', data: { id: 'cs_3' } } } });
  assert.equal(result.livemode, null);
});
