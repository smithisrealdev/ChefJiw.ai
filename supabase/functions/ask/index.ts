// ถามเชฟช้าง: ต้องเข้าสู่ระบบ ฟรีวันละ 3 คำถาม สมาชิกไม่จำกัด คำถามที่ล้มเหลวคืนสิทธิ์
import { admin, anthropic, cors, finalText, FREE_PER_DAY, isLang, isText, json, localDay, MODEL, requireUser } from '../_shared/common.ts';

const SYSTEM = `You are Chef Elephant, the cooking coach inside a step-by-step cooking app for home cooks in Thailand and beyond.
The person is cooking right now, often with messy hands, so answer in 2 to 4 short, plain sentences they can act on at the stove.
Answer only about cooking, ingredients, kitchen technique and kitchen safety. If the question is about something else, say briefly that you can only help with cooking.
If the question involves fire, burns, gas, injury or food poisoning, give the immediate safe action first and tell them to call local emergency services when it is serious. Never guess about allergies or medical issues; tell them to check with a doctor.
Reply in the language given in the request.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const user = await requireUser(req);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const body = await req.json().catch(() => ({}));
  const { question, recipe, step, lang, tzOffset } = body ?? {};
  if (!isText(question, 500) || !isText(recipe, 40) || !isText(step, 40) || !isLang(lang)) return json({ error: 'bad_request' }, 400);

  const day = localDay(tzOffset);
  const { data: allowed, error } = await admin.rpc('reserve_ai_call', { p_user: user.id, p_day: day, p_limit: FREE_PER_DAY });
  if (error) return json({ error: 'failed' }, 500);
  if (!allowed) return json({ error: 'quota' }, 429);

  try {
    const msg = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 2000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: SYSTEM,
      messages: [{ role: 'user', content: `Language: ${lang === 'th' ? 'Thai' : 'English'}\nDish: ${recipe}\nCurrent step: ${step}\n\nQuestion:\n${question}` }],
    });
    return json({ answer: finalText(msg) });
  } catch (e) {
    await admin.rpc('refund_ai_call', { p_user: user.id, p_day: day });
    console.error('ask failed', e);
    return json({ error: 'failed' }, 502);
  }
});
