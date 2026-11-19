import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Pill, T } from '@/components/ui';
import { DISH_TINT, IMG } from '@/data/images';
import type { MenuItem } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

/** การ์ดจานแบบตาราง 2 คอลัมน์: รูปจานบนพื้นสีสด ราคาเป็นป้ายมุมบน */
export function DishCard({ m, sub, subTone = 'muted' }: { m: MenuItem; sub?: string; subTone?: 'muted' | 'success' | 'warn' }) {
  const { colors, t, pick, price } = useSettings();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${pick(m.name)}, ${t('recipes.minutes', { n: m.mins })}, ${price(m.baht)}`} onPress={() => router.push(`/recipe/${m.id}`)}
      style={({ pressed }) => ({ width: '48.3%', borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surfaceSoft, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <View style={{ height: 120, backgroundColor: DISH_TINT[m.id], alignItems: 'center', justifyContent: 'center' }}>
        <Image source={IMG[m.img]} style={{ width: 96, height: 96 }} contentFit="contain" accessible={false} />
        <View style={{ position: 'absolute', top: space.sm, right: space.sm }}><Pill label={price(m.baht)} /></View>
      </View>
      <View style={{ padding: space.md, gap: 2 }}>
        <T v="subheading" numberOfLines={2}>{pick(m.name)}</T>
        <T v="small" tone="muted">{t('recipes.minutes', { n: m.mins })}{m.easy ? ` · ${t('detail.easy')}` : ''}</T>
        {sub && <T v="smallBold" tone={subTone}>{sub}</T>}
      </View>
    </Pressable>
  );
}
