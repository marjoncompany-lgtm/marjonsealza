import { readFile } from 'node:fs/promises';
import process from 'node:process';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const config = await readFile(new URL('../wrangler.toml', import.meta.url), 'utf8');
const requiredFiles = [
  '../worker/index.ts',
  '../worker/paymongo-webhook-utils.js',
  './check-production-health.mjs',
  '../migrations/0001_initial.sql',
  '../migrations/0002_storefront_admin.sql',
  '../migrations/0003_admin_audit_log.sql'
];
const problems = [];
for (const file of requiredFiles) {
  try { await readFile(new URL(file, import.meta.url)); }
  catch { problems.push(`Missing required file: ${file}`); }
}
if (/REPLACE_WITH|YOUR_DATABASE_ID/i.test(config)) problems.push('wrangler.toml still contains a placeholder database ID.');
if (!/database_id\s*=\s*"4f16fddd-9145-4a7f-b8a1-f05425c5f0f6"/.test(config)) problems.push('wrangler.toml does not point to the known existing PAYMENTS_DB.');
if (!/migrations_dir\s*=\s*"migrations"/.test(config)) problems.push('Wrangler migrations_dir is not configured.');
if (!pkg.scripts?.build || !pkg.scripts?.test) problems.push('Expected build/test scripts are missing.');
const missingSecrets = ['PAYMONGO_SECRET_KEY', 'PAYMONGO_WEBHOOK_SECRET', 'ADMIN_API_TOKEN'];
console.log('Static deployment preflight');
console.log(`Required source/config files: ${requiredFiles.length}`);
console.log(`Required Worker secrets (must be configured separately in Cloudflare): ${missingSecrets.join(', ')}`);
if (problems.length) {
  for (const problem of problems) console.error(`FAIL: ${problem}`);
  process.exitCode = 1;
} else {
  console.log('PASS: local configuration has no known placeholder database ID.');
  console.log('NOTE: this check cannot verify Cloudflare secrets, remote schema, or provider credentials.');
}
