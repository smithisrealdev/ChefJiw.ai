// ถามเชฟจิ๋ว: ฟรีวันละ FREE_PER_DAY คำถาม สมาชิกไม่จำกัด คำถามที่ล้มเหลวคืนสิทธิ์
// มีบัญชีนับต่อผู้ใช้ ช่วงเบต้าไม่มีบัญชีก็ถามได้ นับต่อรหัสเครื่อง และมีเพดานรวมต่อวัน
import { admin, BETA, chat, cors, FREE_PER_DAY, GUEST_TOTAL_PER_DAY, isDevice, isLang, isText, json, localDay, MODELS, requireUser } from '../_shared/common.ts';
import { messages } from './prompt.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const user = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const { question, recipe, step, lang, tzOffset, context, mode, device } = body ?? {};
  if (!user && !(BETA && isDevice(device))) return json({ error: 'unauthorized' }, 401);
  if (!isText(question, 500) || !isText(recipe, 80) || !isText(step, 80) || !isLang(lang)) return json({ error: 'bad_request' }, 400);
  // รายละเอียดของขั้น (แอปรุ่นใหม่ส่งมา) ไม่ส่งมาก็ตอบได้เหมือนเดิม
  if (context !== undefined && !isText(context, 1500)) return json({ error: 'bad_request' }, 400);

  const day = localDay(tzOffset);
  const { data: allowed, error } = user
    ? await admin.rpc('reserve_ai_call', { p_user: user.id, p_day: day, p_limit: FREE_PER_DAY })
    : await admin.rpc('reserve_device_call', { p_device: device, p_day: day, p_limit: FREE_PER_DAY, p_total: GUEST_TOTAL_PER_DAY });
  if (error) return json({ error: 'failed' }, 500);
  if (!allowed) return json({ error: 'quota' }, 429);

  try {
    const answer = await chat(MODELS.ask, {
      max_tokens: 2000,
      reasoning: { effort: 'low' },
      messages: messages({ question, recipe, step, lang, context, rescue: mode === 'rescue' }),
    });
    return json({ answer });
  } catch (e) {
    await (user ? admin.rpc('refund_ai_call', { p_user: user.id, p_day: day }) : admin.rpc('refund_device_call', { p_device: device, p_day: day }));
    console.error('ask failed', e);
    return json({ error: 'failed' }, 502);
  }
});
