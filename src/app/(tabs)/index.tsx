import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { ResumeCard } from '@/components/resume-card';
import { Button, Card, Float, Mascot, Pill, Screen, T, Thumb } from '@/components/ui';
import { IMG, LAYERS, MASCOT, SCENE } from '@/data/images';
import { MENU, planShopping } from '@/data/recipes';
import { BETA } from '@/lib/beta';
import type { L } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

// บทพูดเชฟจิ๋วจากหน้าร้านในต้นแบบ
const LINES: L[] = [
  { th: 'ยินดีต้อนรับ! วันนี้ทำกะเพราหมูสับไข่ดาวกันไหม?', en: 'Welcome! Shall we make basil pork with fried egg today?' },
  { th: 'ใช้เวลา 15 นาที เดี๋ยวพาทำทีละขั้น', en: 'It takes 15 minutes. I will guide you step by step.' },
  { th: 'ดูสูตรก่อนก็ได้ ว่ามีวัตถุดิบครบไหม', en: 'Check the recipe first to see if you have everything.' },
];

const PER_MEAL = planShopping().perMeal;

export default function Home() {
  const { colors, t, pick, price, runs } = useSettings();
  const [line, setLine] = useState(0);
  const pickToday = MENU[0];
  return (
    <Screen tint={colors.header.home} title={t('home.title')} scene={SCENE.home}>
      {/* จุดเด่นของจอ: จานแนะนำวันนี้ พร้อมบทพูดของเชฟและปุ่มเริ่มทำ */}
      <Card tone="coral" style={{ gap: space.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <View style={{ flex: 1, gap: space.sm }}>
            <T v="smallBold" tone="pastel">{t('home.today')}</T>
            <T v="title" tone="pastel" accessibilityRole="header">{pick(pickToday.name)}</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
              <Pill label={t('recipes.minutes', { n: pickToday.mins })} />
              <Pill label={price(pickToday.baht)} />
            </View>
          </View>
          <Float><Image source={IMG[pickToday.img]} style={{ width: 116, height: 116 }} contentFit="contain" accessible={false} /></Float>
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: radius.sm, padding: space.md }}>
          <T v="smallBold" tone="pastelMuted">{t('home.chef')}</T>
          <T v="bodyBold" tone="pastel">{pick(LINES[line % LINES.length])}</T>
        </View>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Button kind="onPastel" size="cook" label={t('detail.start')} onPress={() => router.push(`/recipe/${pickToday.id}`)} style={{ flex: 1, paddingHorizontal: space.md }} />
          <Button kind="onPastelLight" size="cook" label={t('home.next')} onPress={() => setLine(line + 1)} style={{ paddingHorizontal: space.lg }} />
        </View>
      </Card>
      <ResumeCard />
      <Card tone="navy" onPress={() => router.push('/plan')} label={`${t('plan.title')}, ${t('plan.perMeal')} ${price(PER_MEAL)}`} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View style={{ flex: 1 }}>
          <T v="subheading" tone="onNavy">{t('plan.title')}</T>
          <T v="smallBold" tone="onNavyMuted">{t('plan.perMeal')}</T>
          <T v="hero" tone="yellow">{price(PER_MEAL)}</T>
          <T v="small" tone="onNavyMuted">{t('plan.sub')}</T>
        </View>
        <Float><Mascot source={MASCOT.shop} wave={LAYERS.shop} size={104} /></Float>
        <Icon name="next" color="#FFFFFF" />
      </Card>
      {!BETA && (
        <Card onPress={() => router.push('/market')} label={t('market.open')} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <Thumb source={MASCOT.shop} size={64} />
          <View style={{ flex: 1 }}>
            <T v="subheading">{t('market.open')}</T>
            <T v="small" tone="muted">{t('market.openSub')}</T>
          </View>
        </Card>
      )}
      <Card tone="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View style={{ flex: 1 }}>
          <T v="hero" tone="pastel">{runs.length}</T>
          <T v="bodyBold" tone="pastel">{t('home.cooked')}</T>
        </View>
        <Float motion={runs.length ? 'jump' : 'sway'}><Image source={runs.length ? MASCOT.cheer : MASCOT.cook} style={{ width: 96, height: 96 }} contentFit="contain" accessible={false} /></Float>
      </Card>
    </Screen>
  );
}
