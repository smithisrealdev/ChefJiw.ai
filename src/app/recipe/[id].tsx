import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Button, Card, Chip, Screen, T, Thumb } from '@/components/ui';
import { IMG } from '@/data/images';
import { buildRecipe, DEFAULT_OPTS } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, t, pick, price, set } = useSettings();
  const [o1, setO1] = useState(DEFAULT_OPTS[id]?.[0] ?? 0);
  const [o2, setO2] = useState(DEFAULT_OPTS[id]?.[1] ?? 0);
  const [adapt, setAdapt] = useState<string[]>([]);
  const [have, setHave] = useState<string[]>([]);
  const r = buildRecipe(id, o1, o2, adapt);
  if (!r) return <Screen tint={colors.header.cook} title={t('recipes.empty')} onBack={() => router.replace('/recipes')} backLabel={t('detail.back')}><T>{t('recipes.emptyHint')}</T></Screen>;

  const total = r.ingredients.filter((g) => !have.includes(g.id)).reduce((sum, g) => sum + g.baht, 0);
  const toggle = (list: string[], x: string) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  const start = () => {
    set({ progress: { recipe: r.id, o1, o2, adapt, step: 0, total: r.steps.length } });
    router.push(`/cook/${r.id}`);
  };
  const back = () => (router.canGoBack() ? router.back() : router.replace('/recipes'));

  return (
    <Screen tint={colors.header.cook} title={pick(r.name)} onBack={back} backLabel={t('detail.back')}
      subtitle={`${t('recipes.minutes', { n: r.mins })} · ${t('detail.easy')} · ${t('detail.kcal', { n: r.kcal })}`}
      right={<Thumb source={IMG[r.img]} size={96} />}
      footer={
        <Card tone="accent" style={s.buy}>
          <View style={{ flex: 1 }}>
            <T v="small" tone="pastelMuted">{t('detail.toBuy')}</T>
            <T v="heading" tone="pastel">{price(total)}</T>
          </View>
          <Button kind="onPastel" label={t('detail.start')} size="cook" onPress={start} />
        </Card>
      }>
      {[{ g: r.g1, v: o1, setV: setO1 }, { g: r.g2, v: o2, setV: setO2 }].map(({ g, v, setV }) => (
        <View key={pick(g.title)} style={{ gap: space.sm }}>
          <T v="subheading" accessibilityRole="header">{pick(g.title)}</T>
          <View style={s.wrap}>{g.opts.map((o, i) => <Chip key={i} label={pick(o.label)} selected={v === i} onPress={() => setV(i)} />)}</View>
          <Card tone="note"><T tone="pastel">{pick(g.opts[v].note)}</T></Card>
        </View>
      ))}

      <T v="subheading" accessibilityRole="header">{t('detail.adapt')}</T>
      <View style={s.wrap}>{r.adapts.map((a) => <Chip key={a.id} label={pick(a.label)} selected={adapt.includes(a.id)} onPress={() => setAdapt(toggle(adapt, a.id))} />)}</View>
      {r.adaptNotes.map((n) => <Card key={n.th} tone="ai"><T tone="pastel">{pick(n)}</T></Card>)}

      <T v="subheading" accessibilityRole="header">{t('detail.ingredients')}</T>
      <T v="small" tone="muted">{t('detail.haveHint')}</T>
      {r.ingredients.map((g) => {
        const on = have.includes(g.id);
        return (
          <Pressable key={g.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`${pick(g.name)} ${g.q} ${pick(g.unit)}`}
            onPress={() => setHave(toggle(have, g.id))} style={[s.ing, { backgroundColor: colors.surfaceSoft }]}>
            <View style={[s.box, { borderColor: colors.ink, backgroundColor: on ? colors.success : 'transparent' }]}>
              {on && <Icon name="check" color={colors.bg} size={18} />}
            </View>
            <Thumb source={IMG[g.id]} size={48} />
            <View style={{ flex: 1 }}>
              <T v="bodyBold">{pick(g.name)}</T>
              <T v="smallBold" tone="muted">{g.q === 0.5 ? '½' : g.q} {pick(g.unit)}</T>
              <T v="small" tone="muted">{pick(g.why)}</T>
            </View>
            <T v="bodyBold" tone={on ? 'success' : 'ink'}>{on ? t('detail.have') : price(g.baht)}</T>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  ing: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg },
  box: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  buy: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
});
