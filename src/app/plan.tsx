import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Button, Card, Screen, T, Thumb } from '@/components/ui';
import { DISH_TINT, IMG } from '@/data/images';
import { MENU, planShopping, SUNDAY_PLAN } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { radius, space } from '@/theme/tokens';

// shortcut: เทียบกับข้าวจานละ 50 บาทแบบร้านในไทย ถ้าเปิดประเทศอื่นอีกให้ใช้ราคาอาหารนอกบ้านของประเทศนั้น
const PLATE = 50;
const SHOP = planShopping();

export default function Plan() {
  const { colors, t, pick, price } = useSettings();
  const [have, setHave] = useState<string[]>([]);
  const toBuy = SHOP.items.filter((g) => !have.includes(g.id)).reduce((sum, g) => sum + g.baht, 0);
  const save = (PLATE - SHOP.perMeal) * SUNDAY_PLAN.meals;
  const first = SUNDAY_PLAN.dishes[0].id;
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen tint={colors.header.cook} title={t('plan.title')} subtitle={t('plan.sub')} onBack={back} backLabel={t('tab.home')}
      footer={
        <Card tone="accent" style={s.foot}>
          <View style={{ flex: 1 }}>
            <T v="small" tone="pastelMuted">{t('detail.toBuy')}</T>
            <T v="heading" tone="pastel">{price(toBuy)}</T>
          </View>
          <Button kind="onPastel" size="cook" label={t('plan.start')} onPress={() => router.push(`/recipe/${first}`)} />
        </Card>
      }>
      <Card tone="navy">
        <T v="bodyBold" tone="onNavy">{t('plan.perMeal')}</T>
        <T v="hero" tone="yellow">{price(SHOP.perMeal)}</T>
        {save > 0 && <T v="bodyBold" tone="onNavy">{t('plan.vsPlate', { p: price(PLATE), n: SUNDAY_PLAN.meals, save: price(save) })}</T>}
        <T v="small" tone="onNavyMuted">{t('plan.costNote')}</T>
      </Card>

      <T v="subheading" accessibilityRole="header">{t('plan.order')}</T>
      <T v="small" tone="muted">{t('plan.orderNote')}</T>
      {SUNDAY_PLAN.dishes.map((d, i) => {
        const m = MENU.find((x) => x.id === d.id)!;
        return (
          <Card key={d.id} onPress={() => router.push(`/recipe/${d.id}`)} label={`${i + 1}. ${pick(m.name)}`} style={s.dish}>
            <Thumb source={IMG[m.img]} tint={DISH_TINT[m.id]} size={72} />
            <View style={{ flex: 1 }}>
              <T v="bodyBold">{i + 1}. {pick(m.name)}</T>
              <T v="small" tone="muted">{t('recipes.minutes', { n: m.mins })}</T>
              <T v="small">{pick(d.when)}</T>
            </View>
          </Card>
        );
      })}

      <T v="subheading" accessibilityRole="header">{t('plan.shop')}</T>
      <T v="small" tone="muted">{t('detail.haveHint')}</T>
      {SHOP.items.map((g) => {
        const on = have.includes(g.id);
        return (
          <Pressable key={g.id + g.unit.th} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`${pick(g.name)} ${g.q} ${pick(g.unit)}`}
            onPress={() => setHave(on ? have.filter((x) => x !== g.id) : [...have, g.id])} style={[s.row, { backgroundColor: colors.surfaceSoft }]}>
            <View style={[s.box, { borderColor: colors.ink, backgroundColor: on ? colors.success : 'transparent' }]}>
              {on && <Icon name="check" color={colors.bg} size={18} />}
            </View>
            <View style={{ flex: 1 }}>
              <T v="bodyBold">{pick(g.name)}</T>
              <T v="small" tone="muted">{g.q} {pick(g.unit)}</T>
            </View>
            <T v="bodyBold" tone={on ? 'success' : 'ink'}>{on ? t('detail.have') : price(g.baht)}</T>
          </Pressable>
        );
      })}

      <Card tone="ai">
        <T v="bodyBold" tone="pastel" accessibilityRole="header">{t('plan.store')}</T>
        <T tone="pastel">{t('plan.storeBody')}</T>
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  foot: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
  dish: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg },
  box: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
