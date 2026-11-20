import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Button, Card, Chip, Mascot, Screen, T, Thumb } from '@/components/ui';
import { IMG } from '@/data/images';
import { buildRecipe, DEFAULT_OPTS, MENU, type ImgKey } from '@/data/recipes';
import { lastAns, reminders } from '@/lib/assistant';
import { cancelTimer, putProgress, useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, t, pick, price, set, progress, runs } = useSettings();
  // จานที่ทำค้างไว้ เปิดหน้านี้ด้วยตัวเลือกเดิม และปุ่มหลักพาไปทำต่อ ไม่เริ่มใหม่
  const cooking = progress.find((x) => x.recipe === id);
  const [o1, setO1] = useState(cooking?.o1 ?? DEFAULT_OPTS[id]?.[0] ?? 0);
  const [o2, setO2] = useState(cooking?.o2 ?? DEFAULT_OPTS[id]?.[1] ?? 0);
  const [adapt, setAdapt] = useState<string[]>(cooking?.adapt ?? []);
  const [have, setHave] = useState<string[]>([]);
  const r = buildRecipe(id, o1, o2, adapt);
  const last = r ? reminders(r, lastAns(runs, id)) : [];
  const menu = MENU.find((m) => m.id === id);
  if (!r) return <Screen tint={colors.header.cook} title={t('recipes.empty')} onBack={() => router.replace('/recipes')} backLabel={t('detail.back')}><T>{t('recipes.emptyHint')}</T></Screen>;

  const total = r.ingredients.filter((g) => !have.includes(g.id)).reduce((sum, g) => sum + g.baht, 0);
  const toggle = (list: string[], x: string) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  const start = () => {
    cancelTimer(cooking);
    set((prev) => ({ progress: putProgress(prev.progress, r.id, { recipe: r.id, o1, o2, adapt, step: 0, total: r.steps.length }) }));
    router.push(`/cook/${r.id}`);
  };
  const back = () => (router.canGoBack() ? router.back() : router.replace('/recipes'));

  return (
    <Screen tint={colors.header.cook} title={pick(r.name)} onBack={back} backLabel={t('detail.back')}
      subtitle={`${t('recipes.minutes', { n: r.mins })}${menu?.easy ? ` · ${t('detail.easy')}` : ''}${menu?.onePan ? ` · ${t(menu.onePan === 'pot' ? 'detail.onePot' : 'detail.onePan')}` : ''} · ${t('detail.kcal', { n: r.kcal })}`}
      right={<Thumb source={IMG[r.img]} size={104} />}
      footer={
        <Card tone="accent" style={s.buy}>
          <View style={{ flex: 1 }}>
            <T v="small" tone="pastelMuted">{t('detail.toBuy')}</T>
            <T v="price" tone="pastel">{price(total)}</T>
          </View>
          <View style={{ alignItems: 'center', gap: space.xs }}>
            <Button kind="onPastel" label={cooking ? t('detail.resume', { n: cooking.step + 1 }) : t('detail.start')} size="cook" onPress={cooking ? () => router.push(`/cook/${r.id}`) : start} />
            {cooking && <Pressable accessibilityRole="button" onPress={start} style={{ minHeight: 44, justifyContent: 'center' }}><T v="smallBold" tone="pastel" style={{ textDecorationLine: 'underline' }}>{t('detail.restart')}</T></Pressable>}
          </View>
        </Card>
      }>
      {/* เชฟจำได้ว่าครั้งก่อนตรงไหนยังไม่ดี และจะเตือนอีกทีตอนถึงขั้นนั้น */}
      {last.length > 0 && (
        <Card tone="ai" style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <View style={{ flex: 1 }}>
            <T v="smallBold" tone="pastelMuted">{t('memory.title')} · {t('memory.last')}</T>
            {last.map((m) => <T key={m.sense.th} v="bodyBold" tone="pastel">• {pick(m.sense)}: {pick(m.said)}</T>)}
            <T v="small" tone="pastel">{t('memory.where')}</T>
          </View>
          <Mascot name="think" size={64} still />
        </Card>
      )}
      {[{ g: r.g1, v: o1, setV: setO1 }, { g: r.g2, v: o2, setV: setO2 }].map(({ g, v, setV }) => (
        <View key={pick(g.title)} style={{ gap: space.sm }}>
          <T v="subheading" accessibilityRole="header">{pick(g.title)}</T>
          <View style={s.wrap}>{g.opts.map((o, i) => <Chip key={i} label={pick(o.label)} selected={v === i} onPress={() => setV(i)} />)}</View>
          <T v="small" tone="muted">{pick(g.opts[v].note)}</T>
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
            onPress={() => setHave(toggle(have, g.id))} style={[s.ing, { borderBottomColor: colors.line }]}>
            <View style={[s.box, { borderColor: colors.ink, backgroundColor: on ? colors.success : 'transparent' }]}>
              {on && <Icon name="check" color={colors.bg} size={18} />}
            </View>
            {(g.img ?? g.id) in IMG ? <Thumb source={IMG[(g.img ?? g.id) as ImgKey]} size={48} /> : <View style={[s.noImg, { backgroundColor: colors.line }]} />}
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
  // แถวรายการแบบเรียบ คั่นด้วยเส้นบาง ไม่ใส่กล่องให้ทุกแถว
  ing: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingBottom: space.md, borderBottomWidth: StyleSheet.hairlineWidth },
  box: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  noImg: { width: 48, height: 48, borderRadius: radius.sm },
  buy: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
});
