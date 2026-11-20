import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { Card, mmss, T, Thumb } from '@/components/ui';
import { IMG } from '@/data/images';
import { MENU } from '@/data/recipes';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

/** การ์ดทำต่อ หนึ่งใบต่อจานที่ทำค้างไว้ บอกเวลาที่เหลือถ้าเริ่มจับเวลาไว้ */
export function ResumeCard() {
  const { progress, t, pick, colors } = useSettings();
  const timed = progress.some((x) => x.timer);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!timed) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [timed]);
  return progress.map((x) => {
    const m = MENU.find((d) => d.id === x.recipe);
    if (!m) return null;
    const left = x.timer ? Math.ceil((x.timer.endAt - now) / 1000) : null;
    const timer = left === null ? '' : ` · ${left > 0 ? t('cook.timerLeft', { t: mmss(left) }) : t('cook.timerNotify')}`;
    return (
      <Card key={x.recipe} tone="accent" onPress={() => router.push(`/cook/${m.id}`)} label={`${t('home.resume')}: ${pick(m.name)}`} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Thumb source={IMG[m.img]} size={56} />
        <View style={{ flex: 1 }}>
          <T v="smallBold" tone="pastelMuted">{t('home.resume')}</T>
          <T v="subheading" tone="pastel">{pick(m.name)}</T>
          <T v="small" tone="pastelMuted">{t('home.resumeStep', { n: x.step + 1, total: x.total })}{timer}</T>
        </View>
        <Icon name="next" color={colors.ink} />
      </Card>
    );
  });
}
