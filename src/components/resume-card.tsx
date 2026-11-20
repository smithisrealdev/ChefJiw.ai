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
export function ResumeCard({ on }: { on?: { bg: string; fg: string } }) {
  const { progress, t, pick, colors } = useSettings();
  const timed = progress.some((x) => x.timer);
  // on = วางบนจอสีเต็ม (หน้าร้าน): ใช้พื้นและสีตัวอักษรของจอนั้นแทนการ์ดสีอ่อน
  const c = on && { color: on.fg };
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
      <Card key={x.recipe} tone="accent" onPress={() => router.push(`/cook/${m.id}`)} label={`${t('home.resume')}: ${pick(m.name)}`} style={[{ flexDirection: 'row', alignItems: 'center', gap: space.md }, on && { backgroundColor: on.bg }]}>
        <Thumb source={IMG[m.img]} size={56} />
        <View style={{ flex: 1 }}>
          <T v="smallBold" tone="pastelMuted" style={c}>{t('home.resume')}</T>
          <T v="subheading" tone="pastel" style={c}>{pick(m.name)}</T>
          <T v="small" tone="pastelMuted" style={c}>{t('home.resumeStep', { n: x.step + 1, total: x.total })}{timer}</T>
        </View>
        <Icon name="next" color={on ? on.fg : colors.ink} />
      </Card>
    );
  });
}
