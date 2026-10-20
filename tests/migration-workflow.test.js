import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const wrangler = await readFile(new URL('../wrangler.toml', import.meta.url), 'utf8');
const checklist = await readFile(new URL('../DEPLOYMENT_CHECKLIST.md', import.meta.url), 'utf8');

test('local and remote database migration commands use Wrangler migration tracking', () => {
  assert.match(pkg.scripts['db:migrate:local'], /d1 migrations apply .*--local/);
  assert.match(pkg.scripts['db:migrate:remote'], /d1 migrations apply .*--remote/);
  assert.doesNotMatch(pkg.scripts['db:migrate:remote'], /--file=.*0002/);
  assert.match(wrangler, /migrations_dir\s*=\s*"migrations"/);
});

test('deployment checklist requires schema and migration-history inspection before applying migrations', () => {
  assert.match(checklist, /migration history/i);
  assert.match(checklist, /do not apply migrations blindly/i);
});


test('dangerous fresh-install remote migration script is absent', () => {
  assert.equal(pkg.scripts['db:migrate:fresh:remote'], undefined);
  assert.match(pkg.scripts['db:inspect:remote'], /sqlite_master/);
});
