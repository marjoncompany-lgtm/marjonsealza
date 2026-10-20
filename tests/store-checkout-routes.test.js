import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

test('direct /store route renders the store without portfolio sections', () => {
  assert.match(app, /const standaloneStore = pathname === '\/store'/);
  assert.match(app, /!standaloneCheckout && <section id="store"/);
  assert.match(app, /!standaloneStore && !standaloneCheckout && <>/);
});

test('direct /checkout route renders checkout without the catalog section', () => {
  assert.match(app, /const standaloneCheckout = pathname === '\/checkout'/);
  assert.match(app, /!standaloneStore && <section className="content-section checkout-section"/);
  assert.match(app, /!standaloneCheckout && <section id="store"/);
});

test('cart is restored from session storage so navigation does not erase it', () => {
  assert.match(app, /sessionStorage\.getItem\('ms-life-store-cart'\)/);
  assert.match(app, /sessionStorage\.setItem\('ms-life-store-cart', JSON\.stringify\(cart\)\)/);
});

test('main navigation exposes direct store and checkout paths', () => {
  assert.match(app, /href="\/store">Store/);
  assert.match(app, /href="\/checkout">Checkout/);
});
