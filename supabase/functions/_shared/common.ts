import { createClient, type User } from '@supabase/supabase-js';

// โมเดลต่องานผ่าน OpenRouter ตัวแรกคือตัวหลัก ตัวถัดไปเป็นสำรองเมื่อตัวหลักล่ม (เลือกจากการทดสอบแบบปิดชื่อ)
export const MODELS = {
  ask: ['openai/gpt-6-luna', 'anthropic/claude-haiku-5.5'],
  menus: ['anthropic/claude-haiku-5.5', 'openai/gpt-6-luna'],
  prices: ['anthropic/claude-sonnet-5.5', 'anthropic/claude-haiku-5.5'],
};
// เบต้า: ยังไม่มีระบบจ่ายเงิน จึงให้ถามฟรีวันละ 20 ต้องตรงกับแอป (src/lib/beta.ts) ปิดเบต้าแล้วเปลี่ยนเป็น false แล้ว deploy ask กับ menus ใหม่
export const BETA = true;
export const FREE_PER_DAY = BETA ? 20 : 3;
// เบต้า: ผู้ใช้ไม่มีบัญชีถามได้ต่อรหัสเครื่อง รหัสปลอมได้ จึงจำกัดรวมทุกเครื่องต่อวันไว้ด้วย
export const GUEST_TOTAL_PER_DAY = 300;
export const COUNTRIES = ['TH', 'JP', 'US'] as const;
export type Country = (typeof COUNTRIES)[number];

export const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/** ผู้ใช้ที่เข้าสู่ระบบจริงจาก token ใน header (anon key ไม่นับ) */
export async function requireUser(req: Request): Promise<User | null> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  return error ? null : data.user;
}

/** วันที่ตามเวลาท้องถิ่นของผู้ใช้ จาก offset นาทีที่แอปส่งมา (จำกัดช่วงให้อยู่ในเขตเวลาที่มีจริง) */
export function localDay(offsetMinutes: unknown, now = Date.now()) {
  const off = Math.max(-720, Math.min(840, Math.round(Number(offsetMinutes) || 0)));
  return new Date(now + off * 60_000).toISOString().slice(0, 10);
}

/** รหัสเครื่องที่แอปสุ่มไว้ (ตัวเล็กกับตัวเลข) ตรงกับ check ของตาราง ai_usage_device */
export const isDevice = (v: unknown): v is string => typeof v === 'string' && /^[a-z0-9]{8,64}$/.test(v);
export const isText = (v: unknown, max: number): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
export const isLang = (v: unknown): v is 'th' | 'en' => v === 'th' || v === 'en';
export const isCountry = (v: unknown): v is Country => COUNTRIES.includes(v as Country);

/** เรียกโมเดลผ่าน OpenRouter (key อยู่ใน secret OPENROUTER_API_KEY ของ edge function) คืนข้อความตอบ โยน error เมื่อล้มเหลว ถูกกรอง หรือว่าง */
export async function chat(models: string[], body: Record<string, unknown>): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`, 'Content-Type': 'application/json', 'X-Title': 'ChefJiw' },
    body: JSON.stringify({ models, ...body }),
  });
  if (!res.ok) throw new Error(`openrouter ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const choice = (await res.json()).choices?.[0];
  if (choice?.finish_reason === 'content_filter') throw new Error('refusal');
  const text = String(choice?.message?.content ?? '').trim();
  if (!text) throw new Error('empty');
  return text;
}
