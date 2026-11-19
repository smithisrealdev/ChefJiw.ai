import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ApiNotice, Button, Card, Chip, Screen, Skeleton, T, Thumb } from '@/components/ui';
import { IMG, MASCOT } from '@/data/images';
import { local, MARKET, type Cat } from '@/data/market';
import { api, ApiError, type ApiErrorKind, type PriceRow } from '@/lib/api';
import { COUNTRIES } from '@/lib/money';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

type Live = { rows: PriceRow[]; updatedAt: string; source: string };

export default function Market() {
  const { colors, t, pick, lang, country, set } = useSettings();
  const [cat, setCat] = useState<'all' | Cat>('all');
  const [cart, setCart] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<ApiErrorKind | null>(null);
  const [live, setLive] = useState<Live | null>(null);

  const data = MARKET[country];
  // ราคาจาก AI แทนตัวเลขตัวอย่างเมื่อได้มา ชื่อและรูปยังใช้จากข้อมูลในแอป
  const items = data.items.map((it) => {
    const row = live?.rows.find((r) => r.id === it.id);
    return row ? { ...it, price: row.price, change: row.change } : it;
  });
  const shown = items.filter((it) => cat === 'all' || it.cat === cat);
  const total = items.filter((it) => cart.includes(it.id)).reduce((sum, it) => sum + it.price, 0);

  const check = async () => {
    setChecking(true); setError(null);
    try { setLive(await api.prices(country, lang)); } catch (e) { setError(e instanceof ApiError ? e.kind : 'failed'); } finally { setChecking(false); }
  };
  const changeCountry = (c: typeof country) => { set({ country: c }); setCart([]); setLive(null); setError(null); };
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen tint={colors.header.market} title={t('market.title')} subtitle={t('market.sample')} mascot={MASCOT.capybara} onBack={back} backLabel={t('tab.home')}
      footer={
        <Card tone="accent" style={s.foot}>
          <View style={{ flex: 1 }}>
            <T v="small" tone="pastelMuted" accessibilityLiveRegion="polite">{cart.length ? t('market.cart', { n: cart.length }) : t('market.none')}</T>
            <T v="heading" tone="pastel">{local(total, country)}</T>
          </View>
          <Button kind="onPastel" size="cook" label={t('market.find')} onPress={() => router.push('/recipes')} />
        </Card>
      }>
      <Card tone="note"><T v="bodyBold" tone="pastel">{pick(data.tip)}</T></Card>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
        {COUNTRIES.map((c) => <Chip key={c} label={t(`country.${c}`)} selected={country === c} onPress={() => changeCountry(c)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
        {(['all', 'meat', 'veg', 'dry'] as const).map((c) => <Chip key={c} label={t(`market.${c}`)} selected={cat === c} onPress={() => setCat(c)} />)}
      </ScrollView>
      <Button kind="secondary" icon="search" disabled={checking} label={checking ? t('market.checking') : t('market.check')} onPress={check} />
      <T v="small" tone="muted">{live ? t('market.live', { time: live.updatedAt, source: live.source }) : t('market.stamp', { country: t(`country.${country}`) })}</T>
      {error && <ApiNotice kind={error} onRetry={check} />}
      {checking ? <><Skeleton label={t('market.checking')} /><Skeleton label={t('market.checking')} /></> : shown.map((it) => {
        const on = cart.includes(it.id);
        const ch = it.change > 0 ? t('market.up', { p: local(it.change, country) }) : it.change < 0 ? t('market.down', { p: local(-it.change, country) }) : t('market.same');
        return (
          <Pressable key={it.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
            accessibilityLabel={`${on ? t('market.remove', { name: pick(it.name) }) : t('market.add', { name: pick(it.name) })}, ${local(it.price, country)} ${pick(it.unit)}, ${ch}`}
            onPress={() => setCart(on ? cart.filter((x) => x !== it.id) : [...cart, it.id])}
            style={({ pressed }) => [s.row, { backgroundColor: colors.surfaceSoft, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
            <View>
              {it.img ? <Thumb source={IMG[it.img]} tint="#FFFFFF" size={56} />
                : <View style={[s.noImg, { backgroundColor: colors.line }]}><T v="small" tone="muted" style={{ textAlign: 'center' }}>{t('market.photo')}</T></View>}
              <View style={[s.tick, { backgroundColor: on ? colors.success : colors.accent }]}><Icon name={on ? 'check' : 'plus'} color={on ? colors.bg : '#24212B'} size={16} /></View>
            </View>
            <View style={{ flex: 1 }}>
              <T v="bodyBold">{pick(it.name)}</T>
              <T v="small" tone="muted">{pick(it.unit)}</T>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <T v="subheading">{local(it.price, country)}</T>
              {/* ขึ้นลงบอกทั้งลูกศรและคำ ไม่ใช้สีอย่างเดียว */}
              <T v="smallBold" tone={it.change > 0 ? 'warn' : it.change < 0 ? 'success' : 'muted'}>{it.change > 0 ? '↑ ' : it.change < 0 ? '↓ ' : '– '}{ch}</T>
            </View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, paddingRight: space.lg, borderRadius: radius.lg, minHeight: 72 },
  noImg: { width: 56, height: 56, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', padding: 4 },
  tick: { position: 'absolute', right: -6, bottom: -6, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  foot: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
});
