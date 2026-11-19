import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { translate, type Key, type L, type Lang } from '@/lib/i18n';
import { money, type Country } from '@/lib/money';
import type { Asked } from '@/lib/quota';
import { dark, light, type Palette } from '@/theme/tokens';

export type Progress = { recipe: string; o1: number; o2: number; adapt: string[]; step: number; total: number };
export type Run = { recipe: string; score: number; at: number };
type Saved = {
  lang: Lang; country: Country; theme: 'system' | 'light' | 'dark'; progress: Progress | null; runs: Run[];
  onboarded: boolean; signedIn: boolean; member: boolean; asked: Asked;
};
const DEFAULTS: Saved = { lang: 'th', country: 'TH', theme: 'system', progress: null, runs: [], onboarded: false, signedIn: false, member: false, asked: { day: '', n: 0 } };
const KEY = 'chefjiw.settings.v1';

type Ctx = Saved & {
  ready: boolean;
  set: (patch: Partial<Saved>) => void;
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
      .then((raw) => { if (raw) setSaved({ ...DEFAULTS, ...JSON.parse(raw) }); })
      .catch(() => {}) // อ่านไม่ได้ก็ใช้ค่าเริ่มต้น แอปยังใช้ได้ครบ
      .finally(() => setReady(true));
  }, []);

  const set = (patch: Partial<Saved>) =>
    setSaved((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });

  const isDark = saved.theme === 'dark' || (saved.theme === 'system' && scheme === 'dark');
  const value: Ctx = {
    ...saved, ready, set, isDark,
    colors: isDark ? dark : light,
    t: (key, vars) => translate(saved.lang, key, vars),
    pick: (text) => text[saved.lang],
    price: (baht) => money(baht, saved.country),
  };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
