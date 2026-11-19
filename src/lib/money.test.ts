/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { money } from './money.ts';

test('formats sample baht prices per country', () => {
  assert.equal(money(50, 'TH'), '฿50');
  assert.equal(money(0.5, 'TH'), '฿0.5');
  assert.equal(money(50, 'JP'), '¥230');
  assert.equal(money(1, 'JP'), '¥10');
  assert.equal(money(50, 'US'), '$1.50');
});
