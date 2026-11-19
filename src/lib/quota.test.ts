/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freeLeft, localDay, spendOne } from './quota.ts';

test('free questions reset each day and never go negative', () => {
  assert.equal(freeLeft({ day: '', n: 0 }, '2026-11-19'), 3);
  assert.equal(freeLeft({ day: '2026-11-19', n: 2 }, '2026-11-19'), 1);
  assert.equal(freeLeft({ day: '2026-11-19', n: 5 }, '2026-11-19'), 0);
  assert.equal(freeLeft({ day: '2026-11-18', n: 3 }, '2026-11-19'), 3);
  assert.deepEqual(spendOne({ day: '2026-11-18', n: 3 }, '2026-11-19'), { day: '2026-11-19', n: 1 });
  assert.deepEqual(spendOne({ day: '2026-11-19', n: 1 }, '2026-11-19'), { day: '2026-11-19', n: 2 });
  assert.equal(localDay(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
});
