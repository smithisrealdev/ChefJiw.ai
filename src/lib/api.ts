// จุดเชื่อม backend จุดเดียวของแอป: ทุกการเรียกไปที่ Supabase Edge Functions
// API key ของโมเดลอยู่ที่ edge function เท่านั้น แอปไม่เคยถือ
import { FunctionsFetchError, FunctionsHttpError } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from '@/lib/supabase';

export type ApiErrorKind = 'not_configured' | 'offline' | 'failed' | 'quota' | 'unauthorized';
export class ApiError extends Error {
  constructor(public kind: ApiErrorKind) { super(kind); }
}

/** offset ของเขตเวลาเครื่องเป็นนาที ให้เซิร์ฟเวอร์นับโควตาตามวันของผู้ใช้ */
const tzOffset = () => -new Date().getTimezoneOffset();

async function call<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new ApiError('not_configured');
  const { data, error } = await supabase.functions.invoke(fn, { body });
  if (!error) return data as T;
  if (error instanceof FunctionsFetchError) throw new ApiError('offline');
  if (error instanceof FunctionsHttpError) {
    const status = (error.context as Response).status;
    if (status === 429) throw new ApiError('quota');
    if (status === 401) throw new ApiError('unauthorized');
  }
  throw new ApiError('failed');
}

export type Provider = 'line' | 'google' | 'apple';
export type Plan = 'monthly' | 'yearly';
export type MenuIdea = { name: string; country: string; missing: string[] };
export type PriceRow = { id: string; price: number; change: number };

export const api = {
  askChef: (question: string, ctx: { recipe: string; step: string; lang: string }) => call<{ answer: string }>('ask', { question, ...ctx, tzOffset: tzOffset() }),
  suggestMenus: (have: string[], country: string, lang: string) => call<{ ideas: MenuIdea[] }>('menus', { have, country, lang, tzOffset: tzOffset() }),
  prices: (country: string) => call<{ rows: PriceRow[]; updatedAt: string; source: string }>('prices', { country }),

  /** เข้าสู่ระบบด้วย OAuth ผ่านเบราว์เซอร์ในแอป แล้วคืนสถานะสมาชิกจากตาราง profiles */
  async signIn(provider: Provider): Promise<{ member: boolean }> {
    if (!supabase) throw new ApiError('not_configured');
    // shortcut: LINE ไม่มีใน Supabase Auth ต้องตั้งเป็น custom OIDC provider ก่อน, ทำเมื่อได้ LINE Login channel แล้ว
    if (provider === 'line') throw new ApiError('not_configured');
    const redirectTo = Linking.createURL('auth');
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo, skipBrowserRedirect: true } });
    if (error || !data.url) throw new ApiError('failed');
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') throw new ApiError('failed');
    const code = new URL(result.url).searchParams.get('code');
    if (!code) throw new ApiError('failed');
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw new ApiError('failed');
    return { member: await api.member() };
  },
  async signOut() { await supabase?.auth.signOut(); },
  async member(): Promise<boolean> {
    if (!supabase) return false;
    const { data } = await supabase.from('profiles').select('member').maybeSingle();
    return !!data?.member;
  },

  // shortcut: ยังไม่ได้ต่อระบบซื้อในแอปของ App Store / Google Play, ต่อด้วย RevenueCat หรือ expo-iap แล้วให้เซิร์ฟเวอร์ตั้ง profiles.member
  purchase: async (_plan: Plan): Promise<{ member: boolean }> => { throw new ApiError('not_configured'); },
  restore: async (): Promise<{ member: boolean }> => { throw new ApiError('not_configured'); },
};
