import Anthropic from '@anthropic-ai/sdk';
import { createClient, type User } from '@supabase/supabase-js';

export const MODEL = 'claude-opus-5-5';
export const FREE_PER_DAY = 3;
export const COUNTRIES = ['TH', 'JP', 'US'] as const;
export type Country = (typeof COUNTRIES)[number];

// อ่าน ANTHROPIC_API_KEY จาก secret ของ edge function
export const anthropic = new Anthropic();
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

export const isText = (v: unknown, max: number): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
export const isLang = (v: unknown): v is 'th' | 'en' => v === 'th' || v === 'en';
export const isCountry = (v: unknown): v is Country => COUNTRIES.includes(v as Country);

/** ข้อความตอบสุดท้ายจากโมเดล โยน error เมื่อถูกปฏิเสธหรือไม่มีข้อความ */
export function finalText(msg: { stop_reason: string | null; content: { type: string; text?: string }[] }) {
  if (msg.stop_reason === 'refusal') throw new Error('refusal');
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text ?? '').join('').trim();
  if (!text) throw new Error('empty');
  return text;
}
