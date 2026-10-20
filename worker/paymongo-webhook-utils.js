/** Shared PayMongo webhook helpers, tested directly under Node and used by the Cloudflare Worker. */
const safeText = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map(v => v.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPayMongoSignature(raw, header, secret, mode, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!header || !secret || (mode !== 'test' && mode !== 'live')) return false;
  const parts = {};
  for (const bit of header.split(',')) {
    const [key, ...value] = bit.trim().split('=');
    if (key && value.length) parts[key] = value.join('=');
  }
  if (!parts.t || !/^\d+$/.test(parts.t)) return false;
  const timestamp = Number(parts.t);
  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > 300) return false;
  const received = mode === 'live' ? parts.li : parts.te;
  if (!received || !/^[a-f0-9]{64}$/i.test(received)) return false;
  const expected = await hmacSha256Hex(secret, `${parts.t}.${raw}`);
  return constantTimeEqual(expected.toLowerCase(), received.toLowerCase());
}

export async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2, '0')).join('');
}

export function normalizeWebhookEnvelope(payload) {
  const data = payload?.data;
  const eventAttributes = data?.attributes;
  const resource = eventAttributes?.data || data?.data || eventAttributes?.resource;
  return {
    eventId: safeText(data?.id || payload?.id || payload?.event_id, 200),
    eventType: safeText(eventAttributes?.type || data?.type || payload?.type, 200),
    resource,
    livemode: eventAttributes?.livemode ?? data?.livemode ?? payload?.livemode ?? resource?.attributes?.livemode ?? null
  };
}
