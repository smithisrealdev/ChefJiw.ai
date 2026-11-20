/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stageAt } from './kitchen.ts';
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
