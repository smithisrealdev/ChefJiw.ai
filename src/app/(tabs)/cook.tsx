import { View } from 'react-native';

import { DishCard } from '@/components/dish-card';
import { ResumeCard } from '@/components/resume-card';
import { Screen, T } from '@/components/ui';
import { MENU } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

export default function CookTab() {
  const { colors, t } = useSettings();
  return (
    <Screen tint={colors.header.cook} title={t('cookTab.title')} subtitle={t('cookTab.hint')} lead="cook">
      <ResumeCard />
      <T v="subheading" accessibilityRole="header">{t('cookTab.pick')}</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: space.md }}>
        {MENU.filter((m) => m.ready).map((m) => <DishCard key={m.id} m={m} />)}
      </View>
    </Screen>
  );
}
