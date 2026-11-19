import { router } from 'expo-router';
import { Pressable, Switch, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Card, Screen, T, Thumb } from '@/components/ui';
import { IMG, MASCOT } from '@/data/images';
import { MENU } from '@/data/recipes';
import { BETA } from '@/lib/beta';
import { COUNTRIES } from '@/lib/money';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

function Row({ label, sub, value, onPress }: { label: string; sub?: string; value: string; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value}`} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 60, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surfaceSoft }}>
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
  return (
    <Screen tint={colors.header.me} title={t('me.title')} mascot={MASCOT.elephant}>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Card style={{ flex: 1 }}><T v="title">{runs.length}</T><T v="small" tone="muted">{t('me.cooked')}</T></Card>
        <Card style={{ flex: 1 }}><T v="title">{avg}</T><T v="small" tone="muted">{t('me.avg')}</T></Card>
      </View>

      <T v="subheading" accessibilityRole="header">{t('me.recent')}</T>
      {runs.length === 0 && <Card><T>{t('me.none')}</T></Card>}
      {runs.slice(-3).reverse().map((r) => {
        const m = MENU.find((x) => x.id === r.recipe);
        return m && (
          <Card key={r.at} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <Thumb source={IMG[m.img]} size={48} />
            <T v="bodyBold" style={{ flex: 1 }}>{pick(m.name)}</T>
            <T v="subheading">{t('me.stars', { n: r.score.toFixed(1) })}</T>
          </Card>
        );
      })}

      <T v="subheading" accessibilityRole="header">{t('me.account')}</T>
      <Row label={t('me.signIn')} value={signedIn ? t('me.signedIn') : t('me.signedOut')} onPress={() => router.push('/login')} />
      <Row label={t('me.membership')} sub={member ? t('me.isMember') : t('me.free')} value="" onPress={() => router.push('/paywall')} />

      <T v="subheading" accessibilityRole="header">{t('me.settings')}</T>
      <Row label={t('me.lang')} value={lang === 'th' ? 'ไทย' : 'English'} onPress={() => set({ lang: lang === 'th' ? 'en' : 'th' })} />
      {!BETA && (
        <Row label={t('me.country')} sub={t('me.countryHint')} value={t(`country.${country}`)}
          onPress={() => set({ country: COUNTRIES[(COUNTRIES.indexOf(country) + 1) % COUNTRIES.length] })} />
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 60, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surfaceSoft }}>
        <View style={{ flex: 1 }}>
          <T v="bodyBold">{t('me.dark')}</T>
          {theme === 'system' && <T v="small" tone="muted">{t('me.darkSystem')}</T>}
        </View>
        <Switch accessibilityLabel={t('me.dark')} value={isDark} onValueChange={(v) => set({ theme: v ? 'dark' : 'light' })}
          trackColor={{ true: colors.success, false: colors.line }} thumbColor="#FFFFFF" />
      </View>
    </Screen>
  );
}
