import test from 'node:test';
import assert from 'node:assert/strict';
import { hmacSha256Hex, verifyPayMongoSignature } from '../worker/paymongo-webhook-utils.js';

test('actual verifier accepts valid test-mode raw-body signature', async () => {
  const secret = 'test-webhook-secret';
  const timestamp = String(Math.floor(Date.now() / 1000));
  const raw = '{"data":{"id":"evt_123","type":"checkout_session.payment.paid"}}';
  const signature = await hmacSha256Hex(secret, `${timestamp}.${raw}`);
  assert.equal(await verifyPayMongoSignature(raw, `t=${timestamp},te=${signature},li=`, secret, 'test'), true);
});

test('actual verifier rejects modified body, wrong mode, and stale timestamp', async () => {
  const secret = 'test-webhook-secret';
  const timestamp = String(Math.floor(Date.now() / 1000));
  const raw = '{"ok":true}';
  const signature = await hmacSha256Hex(secret, `${timestamp}.${raw}`);
  const header = `t=${timestamp},te=${signature},li=`;
  assert.equal(await verifyPayMongoSignature('{"ok":false}', header, secret, 'test'), false);
  assert.equal(await verifyPayMongoSignature(raw, header, secret, 'live'), false);
  assert.equal(await verifyPayMongoSignature(raw, `t=100,te=${signature},li=`, secret, 'test', 1000), false);
});

test('actual verifier rejects missing and malformed signatures', async () => {
  assert.equal(await verifyPayMongoSignature('{}', null, 'secret', 'test'), false);
  assert.equal(await verifyPayMongoSignature('{}', 't=123,te=bad,li=', 'secret', 'test', 123), false);
});
