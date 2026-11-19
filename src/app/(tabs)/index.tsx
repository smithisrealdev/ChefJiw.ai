import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ResumeCard } from '@/components/resume-card';
import { Button, Card, Screen, T, Thumb } from '@/components/ui';
import { IMG, MASCOT } from '@/data/images';
import { MENU } from '@/data/recipes';
import type { L } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

// บทพูดเชฟช้างจากหน้าร้านในต้นแบบ
const LINES: L[] = [
  { th: 'ยินดีต้อนรับ! วันนี้ทำกะเพราหมูสับไข่ดาวกันไหม?', en: 'Welcome! Shall we make basil pork with fried egg today?' },
  { th: 'ใช้เวลา 15 นาที เดี๋ยวพาทำทีละขั้น', en: 'It takes 15 minutes. I will guide you step by step.' },
  { th: 'ดูสูตรก่อนก็ได้ ว่ามีวัตถุดิบครบไหม', en: 'Check the recipe first to see if you have everything.' },
];

export default function Home() {
  const { colors, t, pick, price, runs } = useSettings();
  const [line, setLine] = useState(0);
  const pickToday = MENU[0];
  return (
    <Screen tint={colors.header.home} title={t('home.title')} mascot={MASCOT.elephant}>
      <Card tone="note">
        <T v="smallBold" tone="pastelMuted">{t('home.chef')}</T>
        <T v="subheading" tone="pastel" accessibilityRole="header">{pick(LINES[line % LINES.length])}</T>
        <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.sm }}>
          <Button kind="onPastel" label={t('detail.start')} onPress={() => router.push(`/recipe/${pickToday.id}`)} />
          <Button kind="onPastelLight" label={t('home.next')} onPress={() => setLine(line + 1)} />
        </View>
      </Card>
      <ResumeCard />
      <T v="subheading" accessibilityRole="header">{t('home.today')}</T>
      <Card onPress={() => router.push(`/recipe/${pickToday.id}`)} label={pick(pickToday.name)} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Thumb source={IMG[pickToday.img]} tint="#FFD9CC" size={72} />
        <View style={{ flex: 1 }}>
          <T v="subheading">{pick(pickToday.name)}</T>
          <T v="small" tone="muted">{t('recipes.minutes', { n: pickToday.mins })} · {t('recipes.kcal', { n: pickToday.kcal })}</T>
        </View>
        <T v="subheading">{price(pickToday.baht)}</T>
      </Card>
      <Card>
        <T v="title">{runs.length}</T>
        <T tone="muted">{t('home.cooked')}</T>
      </Card>
    </Screen>
  );
}
