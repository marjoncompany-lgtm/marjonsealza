import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('frontend entry routes /admin to the protected admin interface', async () => {
  const main = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8');
  assert.match(main, /import Admin from '\.\/Admin'/);
  assert.match(main, /window\.location\.pathname\.startsWith\('\/admin'\) \? Admin : App/);
});

test('Worker exposes product administration only through admin router', async () => {
  const worker = await readFile(new URL('../worker/index.ts', import.meta.url), 'utf8');
  assert.match(worker, /url\.pathname\.startsWith\('\/api\/admin\/'\)/);
  assert.match(worker, /Authorization/);
  assert.match(worker, /\/api\/admin\/products/);
});
