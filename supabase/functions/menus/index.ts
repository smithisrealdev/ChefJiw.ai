// คิดเมนูจากของที่มี: นับรวมในโควตาเดียวกับการถามเชฟ เพราะใช้โมเดลเหมือนกัน
import { admin, chat, cors, FREE_PER_DAY, isCountry, isLang, isText, json, localDay, requireUser } from '../_shared/common.ts';

const SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, country: { type: 'string' }, missing: { type: 'array', items: { type: 'string' } } },
        required: ['name', 'country', 'missing'],
        additionalProperties: false,
      },
    },
  },
  required: ['ideas'],
  additionalProperties: false,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const user = await requireUser(req);
  if (!user) return json({ error: 'unauthorized' }, 401);

  const body = await req.json().catch(() => ({}));
  const { have, country, lang, tzOffset } = body ?? {};
  if (!Array.isArray(have) || have.length === 0 || have.length > 20 || !have.every((h) => isText(h, 40)) || !isCountry(country) || !isLang(lang)) {
    return json({ error: 'bad_request' }, 400);
  }

  const day = localDay(tzOffset);
  const { data: allowed, error } = await admin.rpc('reserve_ai_call', { p_user: user.id, p_day: day, p_limit: FREE_PER_DAY });
  if (error) return json({ error: 'failed' }, 500);
  if (!allowed) return json({ error: 'quota' }, 429);

  try {
    const text = await chat({
      max_tokens: 4000,
      reasoning: { effort: 'low' },
      response_format: { type: 'json_schema', json_schema: { name: 'menu_ideas', strict: true, schema: SCHEMA } },
      messages: [
        { role: 'system', content: 'You suggest simple home dishes from ingredients someone already has. Prefer dishes from their country first, then one or two from other cuisines. Keep missing ingredients to staples they can buy easily.' },
        {
          role: 'user',
          content: `Country: ${country}\nLanguage for dish names, cuisine and missing items: ${lang === 'th' ? 'Thai' : 'English'}\nIngredients I have: ${have.join(', ')}\n\nSuggest 3 dishes. "country" is the cuisine name, e.g. "Thai food". "missing" lists main ingredients I still need (empty if none).`,
        },
      ],
    });
    const parsed = JSON.parse(text);
    return json({ ideas: parsed.ideas.slice(0, 5) });
  } catch (e) {
    await admin.rpc('refund_ai_call', { p_user: user.id, p_day: day });
    console.error('menus failed', e);
    return json({ error: 'failed' }, 502);
  }
});
