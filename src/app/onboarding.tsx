import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Chip, T, Thumb } from '@/components/ui';
import { IMG, MASCOT } from '@/data/images';
import { DEFAULT_OPTS, MENU } from '@/data/recipes';
import { BETA } from '@/lib/beta';
import { COUNTRIES } from '@/lib/money';
import { useSettings } from '@/lib/settings';
import { onPastel, radius, space } from '@/theme/tokens';

const BG = ['#FFE66D', '#FFD6DF', '#E9E6FF', '#8FE3CF'];

export default function Onboarding() {
  const { t, pick, lang, country, set, colors, isDark } = useSettings();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [dish, setDish] = useState(0);
  const ready = MENU.filter((m) => m.ready);

  const finish = (to: string) => {
    const m = ready[dish];
    if (to.startsWith('/cook')) set({ onboarded: true, progress: { recipe: m.id, o1: DEFAULT_OPTS[m.id][0], o2: DEFAULT_OPTS[m.id][1], adapt: [], step: 0, total: 0 } });
    else set({ onboarded: true });
    router.replace('/');
    if (to !== '/') router.push(to);
  };
  const ink = isDark ? colors.ink : onPastel.ink;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? colors.bg : BG[step] }}>
      <View style={[s.top, { paddingTop: insets.top + space.md }]}>
        <Button kind={isDark ? 'secondary' : 'onPastelLight'} label={t('ob.skip')} onPress={() => finish('/')} />
      </View>
      <Image source={MASCOT.elephant} style={s.mascot} contentFit="contain" accessible={false} />
      <View style={[s.sheet, { backgroundColor: colors.bg, paddingBottom: Math.max(insets.bottom, space.lg) }]}>
        <ScrollView contentContainerStyle={{ gap: space.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }} accessibilityLabel={t('ob.count', { n: step + 1, total: 4 })}>
            {[0, 1, 2, 3].map((k) => <View key={k} style={{ width: k === step ? 24 : 8, height: 8, borderRadius: radius.pill, backgroundColor: k === step ? colors.ink : colors.line }} />)}
            <T v="smallBold" tone="muted">{t('ob.count', { n: step + 1, total: 4 })}</T>
          </View>

          {step === 0 && (
            <>
              <T v="title" accessibilityRole="header">{t(BETA ? 'me.lang' : 'ob.langTitle')}</T>
              {!BETA && <T v="smallBold" tone="muted">{t('me.lang')}</T>}
              <View style={s.row}>
                {(['th', 'en'] as const).map((code) => <Chip key={code} label={code === 'th' ? 'ไทย' : 'English'} selected={lang === code} onPress={() => set({ lang: code })} />)}
              </View>
              {!BETA && (
                <>
                  <T v="smallBold" tone="muted">{t('me.country')}</T>
                  <View style={s.row}>
                    {COUNTRIES.map((c) => <Chip key={c} label={t(`country.${c}`)} selected={country === c} onPress={() => set({ country: c })} />)}
                  </View>
                  <T tone="muted">{t('ob.countryNote')}</T>
                </>
              )}
            </>
          )}
          {(step === 1 || step === 2) && (
            <>
              <T v="title" accessibilityRole="header">{t(step === 1 ? 'ob.t1' : 'ob.t2')}</T>
              <T tone="muted">{t(step === 1 ? 'ob.b1' : 'ob.b2')}</T>
              {step === 2 && <Card tone="ai"><T tone="pastel">{t('ob.example')}</T></Card>}
            </>
          )}
          {step === 3 && (
            <>
              <T v="title" accessibilityRole="header">{t('ob.pickTitle')}</T>
              <T tone="muted">{t('ob.pickBody')}</T>
              {ready.map((m, k) => (
                <Pressable key={m.id} accessibilityRole="radio" accessibilityState={{ checked: dish === k }} onPress={() => setDish(k)}
                  style={[s.dish, { backgroundColor: dish === k ? colors.accent : colors.surfaceSoft, borderColor: dish === k ? onPastel.ink : 'transparent' }]}>
                  <Thumb source={IMG[m.img]} size={56} />
                  <T v="subheading" style={{ flex: 1, color: dish === k ? onPastel.ink : colors.ink }}>{pick(m.name)}</T>
                  {dish === k && <T v="smallBold" tone="pastelMuted">{t('ob.picked')}</T>}
                </Pressable>
              ))}
            </>
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.md }}>
          {step > 0 && <Button kind="secondary" label={t('ob.back')} onPress={() => setStep(step - 1)} size="cook" />}
          <Button style={{ flex: 1 }} size="cook" label={step < 3 ? t('ob.next') : t('ob.start')}
            onPress={() => (step < 3 ? setStep(step + 1) : finish(`/cook/${ready[dish].id}`))} />
        </View>
        {step === 3 && <Pressable accessibilityRole="link" onPress={() => finish('/recipes')} style={s.link}><T v="bodyBold" style={{ color: ink, textDecorationLine: 'underline' }}>{t('ob.browse')}</T></Pressable>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  top: { alignItems: 'flex-end', paddingHorizontal: space.lg },
  mascot: { width: 150, height: 218, alignSelf: 'center' },
  sheet: { flex: 1, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.lg },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  dish: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, paddingRight: space.lg, borderRadius: radius.lg, borderWidth: 3 },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
