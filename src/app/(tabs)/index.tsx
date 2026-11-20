import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { ResumeCard } from '@/components/resume-card';
import { Button, Card, Mascot, Pill, Screen, T, Thumb } from '@/components/ui';
import { IMG, MASCOT, SCENE } from '@/data/images';
import { buildRecipe, MENU, planShopping } from '@/data/recipes';
import { lastAns, reminders } from '@/lib/assistant';
import { BETA } from '@/lib/beta';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

const PER_MEAL = planShopping().perMeal;

export default function Home() {
  const { colors, t, pick, price, runs } = useSettings();
  const [line, setLine] = useState(0);
  // เชฟแนะนำจากสิ่งที่เคยทำ: จานที่ครั้งก่อนยังมีข้อให้แก้ก่อน ไม่งั้นจานที่ยังไม่เคยทำ บทพูดอ้างคะแนนและคำตอบครั้งก่อน
  const ready = MENU.filter((m) => m.ready), lastRun = runs.at(-1), lastDish = lastRun && MENU.find((m) => m.id === lastRun.recipe);
  const lastRecipe = lastRun ? buildRecipe(lastRun.recipe) : null;
  const fix = lastRecipe ? reminders(lastRecipe, lastAns(runs, lastRecipe.id))[0] : undefined;
  const pickToday = (fix && lastDish) || ready.find((m) => !runs.some((x) => x.recipe === m.id)) || ready[0];
  const next = pick(pickToday.name);
  const LINES = [
    fix && lastDish ? t('home.fix', { dish: pick(lastDish.name), x: pick(fix.said) })
      : lastRun && lastDish ? t('home.again', { dish: pick(lastDish.name), score: lastRun.score.toFixed(1), next })
      : t('home.first', { next }),
    t('home.time', { n: pickToday.mins }), t('home.check'),
  ];
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
          <Image source={IMG[pickToday.img]} style={{ width: 116, height: 116 }} contentFit="contain" accessible={false} />
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: radius.sm, padding: space.md }}>
          <T v="smallBold" tone="pastelMuted">{t('home.chef')}</T>
          <T v="bodyBold" tone="pastel">{LINES[line % LINES.length]}</T>
        </View>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Button kind="onPastel" size="cook" label={t('detail.start')} onPress={() => router.push(`/recipe/${pickToday.id}`)} style={{ flex: 1, paddingHorizontal: space.md }} />
          <Button kind="onPastelLight" size="cook" label={t('home.next')} onPress={() => setLine(line + 1)} style={{ paddingHorizontal: space.lg }} />
        </View>
      </Card>
      <ResumeCard />
      <Card onPress={() => router.push('/plan')} label={`${t('plan.title')}, ${t('plan.perMeal')} ${price(PER_MEAL)}`} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View style={{ flex: 1 }}>
          <T v="subheading">{t('plan.title')}</T>
          <T v="smallBold" tone="muted">{t('plan.perMeal')}</T>
          <T v="hero">{price(PER_MEAL)}</T>
          <T v="small" tone="muted">{t('plan.sub')}</T>
        </View>
        <Mascot name="shop" size={104} still />
        <Icon name="next" color={colors.ink} />
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
        <Mascot name={runs.length ? 'cheer' : 'cook'} size={96} still />
      </Card>
    </Screen>
  );
}
