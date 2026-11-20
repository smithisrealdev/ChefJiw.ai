// ถามเชฟจิ๋ว: ต้องเข้าสู่ระบบ ฟรีวันละ FREE_PER_DAY คำถาม สมาชิกไม่จำกัด คำถามที่ล้มเหลวคืนสิทธิ์
import { admin, chat, cors, FREE_PER_DAY, isLang, isText, json, localDay, MODELS, requireUser } from '../_shared/common.ts';
import { messages } from './prompt.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const user = await requireUser(req);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const body = await req.json().catch(() => ({}));
  const { question, recipe, step, lang, tzOffset, context, mode } = body ?? {};
  if (!isText(question, 500) || !isText(recipe, 80) || !isText(step, 80) || !isLang(lang)) return json({ error: 'bad_request' }, 400);
  // รายละเอียดของขั้น (แอปรุ่นใหม่ส่งมา) ไม่ส่งมาก็ตอบได้เหมือนเดิม
  if (context !== undefined && !isText(context, 1500)) return json({ error: 'bad_request' }, 400);

  const day = localDay(tzOffset);
  const { data: allowed, error } = await admin.rpc('reserve_ai_call', { p_user: user.id, p_day: day, p_limit: FREE_PER_DAY });
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
    await admin.rpc('refund_ai_call', { p_user: user.id, p_day: day });
    console.error('ask failed', e);
    return json({ error: 'failed' }, 502);
  }
});
