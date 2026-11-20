import { assertEquals } from '@std/assert';
import { isCountry, isDevice, isText, localDay } from './common.ts';

Deno.test('local day follows the user offset and clamps bad values', () => {
  const t = Date.UTC(2026, 10, 19, 20, 0); // 20:00 UTC = 03:00 next day in Bangkok
  assertEquals(localDay(420, t), '2026-11-20');
  assertEquals(localDay(-300, t), '2026-11-19');
  assertEquals(localDay('junk', t), '2026-11-19');
  assertEquals(localDay(99999, t), localDay(840, t));
});

Deno.test('input validation', () => {
  assertEquals(isText('  ', 10), false);
  assertEquals(isText('x'.repeat(11), 10), false);
  assertEquals(isCountry('JP'), true);
  assertEquals(isCountry('XX'), false);
  assertEquals(isDevice('k3j9x2m1mf0abc'), true);
  assertEquals(isDevice('short'), false);
  assertEquals(isDevice('Has-Upper_and-dash'), false);
});
