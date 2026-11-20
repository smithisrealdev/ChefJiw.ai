import { router } from 'expo-router';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Card, Screen, T, Thumb } from '@/components/ui';
import { DISH_TINT, IMG } from '@/data/images';
import { MENU } from '@/data/recipes';
import { badges, cookedDays, monthGrid } from '@/lib/calendar';
import { BETA } from '@/lib/beta';
import { COUNTRIES } from '@/lib/money';
import { FREE_PER_DAY } from '@/lib/quota';
import { useSettings } from '@/lib/settings';
import { onPastel, radius, space } from '@/theme/tokens';

function Row({ label, sub, value, onPress }: { label: string; sub?: string; value: string; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value}`} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56, paddingBottom: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }}>
      <View style={{ flex: 1 }}>
        <T v="bodyBold">{label}</T>
        {sub && <T v="small" tone="muted">{sub}</T>}
      </View>
      <T v="subheading">{value}</T>
      <Icon name="next" color={colors.muted} size={20} />
    </Pressable>
  );
}

export default function Me() {
  const { colors, t, pick, lang, country, theme, isDark, runs, set, signedIn, member } = useSettings();
  const avg = runs.length ? (runs.reduce((s, r) => s + r.score, 0) / runs.length).toFixed(1) : '–';
  const now = new Date(), cooked = cookedDays(runs, now.getFullYear(), now.getMonth()), earned = badges(runs);
  return (
    <Screen tint={colors.header.me} title={t('me.title')} lead="list">
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Card style={{ flex: 1 }}><T v="hero">{runs.length}</T><T v="smallBold" tone="muted">{t('me.cooked')}</T></Card>
        <Card style={{ flex: 1 }}><T v="hero">{avg}</T><T v="smallBold" tone="muted">{t('me.avg')}</T></Card>
      </View>

      {/* ปฏิทินของเดือนนี้: วันที่ทำอาหารจบเป็นสติกเกอร์รูปจานนั้น */}
      <T v="subheading" accessibilityRole="header">{t('me.calendar')} · {now.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { month: 'long', year: 'numeric' })}</T>
      <Card style={{ gap: space.sm }}>
        <View style={{ flexDirection: 'row' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {t('me.week').split(' ').map((d, k) => <T key={k} v="smallBold" tone="muted" style={{ flex: 1, textAlign: 'center' }}>{d}</T>)}
        </View>
        {monthGrid(now.getFullYear(), now.getMonth()).map((week, w) => (
          <View key={w} style={{ flexDirection: 'row' }}>
            {week.map((d, k) => {
              const run = d ? cooked.get(d) : undefined, dish = run && MENU.find((m) => m.id === run.recipe);
              return (
                <View key={k} style={{ flex: 1, alignItems: 'center' }} accessible={!!d} accessibilityLabel={!d ? undefined : dish ? t('me.dayCooked', { d, name: pick(dish.name), n: run!.score.toFixed(1) }) : t('me.day', { d })}>
                  {d !== null && (
                    <View style={{ width: 36, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: dish ? DISH_TINT[dish.id] : colors.surface, borderWidth: d === now.getDate() ? 2 : 0, borderColor: colors.ink }}>
                      {dish ? <Thumb source={IMG[dish.img]} size={32} /> : <T v="small" tone="muted">{d}</T>}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </Card>

      <T v="subheading" accessibilityRole="header">{t('me.badges')}</T>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {(['first', 'five', 'perfect'] as const).map((b) => (
          <Card key={b} tone={earned[b] ? 'note' : 'soft'} style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: earned[b] ? '#FFFFFF' : colors.line }}>
              {earned[b] && <Icon name="check" color={onPastel.success} />}
            </View>
            <T v="smallBold" tone={earned[b] ? 'pastel' : 'muted'} style={{ textAlign: 'center' }}>{t(`me.badge.${b}`)}</T>
            <T v="small" tone={earned[b] ? 'pastelMuted' : 'muted'}>{t(earned[b] ? 'me.earned' : 'me.locked')}</T>
          </Card>
        ))}
      </View>

      <T v="subheading" accessibilityRole="header">{t('me.recent')}</T>
      {runs.length === 0 && <Card><T>{t('me.none')}</T></Card>}
      {runs.slice(-3).reverse().map((r) => {
        const m = MENU.find((x) => x.id === r.recipe);
        return m && (
          <Card key={r.at} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <Thumb source={IMG[m.img]} size={48} />
            <T v="bodyBold" style={{ flex: 1 }}>{pick(m.name)}</T>
            <T v="price">{t('me.stars', { n: r.score.toFixed(1) })}</T>
          </Card>
        );
      })}

      <T v="subheading" accessibilityRole="header">{t('me.account')}</T>
      <Row label={t('me.signIn')} value={signedIn ? t('me.signedIn') : t('me.signedOut')} onPress={() => router.push('/login')} />
      {!BETA && <Row label={t('me.membership')} sub={member ? t('me.isMember') : t('me.free', { n: FREE_PER_DAY })} value="" onPress={() => router.push('/paywall')} />}

      <T v="subheading" accessibilityRole="header">{t('me.settings')}</T>
      <Row label={t('me.lang')} value={lang === 'th' ? 'ไทย' : 'English'} onPress={() => set({ lang: lang === 'th' ? 'en' : 'th' })} />
      {!BETA && (
        <Row label={t('me.country')} sub={t('me.countryHint')} value={t(`country.${country}`)}
          onPress={() => set({ country: COUNTRIES[(COUNTRIES.indexOf(country) + 1) % COUNTRIES.length] })} />
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56, paddingBottom: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }}>
        <View style={{ flex: 1 }}>
          <T v="bodyBold">{t('me.dark')}</T>
          {theme === 'system' && <T v="small" tone="muted">{t('me.darkSystem')}</T>}
        </View>
        <Switch accessibilityLabel={t('me.dark')} hitSlop={12} value={isDark} onValueChange={(v) => set({ theme: v ? 'dark' : 'light' })}
          trackColor={{ true: colors.success, false: colors.line }} thumbColor="#FFFFFF" />
      </View>
    </Screen>
  );
}
