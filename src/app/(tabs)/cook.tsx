import { router } from 'expo-router';
import { View } from 'react-native';

import { ResumeCard } from '@/components/resume-card';
import { Card, Screen, T, Thumb } from '@/components/ui';
import { IMG, MASCOT } from '@/data/images';
import { MENU } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

export default function CookTab() {
  const { colors, t, pick } = useSettings();
  return (
    <Screen tint={colors.header.cook} title={t('cookTab.title')} subtitle={t('cookTab.hint')} mascot={MASCOT.elephant}>
      <ResumeCard />
      <T v="subheading" accessibilityRole="header">{t('cookTab.pick')}</T>
      {MENU.filter((m) => m.ready).map((m) => (
        <Card key={m.id} onPress={() => router.push(`/recipe/${m.id}`)} label={pick(m.name)} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <Thumb source={IMG[m.img]} size={64} />
          <View style={{ flex: 1 }}>
            <T v="subheading">{pick(m.name)}</T>
            <T v="small" tone="muted">{t('recipes.minutes', { n: m.mins })}</T>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
