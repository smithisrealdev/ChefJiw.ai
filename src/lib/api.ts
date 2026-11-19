// จุดเชื่อม backend จุดเดียวของแอป: ถาม AI, คิดเมนู, เช็กราคา, เข้าสู่ระบบ, ซื้อสมาชิก
// ตั้ง EXPO_PUBLIC_API_URL เมื่อมี backend แล้ว ทุกหน้าจอจะเรียกผ่านที่นี่ และแสดงสถานะผิดพลาดของจริงเมื่อเรียกไม่ได้
// ห้ามใส่ API key ของโมเดลไว้ในแอป ให้ backend เป็นคนถือ
export type ApiErrorKind = 'not_configured' | 'offline' | 'failed';
export class ApiError extends Error {
  constructor(public kind: ApiErrorKind) { super(kind); }
}

const BASE = process.env.EXPO_PUBLIC_API_URL;

export async function call<T>(path: string, body: unknown, token?: string): Promise<T> {
  if (!BASE) throw new ApiError('not_configured');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(BASE + path, {
      method: 'POST', signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError('failed');
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    // fetch ที่ล้มก่อนได้คำตอบ (ไม่มีเน็ต หรือหมดเวลา) แยกจากเซิร์ฟเวอร์ตอบผิดพลาด
    throw new ApiError('offline');
  } finally {
    clearTimeout(timer);
  }
}

export type Provider = 'line' | 'google' | 'apple';
export type Plan = 'monthly' | 'yearly';
export type MenuIdea = { name: string; country: string; missing: string[] };
export type PriceRow = { id: string; name: string; unit: string; price: number; change: number };

export const api = {
  askChef: (question: string, ctx: { recipe: string; step: string; lang: string }, token?: string) =>
    call<{ answer: string }>('/ask', { question, ...ctx }, token),
  suggestMenus: (have: string[], country: string, lang: string) => call<{ ideas: MenuIdea[] }>('/menus', { have, country, lang }),
  prices: (country: string, lang: string) => call<{ rows: PriceRow[]; updatedAt: string; source: string }>('/prices', { country, lang }),
  signIn: (provider: Provider) => call<{ token: string }>('/auth', { provider }),
  purchase: (plan: Plan, token?: string) => call<{ member: boolean }>('/purchase', { plan }, token),
  restore: (token?: string) => call<{ member: boolean }>('/restore', {}, token),
};
