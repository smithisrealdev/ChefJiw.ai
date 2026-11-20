/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lastAns, reminders, stepContext } from './assistant.ts';
import { buildRecipe, MENU } from '../data/recipes.ts';

test('the chef remembers only the latest run of this dish that has answers', () => {
  const runs = [{ recipe: 'kaprao', ans: [0, 1, 1] }, { recipe: 'omelet', ans: [2, 2, 2] }, { recipe: 'kaprao', ans: [2, 1, 0] }, { recipe: 'kaprao' }];
  assert.deepEqual(lastAns(runs, 'kaprao'), [2, 1, 0]);
  assert.equal(lastAns(runs, 'green-curry'), undefined);
});

test('reminders show up at the step the advice is about, and not for things that went well', () => {
  const r = buildRecipe('kaprao')!;
  const all = reminders(r, [2, 1, 0]);
  assert.deepEqual(all.map((m) => [m.said.th, m.step]), [['เค็มไป', 'season'], ['หมูซีด แฉะ', 'pork']]);
  assert.match(all[0].tip.th, /ลดน้ำปลา/);
  assert.equal(reminders(r, [2, 1, 0], 'season').length, 1);
  assert.equal(reminders(r, [2, 1, 0], 'fridge').length, 0);
  assert.equal(reminders(r, [1, 1, 1]).length, 0);
  assert.equal(reminders(r, undefined).length, 0);
});

test('every ready dish points its reminders at steps that exist', () => {
  for (const m of MENU.filter((x) => x.ready)) {
    const r = buildRecipe(m.id)!, ids = r.steps.map((s) => s.id);
    for (const ans of [[0, 0, 0], [2, 2, 2]]) {
      const got = reminders(r, ans);
      assert.equal(got.length, 3, m.id);
      for (const g of got) assert.ok(ids.includes(g.step), `${m.id} ${g.step}`);
    }
  }
});

test('the context sent to the AI names the step, the heat, the chosen options and last time', () => {
  const r = buildRecipe('kaprao', 2, 0)!, i = r.steps.findIndex((s) => s.id === 'pork');
  const ctx = stepContext(r, i, { o1: 2, o2: 0, heat: 'ไฟแรง', ans: [2, 1, 1], pick: (l) => l.th });
  assert.match(ctx, /Step 8 of 11/);
  assert.match(ctx, /Heat: ไฟแรง/);
  assert.match(ctx, /ความเผ็ด: เผ็ดจัด, สไตล์การผัด: ผัดแห้ง/);
  assert.match(ctx, /Previous step: ผัดกระเทียมพริก/);
  assert.match(ctx, /Last time the cook said รสชาติ: เค็มไป/);
  assert.ok(ctx.length <= 1500);
});
