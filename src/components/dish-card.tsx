import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Pill, T } from '@/components/ui';
import { IMG } from '@/data/images';
import type { MenuItem } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

/** การ์ดจานแบบตาราง 2 คอลัมน์: รูปจานบนพื้นเทาอ่อน ราคาเป็นป้ายมุมบน (สีของจออยู่ที่หัวจอ การ์ดไม่แข่งสี) */
export function DishCard({ m, sub, subTone = 'muted' }: { m: MenuItem; sub?: string; subTone?: 'muted' | 'success' | 'warn' }) {
  const { colors, t, pick, price } = useSettings();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${pick(m.name)}, ${t('recipes.minutes', { n: m.mins })}, ${price(m.baht)}`} onPress={() => router.push(`/recipe/${m.id}`)}
      style={({ pressed }) => ({ width: '48.3%', borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surfaceSoft, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <View style={{ height: 112, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Image source={IMG[m.img]} style={{ width: 96, height: 96 }} contentFit="contain" accessible={false} />
        <View style={{ position: 'absolute', top: space.sm, right: space.sm }}><Pill label={price(m.baht)} /></View>
      </View>
      <View style={{ padding: space.md, gap: 2 }}>
        <T v="subheading" numberOfLines={2}>{pick(m.name)}</T>
        <T v="small" tone="muted">{t('recipes.minutes', { n: m.mins })}{m.easy ? ` · ${t('detail.easy')}` : ''}{m.onePan ? ` · ${t(m.onePan === 'pot' ? 'detail.onePot' : 'detail.onePan')}` : ''}</T>
        {sub && <T v="smallBold" tone={subTone}>{sub}</T>}
      </View>
    </Pressable>
  );
}
