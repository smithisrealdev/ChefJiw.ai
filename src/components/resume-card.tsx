import { router } from 'expo-router';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { Card, T, Thumb } from '@/components/ui';
import { IMG } from '@/data/images';
import { MENU } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { onPastel, space } from '@/theme/tokens';

export function ResumeCard() {
  const { progress, t, pick } = useSettings();
  const m = progress && MENU.find((x) => x.id === progress.recipe);
  if (!progress || !m) return null;
  return (
    <Card tone="accent" onPress={() => router.push(`/cook/${m.id}`)} label={t('home.resume')} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
      <Thumb source={IMG[m.img]} size={56} />
      <View style={{ flex: 1 }}>
        <T v="smallBold" tone="pastelMuted">{t('home.resume')}</T>
        <T v="subheading" tone="pastel">{pick(m.name)}</T>
        <T v="small" tone="pastelMuted">{t('home.resumeStep', { n: progress.step + 1, total: progress.total })}</T>
      </View>
      <Icon name="next" color={onPastel.ink} />
    </Card>
  );
}
