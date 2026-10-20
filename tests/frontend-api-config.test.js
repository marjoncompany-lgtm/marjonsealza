import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const api = await readFile(new URL('../src/api.ts', import.meta.url), 'utf8');
const worker = await readFile(new URL('../worker/index.ts', import.meta.url), 'utf8');

test('storefront API defaults to the existing PayMongo Worker when no build variable is set', () => {
  assert.match(api, /VITE_API_BASE_URL \|\| 'https:\/\/marjonsealza-paymongo\.emeritabuilder\.workers\.dev'/);
});

test('CORS permits both apex and www origins for the configured site', () => {
  assert.match(worker, /const wwwOrigin = appUrl\.hostname\.startsWith\('www\.'\)/);
  assert.match(worker, /new Set\(\[appOrigin, wwwOrigin,/);
});
