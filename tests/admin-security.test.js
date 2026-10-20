import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const worker = readFileSync(new URL('../worker/index.ts', import.meta.url), 'utf8');
const migration = readFileSync(new URL('../migrations/0003_admin_audit_log.sql', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const adminUi = readFileSync(new URL('../src/Admin.tsx', import.meta.url), 'utf8');

test('admin API requires a long configured bearer token', () => {
  assert.match(worker, /ADMIN_API_TOKEN\.length < 32/);
  assert.match(worker, /constantTimeEqual\(supplied, `Bearer \$\{env\.ADMIN_API_TOKEN\}`\)/);
});

test('admin actions and denied authentication attempts are audited', () => {
  assert.match(worker, /admin\.auth_denied/);
  assert.match(worker, /auditAdmin\(env, request, `admin\.\$\{request\.method\.toLowerCase\(\)\}`/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS admin_audit_log/);
  assert.match(migration, /ip_hash TEXT/);
});

test('CORS allows the PATCH method required for product edits', () => {
  assert.match(worker, /Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS'/);
});

test('admin UI has a worker API fallback and does not persist the token', () => {
  assert.match(adminUi, /https:\/\/marjonsealza-paymongo\.emeritabuilder\.workers\.dev/);
  assert.doesNotMatch(adminUi, /localStorage\.setItem|sessionStorage\.setItem/);
});

test('migration scripts use tracked migrations and the additive audit migration exists', () => {
  assert.match(packageJson.scripts['db:migrate:remote'], /d1 migrations apply/);
  assert.match(packageJson.scripts['db:migrate:local'], /d1 migrations apply/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS admin_audit_log/);
});
