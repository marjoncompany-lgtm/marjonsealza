import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('fallback seed catalog keeps unapproved products unavailable', async () => {
  const source = await readFile(new URL('../worker/index.ts', import.meta.url), 'utf8');
  assert.match(source, /id: 'digital-consultation',[^\n]*available: false/);
  assert.match(source, /id: 'website-planning',[^\n]*available: false/);
  assert.match(source, /id: 'custom-project-inquiry',[^\n]*available: false/);
});
