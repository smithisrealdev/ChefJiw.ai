/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { actsAt, shownStage, stageAt } from './kitchen.ts';
import { buildRecipe, MENU } from './recipes.ts';

test('every step of every ready dish has a kitchen spot', () => {
  for (const m of MENU.filter((x) => x.ready)) {
    const r = buildRecipe(m.id)!;
    r.steps.forEach((s, i) => assert.ok(stageAt(m.id, r.steps, i).at, `${m.id} ${s.id}`));
  }
});

test('the pan and the side plate carry over until a later step changes them', () => {
  const r = buildRecipe('kaprao')!;
  const at = (id: string) => stageAt('kaprao', r.steps, r.steps.findIndex((s) => s.id === id));
  assert.deepEqual(at('fridge').pan, []);
  assert.equal(at('scoop').side, 'egg');
  assert.equal(at('basil').side, 'egg'); // ไข่ดาวพักข้างเตาจนจัดจาน
  assert.equal(at('plate').side, 'dish');
  assert.deepEqual(at('chop').board, ['bits']);
  assert.deepEqual(at('stove').board, []); // ของบนเขียงมีเฉพาะขั้นที่ทำบนเขียง
  assert.equal(at('pork').heat, 3);
  assert.equal(at('basil').heat, 0);
  assert.equal(at('plate').heat, 0);
  assert.equal(at('chop').pose, 'chop');
});

test('moo palo keeps simmering while tasting, uses a pot, and the eggs boil while the pork is cut', () => {
  const r = buildRecipe('moo-palo')!;
  const at = (id: string) => stageAt('moo-palo', r.steps, r.steps.findIndex((s) => s.id === id));
  assert.equal(at('mp-taste').pot, true);
  assert.equal(at('mp-taste').heat, 1);
  assert.deepEqual(at('mp-taste').pan, ['stew', 'pork', 'eggs']);
  assert.deepEqual(at('mp-cut').pan, ['water', 'eggs']);
  assert.equal(at('mp-braise').side, null); // ไข่ที่ปอกแล้วลงหม้อไป
  assert.equal(at('mp-store').heat, 0);
});

test('each step asks for the taps that match what changes in the kitchen', () => {
  const r = buildRecipe('kaprao')!;
  const acts = (id: string) => actsAt('kaprao', r.steps, r.steps.findIndex((s) => s.id === id), ['pork', 'egg', 'basil']).map((a) => a.food ? `${a.kind}:${a.food}` : `${a.kind}${a.taps > 1 ? 'x' + a.taps : ''}`);
  assert.deepEqual(acts('fridge'), ['pick', 'pick', 'pick']);
  assert.deepEqual(acts('chop'), ['chopx3']);
  assert.deepEqual(acts('wash'), ['tap']);
  assert.deepEqual(acts('stove'), ['heatx2']);
  assert.deepEqual(acts('fry'), ['add:oil', 'add:egg', 'stir']);
  assert.deepEqual(acts('scoop'), ['scoop']);
  assert.deepEqual(acts('pork'), ['heat', 'add:mince', 'stir']);
  assert.deepEqual(acts('basil'), ['heatx3', 'add:leaves', 'stir']);
  assert.deepEqual(acts('plate'), ['plate']);
  const om = buildRecipe('omelet')!;
  assert.deepEqual(actsAt('omelet', om.steps, om.steps.findIndex((s) => s.id === 'flip'), []).map((a) => a.kind), ['flip']);
});

test('the kitchen changes one tap at a time and ends at the step state', () => {
  const r = buildRecipe('kaprao')!, i = r.steps.findIndex((s) => s.id === 'pork');
  const acts = actsAt('kaprao', r.steps, i, []);
  assert.deepEqual(shownStage('kaprao', r.steps, i, acts, []).pan, ['oil', 'bits']); // ยังไม่ได้แตะ: เหมือนขั้นก่อน
  assert.equal(shownStage('kaprao', r.steps, i, acts, []).heat, 2);
  assert.equal(shownStage('kaprao', r.steps, i, acts, [1]).heat, 3);
  assert.deepEqual(shownStage('kaprao', r.steps, i, acts, [1, 1]).pan, ['mince', 'bits']);
  assert.deepEqual(shownStage('kaprao', r.steps, i, acts, [1, 1, 1]), stageAt('kaprao', r.steps, i));
  const p = r.steps.findIndex((s) => s.id === 'plate'), pa = actsAt('kaprao', r.steps, p, []);
  assert.equal(shownStage('kaprao', r.steps, p, pa, []).side, 'egg'); // ไข่ดาวยังพักอยู่จนกว่าจะแตะจัดจาน
  assert.equal(shownStage('kaprao', r.steps, p, pa, [1]).side, 'dish');
});
