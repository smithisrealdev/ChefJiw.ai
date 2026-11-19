// งานรายวัน: ให้โมเดลค้นราคาวัตถุดิบจากเว็บต่อประเทศ แล้วบันทึกลงตาราง prices
// เรียกจาก pg_cron เท่านั้น ตรวจ x-cron-secret กับ Vault ผ่าน check_cron_secret
import { admin, chat, cors, json, MODELS, type Country } from '../_shared/common.ts';

// ตรงกับรายการใน src/data/market.ts ของแอป
const ITEMS: Record<Country, { id: string; name: string; unit: string; currency: string }[]> = {
  TH: [['pork', 'minced pork', 'per kg'], ['chicken', 'chicken breast', 'per kg'], ['egg', 'eggs', 'tray of 30'], ['morning', 'morning glory', 'per bunch'],
    ['basil', 'holy basil', 'per bunch'], ['chili', "bird's eye chili", 'per 100 g'], ['garlic', 'garlic', 'per kg'], ['rice', 'jasmine rice', 'per kg']]
    .map(([id, name, unit]) => ({ id, name, unit, currency: 'THB' })),
  JP: [['pork', 'minced pork', 'per 100 g'], ['chicken', 'chicken thigh', 'per 100 g'], ['egg', 'eggs', 'pack of 10'], ['negi', 'Japanese leek', 'each'],
    ['tofu', 'tofu', 'per block'], ['soy', 'soy sauce', '500 ml bottle'], ['rice', 'Japanese rice', '2 kg bag']]
    .map(([id, name, unit]) => ({ id, name, unit, currency: 'JPY' })),
  US: [['chicken', 'chicken breast', 'per lb'], ['egg', 'eggs', 'per dozen'], ['garlic', 'garlic', 'per head'], ['butter', 'butter', 'per lb'],
    ['pasta', 'dry pasta', '1 lb box'], ['rice', 'long-grain rice', '2 lb bag']]
    .map(([id, name, unit]) => ({ id, name, unit, currency: 'USD' })),
};

async function lookup(country: Country) {
  const items = ITEMS[country];
  const prompt = `Find today's typical retail price in ${country} for each item, using recent supermarket or official market price pages.\n` +
    items.map((i) => `- ${i.id}: ${i.name}, ${i.unit}, in ${i.currency}`).join('\n') +
    `\n\nReply with only a JSON object: {"source": "<main site name>", "rows": [{"id": "<id>", "price": <number>}]}. Skip items you cannot find.`;
  // ปลั๊กอิน web ของ OpenRouter ค้นเว็บให้ก่อนส่งให้โมเดล
  const text = await chat(MODELS.prices, { max_tokens: 8000, reasoning: { effort: 'medium' }, plugins: [{ id: 'web', max_results: 8 }], messages: [{ role: 'user', content: prompt }] });
  const parsed = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  const known = new Set(items.map((i) => i.id));
  const rows = (Array.isArray(parsed.rows) ? parsed.rows : [])
    .filter((r: { id: unknown; price: unknown }) => known.has(String(r.id)) && Number.isFinite(Number(r.price)) && Number(r.price) > 0)
    .map((r: { id: string; price: number }) => ({ id: r.id, price: Number(r.price) }));
  return { source: String(parsed.source ?? 'web').slice(0, 80), rows };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const given = req.headers.get('x-cron-secret');
  const { data: ok } = given ? await admin.rpc('check_cron_secret', { p: given }) : { data: false };
  if (!ok) return json({ error: 'unauthorized' }, 401);

  const report: Record<string, number | string> = {};
  for (const country of Object.keys(ITEMS) as Country[]) {
    try {
      const { source, rows } = await lookup(country);
      const { data: prev } = await admin.from('prices').select('item_id, price').eq('country', country);
      const old = new Map((prev ?? []).map((p) => [p.item_id, Number(p.price)]));
      const now = new Date().toISOString();
      const upsert = rows.map((r: { id: string; price: number }) => ({
        country, item_id: r.id, price: r.price, change: old.has(r.id) ? Math.round((r.price - old.get(r.id)!) * 100) / 100 : 0, source, updated_at: now,
      }));
      if (upsert.length) {
        const { error } = await admin.from('prices').upsert(upsert);
        if (error) throw error;
      }
      report[country] = upsert.length;
    } catch (e) {
      // ประเทศที่ล้มเหลวคงราคาเดิมไว้ ไม่ลบทิ้ง
      console.error('price update failed', country, e);
      report[country] = 'failed';
    }
  }
  return json(report);
});
