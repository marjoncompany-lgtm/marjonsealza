import process from 'node:process';

const endpoint = process.env.PAYMONGO_HEALTH_URL || 'https://marjonsealza-paymongo.emeritabuilder.workers.dev/health';

try {
  const response = await fetch(endpoint, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body || typeof body.ready !== 'boolean') {
    console.error(`FAIL: health endpoint returned HTTP ${response.status} or an invalid JSON health payload.`);
    process.exitCode = 1;
  } else if (body.ready !== true) {
    console.error(`BLOCKED: Worker reports ready=false (mode=${String(body.mode ?? 'unknown')}). Configure required secrets in Cloudflare and recheck.`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: Worker reports ready=true (mode=${String(body.mode ?? 'unknown')}).`);
  }
} catch (error) {
  console.error(`FAIL: could not reach Worker health endpoint (${error instanceof Error ? error.name : 'unknown error'}).`);
  process.exitCode = 1;
}
