// ราคาล่าสุดของประเทศจากตาราง (อัปเดตรายวัน) ไม่เรียกโมเดล จึงไม่ต้องเข้าสู่ระบบ
import { admin, cors, isCountry, json } from '../_shared/common.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const { country } = (await req.json().catch(() => ({}))) ?? {};
  if (!isCountry(country)) return json({ error: 'bad_request' }, 400);

  const { data, error } = await admin.from('prices').select('item_id, price, change, source, updated_at').eq('country', country);
  if (error) return json({ error: 'failed' }, 500);
  if (!data.length) return json({ error: 'no_data' }, 404);
  const latest = data.reduce((a, b) => (a.updated_at > b.updated_at ? a : b));
  return json({
    rows: data.map((r) => ({ id: r.item_id, price: Number(r.price), change: Number(r.change) })),
    updatedAt: latest.updated_at,
    source: latest.source,
  });
});
