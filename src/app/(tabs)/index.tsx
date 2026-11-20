import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ResumeCard } from '@/components/resume-card';
import { Button, Mascot, T } from '@/components/ui';
import { IMG } from '@/data/images';
import { buildRecipe, MENU, planShopping } from '@/data/recipes';
import { lastAns, reminders } from '@/lib/assistant';
import { BETA } from '@/lib/beta';
import { useSettings } from '@/lib/settings';
import { onTint, radius, space, touch, wide } from '@/theme/tokens';

const PER_MEAL = planShopping().perMeal;

export default function Home() {
  const { colors, isDark, t, pick, price, runs } = useSettings();
  const insets = useSafeAreaInsets();
  const [line, setLine] = useState(0);
  // เชฟแนะนำจากสิ่งที่เคยทำ: จานที่ครั้งก่อนยังมีข้อให้แก้ก่อน ไม่งั้นจานที่ยังไม่เคยทำ บทพูดอ้างคะแนนและคำตอบครั้งก่อน
  const ready = MENU.filter((m) => m.ready), lastRun = runs.at(-1), lastDish = lastRun && MENU.find((m) => m.id === lastRun.recipe);
  const lastRecipe = lastRun ? buildRecipe(lastRun.recipe) : null;
  const fix = lastRecipe ? reminders(lastRecipe, lastAns(runs, lastRecipe.id))[0] : undefined;
  const pickToday = (fix && lastDish) || ready.find((m) => !runs.some((x) => x.recipe === m.id)) || ready[0];
  const next = pick(pickToday.name);
  const LINES = [
    fix && lastDish ? t('home.fix', { dish: pick(lastDish.name), x: pick(fix.said) })
      : lastRun && lastDish ? t('home.again', { dish: pick(lastDish.name), score: lastRun.score.toFixed(1), next })
      : t('home.first', { next }),
    t('home.time', { n: pickToday.mins }), t('home.check'),
  ];
  const avg = runs.length ? (runs.reduce((a, r) => a + r.score, 0) / runs.length).toFixed(1) : '–';
  // ทั้งจอเป็นสีเดียว ข้อความวางบนสีโดยตรง แผงโปร่งเข้มกว่าพื้นหนึ่งขั้นเพื่อให้ตัวอักษรขาวยังผ่าน 4.5:1
  const tint = colors.header.home, fg = isDark ? colors.ink : onTint(tint), soft = isDark ? colors.muted : fg;
  const panel = isDark ? colors.surfaceSoft : 'rgba(23,21,29,0.2)', rule = isDark ? colors.line : 'rgba(255,255,255,0.3)';
  const row = { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: touch.cook, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: panel } as const;
  const stats: [string, string][] = [[price(PER_MEAL), t('plan.perMeal')], [String(runs.length), t('home.cooked')], [avg, t('me.avg')]];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: tint }} contentContainerStyle={[wide, { padding: space.lg, paddingTop: insets.top + space.md, paddingBottom: space.xxl, gap: space.md }]}>
      <T v="title" style={{ color: fg }} accessibilityRole="header">{t('home.title')}</T>
      {/* ตัวเอกของจอ: เชฟกับจานแนะนำวันนี้ */}
      <View style={{ height: 196, alignItems: 'center', justifyContent: 'flex-end' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={{ position: 'absolute', bottom: 0, width: 196, height: 196, borderRadius: radius.pill, backgroundColor: isDark ? colors.surface : 'rgba(255,255,255,0.16)' }} />
        <Mascot name="cook" size={184} />
        <Image source={IMG[pickToday.img]} style={{ position: 'absolute', bottom: -4, left: '50%', marginLeft: 44, width: 96, height: 96 }} contentFit="contain" accessible={false} />
      </View>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <T v="smallBold" style={{ color: soft }}>{t('home.today')}</T>
        <T v="title" style={{ color: fg, textAlign: 'center' }} accessibilityRole="header">{next}</T>
        <T v="small" style={{ color: soft }}>{t('recipes.minutes', { n: pickToday.mins })} · {price(pickToday.baht)}{pickToday.onePan ? ` · ${t(pickToday.onePan === 'pot' ? 'detail.onePot' : 'detail.onePan')}` : ''}</T>
      </View>
      {/* บทพูดของเชฟ แตะเพื่อฟังเรื่องถัดไป */}
      <Pressable accessibilityRole="button" accessibilityLabel={`${LINES[line % LINES.length]} ${t('home.next')}`} onPress={() => setLine(line + 1)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: panel, opacity: pressed ? 0.8 : 1 })}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="smallBold" style={{ color: soft }}>{t('home.chef')}</T>
          <T v="bodyBold" style={{ color: fg }}>{LINES[line % LINES.length]}</T>
        </View>
        <Icon name="next" color={fg} size={20} />
      </Pressable>
      <Button kind={isDark ? 'primary' : 'onPastelLight'} size="cook" label={t('detail.start')} onPress={() => router.push(`/recipe/${pickToday.id}`)} />
      <ResumeCard on={{ bg: panel, fg }} />
      <View style={{ flexDirection: 'row', paddingVertical: space.md }}>
        {stats.map(([n, label], k) => (
          <View key={label} style={{ flex: 1, alignItems: 'center', borderLeftWidth: k ? 1 : 0, borderLeftColor: rule }} accessible accessibilityLabel={`${label} ${n}`}>
            <T v="title" style={{ color: fg, fontVariant: ['tabular-nums'] }}>{n}</T>
            <T v="small" style={{ color: soft }}>{label}</T>
          </View>
        ))}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={t('plan.title')} onPress={() => router.push('/plan')} style={({ pressed }) => [row, { opacity: pressed ? 0.8 : 1 }]}>
        <T v="bodyBold" style={{ flex: 1, color: fg }}>{t('plan.title')}</T>
        <Icon name="next" color={fg} size={20} />
      </Pressable>
      {!BETA && (
        <Pressable accessibilityRole="button" accessibilityLabel={t('market.open')} onPress={() => router.push('/market')} style={({ pressed }) => [row, { opacity: pressed ? 0.8 : 1 }]}>
          <T v="bodyBold" style={{ flex: 1, color: fg }}>{t('market.open')}</T>
          <Icon name="next" color={fg} size={20} />
        </Pressable>
      )}
    </ScrollView>
  );
}
