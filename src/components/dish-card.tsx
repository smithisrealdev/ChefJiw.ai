import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { T } from '@/components/ui';
import { IMG } from '@/data/images';
import type { MenuItem } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

/** จานในตาราง 2 คอลัมน์: รูปบนพื้นเทาอ่อน ชื่อ ราคา และเวลาวางบนพื้นจอโดยตรง ไม่มีกล่องครอบ */
export function DishCard({ m, sub, subTone = 'muted' }: { m: MenuItem; sub?: string; subTone?: 'muted' | 'success' | 'warn' }) {
  const { colors, t, pick, price } = useSettings();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${pick(m.name)}, ${t('recipes.minutes', { n: m.mins })}, ${price(m.baht)}`} onPress={() => router.push(`/recipe/${m.id}`)}
      style={({ pressed }) => ({ width: '48.3%', gap: space.sm, marginBottom: space.sm, opacity: pressed ? 0.7 : 1 })}>
      <View style={{ height: 120, borderRadius: radius.lg, backgroundColor: colors.surfaceSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={IMG[m.img]} style={{ width: 100, height: 100 }} contentFit="contain" accessible={false} />
      </View>
      <View style={{ gap: 2 }}>
        <T v="bodyBold" numberOfLines={2}>{pick(m.name)}</T>
        <T v="small" tone="muted"><T v="smallBold">{price(m.baht)}</T> · {t('recipes.minutes', { n: m.mins })}{m.easy ? ` · ${t('detail.easy')}` : ''}{m.onePan ? ` · ${t(m.onePan === 'pot' ? 'detail.onePot' : 'detail.onePan')}` : ''}</T>
        {sub && <T v="smallBold" tone={subTone}>{sub}</T>}
      </View>
    </Pressable>
  );
}
