/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { badges, cookedDays, monthGrid } from './calendar.ts';

test('month grid starts on the right weekday and covers every day', () => {
  const nov = monthGrid(2026, 10); // 1 พ.ย. 2026 เป็นวันอาทิตย์ มี 30 วัน
  assert.deepEqual(nov[0], [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(nov.at(-1), [29, 30, null, null, null, null, null]);
  const feb = monthGrid(2027, 1); // 1 ก.พ. 2027 เป็นวันจันทร์ มี 28 วัน
  assert.deepEqual(feb[0], [null, 1, 2, 3, 4, 5, 6]);
  assert.equal(feb.flat().filter(Boolean).length, 28);
  assert.ok(monthGrid(2026, 7).every((w) => w.length === 7));
});

test('cooked days keep the best dish of the day and only this month', () => {
  const at = (m: number, d: number, h = 12) => new Date(2026, m, d, h).getTime();
  const runs = [{ recipe: 'omelet', score: 3, at: at(10, 20, 9) }, { recipe: 'kaprao', score: 4.3, at: at(10, 20, 19) }, { recipe: 'green-curry', score: 5, at: at(9, 31) }];
  const days = cookedDays(runs, 2026, 10);
  assert.deepEqual([...days.keys()], [20]);
  assert.equal(days.get(20)!.recipe, 'kaprao');
});

test('badges follow the real runs', () => {
  assert.deepEqual(badges([]), { first: false, five: false, perfect: false });
  const run = (score: number) => ({ recipe: 'kaprao', score, at: 1 });
  assert.deepEqual(badges([run(4)]), { first: true, five: false, perfect: false });
  assert.deepEqual(badges([run(4), run(3), run(5), run(2), run(4)]), { first: true, five: true, perfect: true });
});
