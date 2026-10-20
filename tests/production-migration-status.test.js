import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('deployment checklist records the reconciled production D1 baseline', async () => {
  const checklist = await readFile(new URL('../DEPLOYMENT_CHECKLIST.md', import.meta.url), 'utf8');
  assert.match(checklist, /Version 18 — production D1 migration reconciliation/);
  assert.match(checklist, /0001_initial\.sql/);
  assert.match(checklist, /0002_storefront_admin\.sql/);
  assert.match(checklist, /0003_admin_audit_log\.sql/);
  assert.match(checklist, /No live website or Worker code was deployed/);
});

test('README does not claim PayMongo is ready before secrets and test checkout', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  assert.match(readme, /ready:false/);
  assert.match(readme, /required PayMongo\/Admin secrets remain unconfigured/);
  assert.match(readme, /real test-mode payment flow must still be completed/);
});
