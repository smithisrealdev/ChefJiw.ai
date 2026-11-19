import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ApiNotice, Button, Card, Chip, Screen, Skeleton, T, Thumb } from '@/components/ui';
import { IMG, MASCOT } from '@/data/images';
import { fridgeFit, MENU, PANTRY, type MenuItem } from '@/data/recipes';
import { api, ApiError, type ApiErrorKind, type MenuIdea } from '@/lib/api';
import { useSettings } from '@/lib/settings';
import { fonts, radius, space, type } from '@/theme/tokens';

type Filter = 'all' | 'fast' | 'cheap' | 'light';
const TESTS: Record<Filter, (m: MenuItem) => boolean> = { all: () => true, fast: (m) => m.mins <= 15, cheap: (m) => m.baht <= 40, light: (m) => m.kcal < 400 };
const TINT: Record<string, string> = { kaprao: '#FFD9CC', omelet: '#FFF0B8', 'fried-rice': '#FFE2C2', 'morning-glory': '#D6F5D9', 'tom-yum': '#FFD6DF', 'green-curry': '#DCDCFF' };

export default function Recipes() {
  const { colors, t, pick, price, runs, lang, country } = useSettings();
  const [ai, setAi] = useState<{ kind: 'idle' | 'loading' | 'done' | 'error'; ideas?: MenuIdea[]; error?: ApiErrorKind }>({ kind: 'idle' });
  const askAi = async () => {
    setAi({ kind: 'loading' });
    try { setAi({ kind: 'done', ideas: (await api.suggestMenus(have, country, lang)).ideas }); }
    catch (e) { setAi({ kind: 'error', error: e instanceof ApiError ? e.kind : 'failed' }); }
  };
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [have, setHave] = useState<string[]>([]);

  const fridge = fridgeOpen && have.length > 0;
  let list = MENU.filter((m) => TESTS[filter](m) && (!q.trim() || pick(m.name).toLowerCase().includes(q.trim().toLowerCase())));
  if (fridge) list = [...list].sort((a, b) => fridgeFit(a, have).rank - fridgeFit(b, have).rank);
  const ready = list.filter((m) => m.ready), soon = list.filter((m) => !m.ready);
  const nameOf = (id: string) => pick(PANTRY.find((p) => p.id === id)!.name);

  const meta2 = (m: MenuItem) => {
    if (fridge) {
      const f = fridgeFit(m, have);
      return f.hard.length ? { text: t('recipes.missing', { items: f.hard.map(nameOf).join(' ') }), tone: 'warn' as const } : { text: t('recipes.haveAll'), tone: 'success' as const };
    }
    const mine = runs.filter((r) => r.recipe === m.id);
    if (mine.length) return { text: t('recipes.made', { n: mine.length, best: Math.max(...mine.map((r) => r.score)).toFixed(1) }), tone: 'muted' as const };
    return { text: t('recipes.kcal', { n: m.kcal }), tone: 'muted' as const };
  };

  const filters: [Filter, string][] = [['all', t('recipes.all')], ['fast', t('recipes.fast')], ['cheap', t('recipes.cheap', { price: price(40) })], ['light', t('recipes.light')]];

  return (
    <Screen tint={colors.header.recipes} title={t('recipes.title')} subtitle={t('recipes.sample')} mascot={MASCOT.elephant}>
      <View style={[s.search, { backgroundColor: colors.surfaceSoft }]}>
        <Icon name="search" color={colors.muted} />
        <TextInput value={q} onChangeText={setQ} placeholder={t('recipes.search')} placeholderTextColor={colors.muted} accessibilityLabel={t('recipes.search')}
          style={{ flex: 1, minHeight: 48, fontFamily: fonts.body, fontSize: type.md, color: colors.ink }} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
        {filters.map(([id, label]) => <Chip key={id} label={label} selected={filter === id} onPress={() => setFilter(id)} />)}
      </ScrollView>
      <T v="small" tone="muted">{fridge ? t('recipes.sorted', { n: have.length }) : t('recipes.count', { ready: ready.length, soon: soon.length })}</T>

      <Card tone="ai">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <View style={{ flex: 1 }}>
            <T v="subheading" tone="pastel">{t('recipes.fridge')}</T>
            <T v="small" tone="pastelMuted">{t('recipes.fridgeHint')}</T>
          </View>
          <Button kind="onPastel" label={fridgeOpen ? t('recipes.close') : t('recipes.pick')} onPress={() => setFridgeOpen(!fridgeOpen)} />
        </View>
        {fridgeOpen && (
          <View style={s.wrap} accessibilityRole="list">
            {PANTRY.map((p) => {
              const on = have.includes(p.id);
              return (
                <Pressable key={p.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => { setHave(on ? have.filter((x) => x !== p.id) : [...have, p.id]); setAi({ kind: 'idle' }); }}
                  style={[s.pantry, { backgroundColor: on ? '#24212B' : '#FFFFFF' }]}>
                  <T v="bodyBold" style={{ color: on ? '#FFFFFF' : '#24212B' }}>{pick(p.name)}</T>
                </Pressable>
              );
            })}
          </View>
        )}
        {fridgeOpen && <Button kind="onPastel" icon="chat" disabled={have.length === 0 || ai.kind === 'loading'} label={ai.kind === 'done' ? t('ai.again') : t('ai.ideas')} onPress={askAi} style={{ marginTop: space.sm }} />}
        {ai.kind === 'loading' && <Skeleton label={t('ai.thinking')} lines={3} />}
        {ai.kind === 'error' && ai.error && <ApiNotice kind={ai.error} onRetry={askAi} />}
        {ai.kind === 'done' && ai.ideas && (
          <View style={{ gap: space.sm, marginTop: space.sm }}>
            <T v="subheading" tone="pastel">{t('ai.result')}</T>
            {ai.ideas.map((d) => (
              <Card key={d.name} tone="surface">
                <T v="bodyBold">{d.name} · {d.country}</T>
                <T v="small" tone={d.missing.length ? 'warn' : 'success'}>{d.missing.length ? t('recipes.missing', { items: d.missing.join(' ') }) : t('recipes.haveAll')}</T>
              </Card>
            ))}
            <T v="small" tone="pastelMuted">{t('ai.untested')}</T>
          </View>
        )}
      </Card>

      {ready.map((m) => {
        const m2 = meta2(m);
        return (
          <Card key={m.id} onPress={() => router.push(`/recipe/${m.id}`)} label={pick(m.name)} style={s.row}>
            <Thumb source={IMG[m.img]} tint={TINT[m.id]} size={72} />
            <View style={{ flex: 1 }}>
              <T v="subheading">{pick(m.name)}</T>
              <T v="small" tone="muted">{t('recipes.minutes', { n: m.mins })} · {m.easy ? t('detail.easy') : '—'}</T>
              <T v="smallBold" tone={m2.tone}>{m2.text}</T>
            </View>
            <T v="subheading">{price(m.baht)}</T>
            <Icon name="next" color={colors.muted} size={20} />
          </Card>
        );
      })}

      {soon.length > 0 && <T v="subheading" tone="muted" style={{ marginTop: space.sm }}>{t('recipes.soon')}</T>}
      {soon.map((m) => (
        <Card key={m.id} tone="surface" style={[s.row, { borderWidth: 1, borderColor: colors.line }]}>
          <Thumb source={IMG[m.img]} tint={TINT[m.id]} size={52} />
          <View style={{ flex: 1 }}>
            <T v="bodyBold">{pick(m.name)}</T>
            <T v="small" tone={fridge ? meta2(m).tone : 'muted'}>{fridge ? meta2(m).text : t('recipes.minutes', { n: m.mins })}</T>
          </View>
          <T v="bodyBold">{price(m.baht)}</T>
        </Card>
      ))}

      {list.length === 0 && (
        <View style={{ alignItems: 'center', gap: space.sm, padding: space.xl }}>
          <T v="subheading">{t('recipes.empty')}</T>
          <T tone="muted">{t('recipes.emptyHint')}</T>
          <Button label={t('recipes.clear')} onPress={() => { setQ(''); setFilter('all'); }} />
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, borderRadius: radius.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.sm },
  pantry: { minHeight: 44, paddingHorizontal: space.md, borderRadius: radius.pill, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, paddingRight: space.md },
});
