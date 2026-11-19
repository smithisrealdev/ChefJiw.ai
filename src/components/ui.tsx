import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import type { ApiErrorKind } from '@/lib/api';
import { BETA } from '@/lib/beta';
import { FREE_PER_DAY } from '@/lib/quota';
import { useSettings } from '@/lib/settings';
import { fonts, onPastel, radius, space, touch, type } from '@/theme/tokens';

type TextVariant = 'title' | 'heading' | 'subheading' | 'body' | 'bodyBold' | 'small' | 'smallBold' | 'step';
const VARIANT: Record<TextVariant, TextStyle> = {
  title: { fontFamily: fonts.heading, fontSize: type.xxl, lineHeight: type.xxl * 1.3 },
  heading: { fontFamily: fonts.heading, fontSize: type.xl, lineHeight: type.xl * 1.35 },
  subheading: { fontFamily: fonts.heading, fontSize: type.lg, lineHeight: type.lg * 1.4 },
  body: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.6 },
  bodyBold: { fontFamily: fonts.bodySemi, fontSize: type.md, lineHeight: type.md * 1.6 },
  small: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.5 },
  smallBold: { fontFamily: fonts.bodySemi, fontSize: type.sm, lineHeight: type.sm * 1.5 },
  // คำสั่งในหน้าทำอาหาร อ่านได้จากระยะหนึ่งช่วงแขน (แผน: ไม่ต่ำกว่า 18)
  step: { fontFamily: fonts.bodySemi, fontSize: type.xl, lineHeight: type.xl * 1.55 },
};

/** ข้อความทั้งแอป ขยายตามขนาดตัวอักษรของเครื่องอัตโนมัติ; tone 'pastel' ใช้บนพื้นสีอ่อนที่ไม่เปลี่ยนตามธีม */
export function T({ v = 'body', tone = 'ink', style, children, ...rest }: { v?: TextVariant; tone?: 'ink' | 'muted' | 'success' | 'warn' | 'pastel' | 'pastelMuted' | 'onPrimary'; style?: StyleProp<TextStyle>; children: ReactNode } & Omit<TextProps, 'style' | 'children'>) {
  const { colors } = useSettings();
  const color = { ink: colors.ink, muted: colors.muted, success: colors.success, warn: colors.warn, pastel: onPastel.ink, pastelMuted: onPastel.muted, onPrimary: colors.onPrimary }[tone];
  return <Text style={[VARIANT[v], { color }, style]} {...rest}>{children}</Text>;
}

export function Button({ label, onPress, kind = 'primary', icon, size = 'md', disabled, style }: { label: string; onPress: () => void; kind?: 'primary' | 'secondary' | 'accent' | 'onPastel' | 'onPastelLight'; icon?: IconName; size?: 'md' | 'cook'; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors } = useSettings();
  // onPastel*: ปุ่มที่วางบนการ์ดพาสเทล สีคงที่ทั้งสองธีมเพื่อให้คอนทราสต์ผ่านเสมอ
  const bg = { primary: colors.primary, secondary: colors.surfaceSoft, accent: colors.accent, onPastel: onPastel.ink, onPastelLight: '#FFFFFF' }[kind];
  const fg = { primary: colors.onPrimary, secondary: colors.ink, accent: colors.onAccent, onPastel: '#FFFFFF', onPastelLight: onPastel.ink }[kind];
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.button, { backgroundColor: bg, minHeight: size === 'cook' ? touch.cook : 48, opacity: disabled ? 0.45 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}>
      {icon && <Icon name={icon} color={fg} />}
      <Text style={{ fontFamily: fonts.heading, fontSize: size === 'cook' ? type.lg : type.md, color: fg }}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, onPastelBg, filled }: { icon: IconName; label: string; onPress: () => void; onPastelBg?: boolean; filled?: boolean }) {
  const { colors, isDark } = useSettings();
  const bg = filled ? colors.primary : onPastelBg && !isDark ? '#FFFFFF' : colors.surface;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={4}
      style={({ pressed }) => [s.iconButton, { backgroundColor: bg, transform: [{ scale: pressed ? 0.94 : 1 }] }]}>
      <Icon name={icon} color={filled ? colors.onPrimary : onPastelBg && !isDark ? onPastel.ink : colors.ink} />
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
      style={({ pressed }) => [s.chip, { backgroundColor: selected ? colors.primary : colors.surfaceSoft, transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
      <Text style={{ fontFamily: fonts.bodySemi, fontSize: type.md, color: selected ? colors.onPrimary : colors.ink }}>{label}</Text>
    </Pressable>
  );
}

/** การ์ดพื้นสี: soft = พื้นรองตามธีม; note/ai/done/danger/accent = พาสเทลที่ใช้ตัวอักษรเข้มเสมอ */
export function Card({ tone = 'soft', children, style, onPress, label }: { tone?: 'soft' | 'note' | 'ai' | 'done' | 'danger' | 'accent' | 'surface'; children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; label?: string }) {
  const { colors } = useSettings();
  const bg = { soft: colors.surfaceSoft, surface: colors.surface, note: colors.note, ai: colors.ai, done: colors.done, danger: colors.danger, accent: colors.accent }[tone];
  if (!onPress) return <View style={[s.card, { backgroundColor: bg }, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.card, { backgroundColor: bg, transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
      {children}
    </Pressable>
  );
}

/** หัวหน้าจอพร้อมมาสคอต พื้นพาสเทลประจำหน้า แล้วต่อด้วยแผ่นเนื้อหาสีพื้น */
export function Screen({ tint, title, subtitle, mascot, onBack, backLabel, right, children, footer }: { tint: string; title: string; subtitle?: string; mascot?: number; onBack?: () => void; backLabel?: string; right?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { colors, isDark } = useSettings();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: tint }}>
      <View style={[s.header, { paddingTop: insets.top + space.md }]}>
        <View style={{ flex: 1, gap: space.xs }}>
          {onBack && <View style={{ marginBottom: space.sm }}><IconButton icon="back" label={backLabel ?? ''} onPress={onBack} onPastelBg /></View>}
          <T v="title" tone={isDark ? 'ink' : 'pastel'} accessibilityRole="header">{title}</T>
          {subtitle && <T v="small" tone={isDark ? 'muted' : 'pastelMuted'}>{subtitle}</T>}
        </View>
        {right}
        {mascot && <Image source={mascot} style={s.mascot} contentFit="contain" accessible={false} />}
      </View>
      <View style={[s.sheet, { backgroundColor: colors.bg }]}>
        <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.md, paddingBottom: footer ? 120 : space.xxl }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer && <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, space.md) }]}>{footer}</View>}
      </View>
    </View>
  );
}

