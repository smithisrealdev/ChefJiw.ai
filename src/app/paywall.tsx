import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ApiNotice, Button, Card, Screen, T } from '@/components/ui';
import { api, ApiError, type ApiErrorKind, type Plan } from '@/lib/api';
import { FREE_PER_DAY } from '@/lib/quota';
import { useSettings } from '@/lib/settings';
import { onPastel, radius, space } from '@/theme/tokens';

const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

export default function Paywall() {
  const { colors, t, member, set } = useSettings();
  const [plan, setPlan] = useState<Plan>('yearly');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiErrorKind | null>(null);

  const run = async (restore: boolean) => {
    setBusy(true); setError(null);
    try {
      const res = restore ? await api.restore() : await api.purchase(plan);
      set({ member: res.member });
    } catch (e) {
      setError(e instanceof ApiError ? e.kind : 'failed');
    } finally {
      setBusy(false);
    }
  };

  const rows: [string, string, string][] = [
    [t('pay.rowAsk'), t('pay.rowAskFree', { n: FREE_PER_DAY }), t('pay.unlimited')],
    [t('pay.rowCook'), t('pay.all'), t('pay.all')],
    [t('pay.rowPrepared'), t('pay.all'), t('pay.all')],
  ];
  const plans: [Plan, string, string][] = [['monthly', t('pay.monthly'), t('pay.priceMonthly')], ['yearly', t('pay.yearly'), t('pay.priceYearly')]];

  return (
    <Screen tint={colors.header.cook} title={t('pay.title')} subtitle={t('pay.sub')} onBack={close} backLabel={t('login.close')}>
      <Card>
        <View style={s.tr}>
          <T v="smallBold" tone="muted" style={{ flex: 1 }}>{t('pay.what')}</T>
          <T v="smallBold" tone="muted" style={s.col}>{t('pay.free')}</T>
          <T v="bodyBold" style={s.col}>{t('pay.member')}</T>
        </View>
        {rows.map(([what, free, mem]) => (
          <View key={what} style={s.tr} accessible accessibilityLabel={`${what}: ${t('pay.free')} ${free}, ${t('pay.member')} ${mem}`}>
            <T v="bodyBold" style={{ flex: 1 }}>{what}</T>
            <T style={s.col}>{free}</T>
            <T v="bodyBold" style={s.col}>{mem}</T>
          </View>
        ))}
      </Card>
      {member ? (
        <>
          <Card tone="done"><T v="subheading" tone="pastel">{t('pay.done')}</T><T tone="pastel">{t('pay.doneBody')}</T></Card>
          <Button size="cook" label={t('pay.back')} onPress={close} />
        </>
      ) : (
        <>
          <View accessibilityRole="radiogroup" accessibilityLabel={t('pay.period')} style={{ gap: space.sm }}>
            {plans.map(([id, name, price]) => (
              <Pressable key={id} accessibilityRole="radio" accessibilityState={{ checked: plan === id }} onPress={() => setPlan(id)}
                style={[s.plan, { backgroundColor: plan === id ? colors.accent : colors.surfaceSoft, borderColor: plan === id ? onPastel.ink : 'transparent' }]}>
                <T v="subheading" style={{ flex: 1, color: plan === id ? onPastel.ink : colors.ink }}>{name}</T>
                <T v="bodyBold" style={{ color: plan === id ? onPastel.ink : colors.ink }}>{price}</T>
              </Pressable>
            ))}
          </View>
          {error && <ApiNotice kind={error} />}
          <Button size="cook" disabled={busy} label={busy ? t('pay.busy') : t('pay.start', { plan: plan === 'yearly' ? t('pay.yearly') : t('pay.monthly') })} onPress={() => run(false)} />
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button style={{ flex: 1 }} kind="secondary" label={t('pay.restore')} disabled={busy} onPress={() => run(true)} />
            <Button style={{ flex: 1 }} kind="secondary" label={t('common.later')} onPress={close} />
          </View>
          <T v="small" tone="muted" style={{ textAlign: 'center' }}>{t('pay.note')}</T>
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  tr: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 44 },
  col: { width: 92, textAlign: 'center' },
  plan: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 64, paddingHorizontal: space.lg, borderRadius: radius.lg, borderWidth: 3 },
});
