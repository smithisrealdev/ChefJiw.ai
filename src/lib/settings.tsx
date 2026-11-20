import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { BETA } from '@/lib/beta';
import { translate, type Key, type L, type Lang } from '@/lib/i18n';
import { money, type Country } from '@/lib/money';
import type { Asked } from '@/lib/quota';
import { dark, light, type Palette } from '@/theme/tokens';

export type Progress = {
  recipe: string; o1: number; o2: number; adapt: string[]; step: number; total: number;
  timer?: { step: string; endAt: number; note: string | null }; // เก็บไว้กับจาน จึงเดินต่อแม้ออกไปทำจานอื่น
};
export type Run = { recipe: string; score: number; at: number; ans?: number[] }; // ans = คำตอบตอนชิม เชฟใช้เตือนครั้งหน้า
type Saved = {
  lang: Lang; country: Country; theme: 'system' | 'light' | 'dark'; runs: Run[];
  progress: Progress[]; // จานที่ทำค้างไว้ ล่าสุดก่อน ทำหลายจานสลับกันได้ เช่น แผนวันอาทิตย์
  onboarded: boolean; signedIn: boolean; member: boolean; asked: Asked;
  device: string; // รหัสสุ่มของเครื่อง ใช้แยกผลการทำอาหารแต่ละเครื่องในบันทึกบนเซิร์ฟเวอร์ สร้างตอนทำจบจานครั้งแรก
};
/** รหัสสุ่มของเครื่อง ตัวเล็กกับตัวเลข (เซิร์ฟเวอร์รับ 8-64 ตัว) */
export const newDevice = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const DEFAULTS: Saved = { lang: 'th', country: 'TH', theme: 'system', progress: [], runs: [], onboarded: false, signedIn: false, member: false, asked: { day: '', n: 0 }, device: '' };
const KEY = 'chefjiw.settings.v1';

type Ctx = Saved & {
  ready: boolean;
  set: (patch: Partial<Saved> | ((prev: Saved) => Partial<Saved>)) => void;
  colors: Palette;
  isDark: boolean;
  t: (key: Key, vars?: Record<string, string | number>) => string;
  pick: (text: L) => string;
  price: (baht: number) => string;
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const scheme = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const v = { ...DEFAULTS, ...JSON.parse(raw) };
        if (!Array.isArray(v.progress)) v.progress = v.progress ? [v.progress] : []; // แอปรุ่นก่อนเก็บได้จานเดียว
        setSaved(v);
      })
      .catch(() => {}) // อ่านไม่ได้ก็ใช้ค่าเริ่มต้น แอปยังใช้ได้ครบ
      .finally(() => setReady(true));
  }, []);

  const set = (patch: Partial<Saved> | ((prev: Saved) => Partial<Saved>)) =>
    setSaved((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });

  const isDark = saved.theme === 'dark' || (saved.theme === 'system' && scheme === 'dark');
  // เบต้าเปิดแค่ไทย ประเทศที่เคยเลือกยังเก็บไว้ ปิดเบต้าแล้วกลับมาเหมือนเดิม
  const country: Country = BETA ? 'TH' : saved.country;
  const value: Ctx = {
    ...saved, country, ready, set, isDark,
    colors: isDark ? dark : light,
    t: (key, vars) => translate(saved.lang, key, vars),
    pick: (text) => text[saved.lang],
    price: (baht) => money(baht, country),
  };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

/** วางความคืบหน้าของจานนี้ไว้หน้าสุด ส่ง null เพื่อเอาจานนี้ออก */
export const putProgress = (list: Progress[], recipe: string, next: Progress | null): Progress[] =>
  [...(next ? [next] : []), ...list.filter((x) => x.recipe !== recipe)];

/** ยกเลิกการแจ้งเตือนของตัวจับเวลาที่เลิกใช้ (เปลี่ยนขั้น ทำจบจาน หรือเริ่มจานนั้นใหม่) */
export const cancelTimer = (p?: Progress) => {
  if (p?.timer?.note) Notifications.cancelScheduledNotificationAsync(p.timer.note).catch(() => {});
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
