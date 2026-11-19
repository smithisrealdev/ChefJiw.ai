/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRecipe, fridgeFit, MENU, tasteScore } from './recipes.ts';

const TH = /[ก-ฺเ-๛]/;
const texts = (v: unknown, out: { th: string; en: string }[] = []) => {
  if (Array.isArray(v)) v.forEach((x) => texts(x, out));
  else if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.th === 'string' && typeof o.en === 'string') out.push(o as { th: string; en: string });
    else Object.values(o).forEach((x) => texts(x, out));
  }
  return out;
};

test('every option combination builds complete bilingual steps', () => {
  for (const id of ['kaprao', 'omelet', 'green-curry']) {
    for (const o1 of [0, 1, 2]) for (const o2 of [0, 1, 2]) for (const adapt of [[], ['pork', 'salt', 'basil']]) {
      const r = buildRecipe(id, o1, o2, adapt)!;
      assert.ok(r.steps.length >= 8, `${id} has steps`);
      assert.equal(Math.max(...r.steps.map((s) => s.phase)), r.phases, `${id} phases match`);
      for (const s of r.steps) {
        assert.ok(!s.timer || s.timer > 0);
        assert.ok(r.qa(s).length >= 1 && r.qa(s).length <= 3);
      }
      for (const t of texts(r)) {
        assert.ok(t.th.trim() && t.en.trim(), 'no empty text');
        assert.ok(!TH.test(t.en), `English has no Thai: ${t.en}`);
      }
    }
  }
});

test('adaptations swap the words in both languages', () => {
  const r = buildRecipe('kaprao', 1, 0, ['pork', 'basil'])!;
  const all = JSON.stringify(texts(r));
  assert.ok(!all.includes('หมู') && !/pork/i.test(all), 'no pork left');
  assert.ok(!all.includes('กะเพรา') && !/holy basil/i.test(all), 'no holy basil left');
  assert.equal(buildRecipe('omelet', 0, 0, [])!.steps.some((s) => s.id === 'chop'), false, 'no chili step when not spicy');
  assert.equal(buildRecipe('nope'), null);
});

test('fridge sort and taste score', () => {
  const omelet = MENU.find((m) => m.id === 'omelet')!;
  assert.deepEqual(fridgeFit(omelet, ['egg', 'pork']).hard, []);
  assert.deepEqual(fridgeFit(omelet, ['egg', 'chicken']).swaps, ['pork']);
  assert.equal(tasteScore([1, 1, 1]), 5);
  assert.equal(tasteScore([0, 1, 2]), 3.7);
});
