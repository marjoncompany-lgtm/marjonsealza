import { normalizeWebhookEnvelope, sha256Hex, verifyPayMongoSignature } from './paymongo-webhook-utils.js';

interface Env {
  PAYMENTS_DB: D1Database;
  PAYMONGO_SECRET_KEY?: string;
  PAYMONGO_WEBHOOK_SECRET?: string;
  ADMIN_API_TOKEN?: string;
  APP_BASE_URL: string;
  PAYMONGO_MODE: 'test' | 'live';
  PAYMONGO_PAYMENT_METHODS?: string;
}

type Product = { id: string; name: string; description: string; priceMinor: number; category: string; available: boolean };
const SEED_CATALOG: Product[] = [
  { id: 'digital-consultation', name: 'Digital Consultation', description: 'A focused session to discuss a digital or software project.', priceMinor: 150000, category: 'Services', available: false },
  { id: 'website-planning', name: 'Website Planning Package', description: 'A structured website planning and requirements package.', priceMinor: 350000, category: 'Services', available: false },
  { id: 'custom-project-inquiry', name: 'Custom Project Deposit', description: 'Use only after confirming the scope and deposit terms with the customer.', priceMinor: 100000, category: 'Projects', available: false }
];
const json = (data: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders } });
const bad = (message: string, status = 400) => json({ error: message }, status);
const corsHeaders = (origin: string, env: Env) => {
  const appOrigin = new URL(env.APP_BASE_URL).origin;
  const appUrl = new URL(env.APP_BASE_URL);
  const wwwOrigin = appUrl.hostname.startsWith('www.')
    ? appOrigin
    : `${appUrl.protocol}//www.${appUrl.hostname}${appUrl.port ? `:${appUrl.port}` : ''}`;
  const allowed = new Set([appOrigin, wwwOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173']);
  const accepted = allowed.has(origin) ? origin : new URL(env.APP_BASE_URL).origin;
  return {
    'Access-Control-Allow-Origin': accepted,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin'
  };
};
function withCors(response: Response, request: Request, env: Env) {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(request.headers.get('Origin') || '', env)).forEach(([k,v]) => headers.set(k,v));
  return new Response(response.body, { status: response.status, headers });
}
const asMinor = (amount: number) => Math.round(amount * 100);
const refId = () => `MS-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
const safeText = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i=0; i<a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function parseJson(request: Request) {
  try { return await request.json() as Record<string, any>; } catch { return null; }
}
async function getCatalog(env: Env): Promise<Product[]> {
  const rows = await env.PAYMENTS_DB.prepare(
    `SELECT id,name,description,category,price_minor,available FROM store_products ORDER BY created_at DESC`
  ).all<any>();
  if (rows.results && rows.results.length) {
    return rows.results.map((r: any) => ({
      id: r.id, name: r.name, description: r.description, category: r.category,
      priceMinor: Number(r.price_minor), available: Number(r.available) === 1
    }));
  }
  return SEED_CATALOG;
}

async function createCheckout(request: Request, env: Env) {
  if (!env.PAYMONGO_SECRET_KEY) return bad('Checkout is not configured yet.', 503);
  if (env.PAYMONGO_MODE !== 'test' && env.PAYMONGO_MODE !== 'live') return bad('Invalid payment mode.', 503);
  const body = await parseJson(request);
  if (!body || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) return bad('Invalid cart.');
  const customer = body.customer || {};
  const name = safeText(customer.name, 100);
  const email = safeText(customer.email, 254).toLowerCase();
  const phone = safeText(customer.phone, 30);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Enter a valid customer name and email.');
  const catalog = await getCatalog(env);
  const counts = new Map<string, number>();
  for (const item of body.items) {
    if (!item || typeof item.productId !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) return bad('Invalid cart item.');
    counts.set(item.productId, (counts.get(item.productId) || 0) + item.quantity);
  }
  const selected: { product: Product; quantity: number }[] = [];
  for (const [id, quantity] of counts) {
    const product = catalog.find(p => p.id === id);
    if (!product || !product.available) return bad('One or more items are unavailable.');
    if (quantity > 20) return bad('Quantity limit exceeded.');
    selected.push({ product, quantity });
  }
  const total = selected.reduce((sum, row) => sum + row.product.priceMinor * row.quantity, 0);
  if (!Number.isSafeInteger(total) || total <= 0 || total > 10_000_000) return bad('Order total is outside the allowed range.');
  // Validate payment-method configuration before inserting an order so a bad
  // deployment setting cannot create a permanently pending orphan order.
  const configured = (env.PAYMONGO_PAYMENT_METHODS || 'gcash,qrph,card').split(',').map(x => x.trim()).filter(Boolean);
  const allowed = new Set(['gcash','qrph','card','maya','grab_pay','shopeepay','billease','dob','dob_ubp','brankas_bdo','brankas_landbank','brankas_metrobank','brankas_pnb','brankas_rcbc','brankas_securitybank','brankas_unionbank']);
  const normalizedMethods = configured.map(x => x.toLowerCase() === 'paymaya' ? 'maya' : x.toLowerCase());
  const methods = [...new Set(normalizedMethods)].filter(x => allowed.has(x));
  if (!methods.length) return bad('No supported payment methods are configured.', 503);

  const reference = refId();
  const orderId = crypto.randomUUID();
  const lineItems = selected.map(({ product, quantity }) => ({
    name: product.name, amount: product.priceMinor, currency: 'PHP', quantity
  }));
  await env.PAYMENTS_DB.prepare(
    `INSERT INTO store_orders (id, reference_number, status, customer_name, customer_email, customer_phone, line_items_json, total_amount, currency, paymongo_mode)
     VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, 'PHP', ?)`
  ).bind(orderId, reference, name, email, phone || null, JSON.stringify(selected.map(({product,quantity}) => ({
    productId: product.id, name: product.name, quantity, unitAmount: product.priceMinor, lineTotal: product.priceMinor * quantity
  }))), total, env.PAYMONGO_MODE).run();

  const base = new URL(env.APP_BASE_URL);
  const success = new URL('/?page=success&reference=' + encodeURIComponent(reference), base).toString();
  const cancel = new URL('/?page=cancel&reference=' + encodeURIComponent(reference), base).toString();
  const payload = {
    data: { attributes: {
      line_items: lineItems,
      payment_method_types: methods,
      success_url: success,
      cancel_url: cancel,
      reference_number: reference,
      description: `Marjon Sealza LIFE & STORE order ${reference}`,
      send_email_receipt: true,
      metadata: { order_id: orderId, reference_number: reference }
    }}
  };
  let response: Response;
  try {
    response = await fetch('https://api.paymongo.com/v2/checkout_sessions', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${env.PAYMONGO_SECRET_KEY}:`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
  } catch {
    await env.PAYMENTS_DB.prepare(`UPDATE store_orders SET status='failed', updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='pending'`).bind(orderId).run();
    return bad('Payment provider could not be reached. No checkout was created; please retry.', 502);
  }
  let result: any;
  try { result = await response.json(); } catch { result = null; }
  if (!response.ok || !result?.data?.id || !result?.data?.attributes?.checkout_url) {
    await env.PAYMENTS_DB.prepare(`UPDATE store_orders SET status='failed', updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(orderId).run();
    return bad('Payment provider could not create checkout. Please retry or contact support.', 502);
  }
  await env.PAYMENTS_DB.prepare(
    `UPDATE store_orders SET checkout_session_id=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(result.data.id, orderId).run();
  return json({ checkoutUrl: result.data.attributes.checkout_url, referenceNumber: reference });
}
async function paymongoWebhook(request: Request, env: Env) {
  if (!env.PAYMONGO_WEBHOOK_SECRET) return bad('Webhook is not configured.', 503);
  const raw = await request.text();
  const verified = await verifyPayMongoSignature(raw, request.headers.get('Paymongo-Signature'), env.PAYMONGO_WEBHOOK_SECRET, env.PAYMONGO_MODE);
  if (!verified) return bad('Invalid webhook signature.', 401);
  let payload: any;
  try { payload = JSON.parse(raw); } catch { return bad('Invalid JSON payload.'); }
  const normalized = normalizeWebhookEnvelope(payload);
  // Some documented send.webhook examples omit an explicit event ID. Derive a
  // deterministic fallback from the exact signed body so retries remain idempotent.
  const eventId = normalized.eventId || `payload-sha256:${await sha256Hex(raw)}`;
  const eventType = normalized.eventType;
  const eventData = normalized.resource;
  const session = eventData?.attributes ? eventData : eventData?.data;
  const attributes = session?.attributes || {};
  const livemode = normalized.livemode;
  if (!eventId || !eventType) return bad('Webhook event is missing identifiers.');
  if (livemode !== (env.PAYMONGO_MODE === 'live')) return bad('Payment mode mismatch.', 409);

  const reference = safeText(attributes.reference_number || attributes.metadata?.reference_number, 100);
  const sessionId = safeText(session?.id, 200);
  // Receiving an event is not the same as successfully processing it. Only fully
  // processed events should be skipped on retry; transient mismatches remain retryable.
  const existingEvent = await env.PAYMENTS_DB.prepare(
    `SELECT event_id, processed_at FROM payment_webhook_events WHERE event_id=?`
  ).bind(eventId).first<any>();
  if (existingEvent?.processed_at) return json({ received: true, duplicate: true });

  await env.PAYMENTS_DB.prepare(
    `INSERT OR IGNORE INTO payment_webhook_events (event_id, event_type, livemode, checkout_session_id, reference_number, payload_json)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(eventId, eventType, livemode ? 1 : 0, sessionId || null, reference || null, raw).run();

  if (eventType === 'checkout_session.payment.paid') {
    const order = await env.PAYMENTS_DB.prepare(
      `SELECT id, total_amount, currency, status, checkout_session_id, paymongo_mode FROM store_orders WHERE reference_number=?`
    ).bind(reference).first<any>();
    if (!order || order.paymongo_mode !== env.PAYMONGO_MODE || !sessionId || !order.checkout_session_id || order.checkout_session_id !== sessionId) {
      // Leave processed_at null so a later delivery can retry after state is reconciled.
      return bad('Order/session mismatch.', 409);
    }
    const payments = Array.isArray(attributes.payments) ? attributes.payments : [];
    const paid = payments.find((payment: any) => payment?.attributes?.status === 'paid');
    const paidAmount = Number(paid?.attributes?.amount);
    const currency = String(paid?.attributes?.currency || '').toUpperCase();
    if (!paid || !Number.isSafeInteger(paidAmount) || paidAmount <= 0 || paidAmount !== order.total_amount || currency !== order.currency) {
      // Never mark an order paid from a redirect or session total alone.
      return bad('Payment amount/currency mismatch or missing paid payment record.', 409);
    }
    await env.PAYMENTS_DB.prepare(
      `UPDATE store_orders SET status='paid', paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP), updated_at=CURRENT_TIMESTAMP
       WHERE id=? AND status='pending'`
    ).bind(order.id).run();
  } else if (eventType === 'payment.failed') {
    if (reference) await env.PAYMENTS_DB.prepare(
      `UPDATE store_orders SET status='failed', updated_at=CURRENT_TIMESTAMP WHERE reference_number=? AND status='pending'`
    ).bind(reference).run();
  } else if (eventType === 'payment.refunded' || eventType === 'payment.refund.updated') {
    if (reference) await env.PAYMENTS_DB.prepare(
      `UPDATE store_orders SET status='refunded', updated_at=CURRENT_TIMESTAMP WHERE reference_number=? AND status='paid'`
    ).bind(reference).run();
  }
  await env.PAYMENTS_DB.prepare(`UPDATE payment_webhook_events SET processed_at=CURRENT_TIMESTAMP WHERE event_id=?`).bind(eventId).run();
  return json({ received: true });
}
async function orderLookup(reference: string, env: Env) {
  if (!/^[A-Z0-9-]{8,100}$/.test(reference)) return bad('Invalid order reference.');
  const order = await env.PAYMENTS_DB.prepare(
    `SELECT reference_number, status, total_amount, currency, created_at, paid_at FROM store_orders WHERE reference_number=?`
  ).bind(reference).first<any>();
  if (!order) return bad('Order not found.', 404);
  return json({ order: {
    referenceNumber: order.reference_number,
    status: order.status,
    totalAmount: Number(order.total_amount) / 100,
    currency: order.currency,
    createdAt: order.created_at,
    paidAt: order.paid_at
  }});
}
async function auditAdmin(env: Env, request: Request, action: string, target: string, outcome = 'success') {
  const forwarded = request.headers.get('CF-Connecting-IP') || '';
  const ipHash = forwarded ? await (async () => { const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.ADMIN_API_TOKEN || 'unconfigured'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(forwarded)); return [...new Uint8Array(sig)].map(v => v.toString(16).padStart(2, '0')).join(''); })() : null;
  await env.PAYMENTS_DB.prepare(
    `INSERT INTO admin_audit_log (action,target,outcome,ip_hash,user_agent) VALUES (?,?,?,?,?)`
  ).bind(action.slice(0,80), target.slice(0,160), outcome.slice(0,30), ipHash, safeText(request.headers.get('User-Agent'), 240) || null).run();
}
async function admin(request: Request, env: Env, url: URL) {
  if (!env.ADMIN_API_TOKEN || env.ADMIN_API_TOKEN.length < 32) return bad('Admin API is not securely configured.', 503);
  const supplied = request.headers.get('Authorization') || '';
  if (!constantTimeEqual(supplied, `Bearer ${env.ADMIN_API_TOKEN}`)) {
    try { await auditAdmin(env, request, 'admin.auth_denied', url.pathname, 'denied'); } catch {}
    return bad('Unauthorized.', 401);
  }
  try { await auditAdmin(env, request, `admin.${request.method.toLowerCase()}`, url.pathname); } catch {
    return bad('Admin audit logging is unavailable; operation blocked.', 503);
  }

  if (url.pathname === '/api/admin/orders' && request.method === 'GET') {
    const status = url.searchParams.get('status');
    const allowed = new Set(['pending','paid','failed','cancelled','refunded']);
    const result = status && allowed.has(status)
      ? await env.PAYMENTS_DB.prepare(`SELECT reference_number,status,total_amount,currency,created_at,paid_at,fulfillment_status FROM store_orders WHERE status=? ORDER BY created_at DESC LIMIT 200`).bind(status).all()
      : await env.PAYMENTS_DB.prepare(`SELECT reference_number,status,total_amount,currency,created_at,paid_at,fulfillment_status FROM store_orders ORDER BY created_at DESC LIMIT 200`).all();
    return json({ orders: (result.results || []).map((r: any) => ({ ...r, total_amount: Number(r.total_amount) / 100 })) });
  }
  if (url.pathname === '/api/admin/products' && request.method === 'GET') {
    const result = await env.PAYMENTS_DB.prepare(
      `SELECT id,name,description,category,price_minor,available,created_at,updated_at FROM store_products ORDER BY created_at DESC LIMIT 500`
    ).all<any>();
    return json({ products: (result.results || []).map((r: any) => ({
      id:r.id,name:r.name,description:r.description,category:r.category,
      price:Number(r.price_minor)/100,available:Number(r.available)===1,
      createdAt:r.created_at,updatedAt:r.updated_at
    })) });
  }
  if (url.pathname === '/api/admin/products' && request.method === 'POST') {
    const body = await parseJson(request);
    const id = safeText(body?.id, 80).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const name = safeText(body?.name, 120);
    const description = safeText(body?.description, 2000);
    const category = safeText(body?.category, 80) || 'General';
    const price = Number(body?.price);
    const available = body?.available === false ? 0 : 1;
    if (!id || !name || !Number.isFinite(price) || price <= 0 || price > 10000000) return bad('Enter a valid product ID, name, and positive price.');
    try {
      await env.PAYMENTS_DB.prepare(
        `INSERT INTO store_products (id,name,description,category,price_minor,available) VALUES (?,?,?,?,?,?)`
      ).bind(id,name,description,category,Math.round(price*100),available).run();
    } catch {
      return bad('Product ID already exists or the product could not be saved.', 409);
    }
    return json({ saved:true,id }, 201);
  }
  if (url.pathname.startsWith('/api/admin/products/') && request.method === 'PATCH') {
    const id = decodeURIComponent(url.pathname.slice('/api/admin/products/'.length));
    const body = await parseJson(request);
    const name = safeText(body?.name, 120);
    const description = safeText(body?.description, 2000);
    const category = safeText(body?.category, 80) || 'General';
    const price = Number(body?.price);
    const available = body?.available === false ? 0 : 1;
    if (!id || !name || !Number.isFinite(price) || price <= 0 || price > 10000000) return bad('Enter a valid product name and positive price.');
    const result = await env.PAYMENTS_DB.prepare(
      `UPDATE store_products SET name=?,description=?,category=?,price_minor=?,available=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(name,description,category,Math.round(price*100),available,id).run();
    if (!result.meta.changes) return bad('Product not found.', 404);
    return json({ saved:true });
  }
  if (url.pathname === '/api/admin/orders/fulfillment' && request.method === 'POST') {
    const body = await parseJson(request);
    const reference = safeText(body?.referenceNumber, 100);
    const fulfillment = safeText(body?.fulfillmentStatus, 30);
    if (!reference || !['unfulfilled','processing','shipped','completed','cancelled'].includes(fulfillment)) return bad('Invalid fulfillment update.');
    const result = await env.PAYMENTS_DB.prepare(
      `UPDATE store_orders SET fulfillment_status=?, updated_at=CURRENT_TIMESTAMP WHERE reference_number=? AND status='paid'`
    ).bind(fulfillment, reference).run();
    if (!result.meta.changes) return bad('Paid order not found or no change applied.', 404);
    return json({ updated: true });
  }
  return bad('Not found.', 404);
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin') || '', env) });
    let response: Response;
    try {
      if (url.pathname === '/health' && request.method === 'GET') {
        response = json({ service: 'marjonsealza-paymongo', ready: Boolean(env.PAYMONGO_SECRET_KEY && env.PAYMONGO_WEBHOOK_SECRET && env.PAYMENTS_DB), mode: env.PAYMONGO_MODE });
      } else if (url.pathname === '/api/products' && request.method === 'GET') {
        const catalog = await getCatalog(env);
        response = json({ products: catalog.map(p => ({ id: p.id, name: p.name, description: p.description, price: p.priceMinor / 100, category: p.category, available: p.available })) });
      } else if (url.pathname === '/api/checkout' && request.method === 'POST') {
        response = await createCheckout(request, env);
      } else if (url.pathname.startsWith('/api/orders/') && request.method === 'GET') {
        response = await orderLookup(decodeURIComponent(url.pathname.slice('/api/orders/'.length)), env);
      } else if (url.pathname === '/webhooks/paymongo' && request.method === 'POST') {
        response = await paymongoWebhook(request, env);
      } else if (url.pathname.startsWith('/api/admin/')) {
        response = await admin(request, env, url);
      } else {
        response = bad('Not found.', 404);
      }
    } catch (error) {
      // Do not log request bodies, payment credentials, or customer data.
      console.error('worker_error', error instanceof Error ? error.name : 'UnknownError');
      response = bad('An unexpected server error occurred.', 500);
    }
    return withCors(response, request, env);
  }
};