/** แผ่นที่เลื่อนขึ้นจากล่าง ปิดได้ทั้งปุ่มปิดและปุ่มย้อนกลับของระบบ */
export function Sheet({ visible, onClose, title, closeLabel, children }: { visible: boolean; onClose: () => void; title: string; closeLabel: string; children: ReactNode }) {
  const { colors } = useSettings();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.scrim} onPress={onClose} accessibilityLabel={closeLabel} />
      <View style={[s.modal, { backgroundColor: colors.bg, paddingBottom: Math.max(insets.bottom, space.lg) }]}>
        <View style={s.modalHead}>
          <T v="heading" style={{ flex: 1 }} accessibilityRole="header">{title}</T>
          <Button label={closeLabel} kind="secondary" onPress={onClose} />
        </View>
        <ScrollView contentContainerStyle={{ gap: space.sm, paddingBottom: space.lg }}>{children}</ScrollView>
      </View>
    </Modal>
  );
}

/** โครงรอโหลด แสดงทันทีภายใน 0.3 วินาทีระหว่างรอคำตอบ */
export function Skeleton({ lines = 2, label }: { lines?: number; label: string }) {
  const { colors } = useSettings();
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} style={[s.card, { backgroundColor: colors.surfaceSoft, gap: space.sm }]}>
      <T v="smallBold" tone="muted">{label}</T>
      {Array.from({ length: lines }, (_, k) => <View key={k} style={{ height: 14, width: k === lines - 1 ? '60%' : '100%', borderRadius: radius.pill, backgroundColor: colors.line }} />)}
    </View>
  );
}

/** สถานะผิดพลาดของการเรียก backend พร้อมทางแก้ */
export function ApiNotice({ kind, onRetry }: { kind: ApiErrorKind; onRetry?: () => void }) {
  const { t } = useSettings();
  const [title, body] = {
    offline: [t('err.offline'), t('err.offlineBody')], failed: [t('err.failed'), t('err.failedBody')],
    not_configured: [t('err.notConfigured'), t('err.notConfiguredBody')],
    quota: [t('ask.quotaTitle'), t('ask.quotaBody', { n: FREE_PER_DAY })], unauthorized: [t('ask.loginTitle'), t('ask.loginBody')],
  }[kind];
  return (
    <Card tone={kind === 'offline' ? 'note' : 'danger'} style={{ gap: space.sm }}>
      <View accessibilityRole="alert" accessibilityLiveRegion="polite">
        <T v="subheading" style={{ color: kind === 'offline' ? onPastel.ink : onPastel.warn }}>{title}</T>
        <T tone="pastel">{body}</T>
      </View>
      {onRetry && (kind === 'offline' || kind === 'failed') && <Button kind="onPastel" label={t('common.retry')} onPress={onRetry} style={{ alignSelf: 'flex-start' }} />}
      {kind === 'unauthorized' && <Button kind="onPastel" label={t('me.signIn')} onPress={() => router.push('/login')} style={{ alignSelf: 'flex-start' }} />}
      {kind === 'quota' && !BETA && <Button kind="onPastel" label={t('ask.seeMember')} onPress={() => router.push('/paywall')} style={{ alignSelf: 'flex-start' }} />}
    </Card>
  );
}

export function Thumb({ source, tint, size = 64 }: { source: number; tint?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: radius.sm, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={source} style={{ width: size - 6, height: size - 6 }} contentFit="contain" accessible={false} />
    </View>
  );
}

const s = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingHorizontal: space.xl, borderRadius: radius.pill },
  iconButton: { width: touch.min, height: touch.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  chip: { minHeight: touch.min, paddingHorizontal: space.lg, borderRadius: radius.pill, justifyContent: 'center' },
  card: { borderRadius: radius.lg, padding: space.lg, gap: space.xs },
  header: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.md },
  mascot: { width: 96, height: 139 },
  sheet: { flex: 1, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, overflow: 'hidden' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.lg, paddingTop: space.sm },
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  modal: { maxHeight: '88%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: space.lg, paddingTop: space.lg },
  modalHead: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.md },
});
