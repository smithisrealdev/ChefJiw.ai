/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { local, MARKET } from '../data/market.ts';
import { money } from './money.ts';

test('formats sample baht prices per country', () => {
  assert.equal(money(50, 'TH'), '฿50');
  assert.equal(money(0.5, 'TH'), '฿0.5');
  assert.equal(money(50, 'JP'), '¥230');
  assert.equal(money(1, 'JP'), '¥10');
  assert.equal(money(50, 'US'), '$1.50');
});


test('market prices show in the local currency with bilingual names', () => {
  assert.equal(local(1680, 'JP'), '¥1,680');
  assert.equal(local(3.9, 'US'), '$3.90');
  assert.equal(local(15, 'TH'), '฿15');
  for (const c of ['TH', 'JP', 'US'] as const) for (const it of MARKET[c].items) assert.ok(it.name.th && it.name.en && it.unit.en && it.price > 0);
});
