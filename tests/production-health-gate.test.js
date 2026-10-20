import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const script = await readFile(new URL('../scripts/check-production-health.mjs', import.meta.url), 'utf8');
const checklist = await readFile(new URL('../DEPLOYMENT_CHECKLIST.md', import.meta.url), 'utf8');

test('production health command is available and targets the existing Worker', () => {
  assert.equal(packageJson.scripts['production:health'], 'node scripts/check-production-health.mjs');
  assert.match(script, /marjonsealza-paymongo\.emeritabuilder\.workers\.dev\/health/);
});

test('production health gate fails closed when Worker is not ready', () => {
  assert.match(script, /body\.ready !== true/);
  assert.match(script, /process\.exitCode = 1/);
  assert.match(script, /Configure required secrets in Cloudflare/);
});

test('deployment checklist requires health gate before checkout testing', () => {
  assert.match(checklist, /npm run production:health/);
  assert.match(checklist, /ready=true/);
});
