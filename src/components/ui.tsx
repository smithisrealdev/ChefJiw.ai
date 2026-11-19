import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { LAYERS, type BodyMove, type Head, type MascotName, type Motion, type Part, type PartMove, type SCENE } from '@/data/images';
import type { ApiErrorKind } from '@/lib/api';
import { BETA } from '@/lib/beta';
import { FREE_PER_DAY } from '@/lib/quota';
import { useSettings } from '@/lib/settings';
import { fonts, onPastel, onTint, radius, space, touch, type, vivid } from '@/theme/tokens';

type TextVariant = 'hero' | 'price' | 'title' | 'heading' | 'subheading' | 'body' | 'bodyBold' | 'small' | 'smallBold' | 'step';
const VARIANT: Record<TextVariant, TextStyle> = {
  // ตัวเลขเด่นของจอ (ราคาต่อมื้อ เวลาที่เหลือ จำนวนจานที่ทำแล้ว)
  // ตัวเลขใช้ฟอนต์เนื้อความตัวหนา เพราะเลขศูนย์ของฟอนต์หัวข้อ (Mitr) มีขีดทับ
  hero: { fontFamily: fonts.bodyBold, fontSize: type.hero, lineHeight: type.hero * 1.2, fontVariant: ['tabular-nums'] },
  price: { fontFamily: fonts.bodyBold, fontSize: type.xl, lineHeight: type.xl * 1.35, fontVariant: ['tabular-nums'] },
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
export function T({ v = 'body', tone = 'ink', style, children, ...rest }: { v?: TextVariant; tone?: 'ink' | 'muted' | 'success' | 'warn' | 'pastel' | 'pastelMuted' | 'onPrimary' | 'onNavy' | 'onNavyMuted' | 'yellow'; style?: StyleProp<TextStyle>; children: ReactNode } & Omit<TextProps, 'style' | 'children'>) {
  const { colors } = useSettings();
  const color = { ink: colors.ink, muted: colors.muted, success: colors.success, warn: colors.warn, pastel: onPastel.ink, pastelMuted: onPastel.muted, onPrimary: colors.onPrimary, onNavy: '#FFFFFF', onNavyMuted: vivid.onNavyMuted, yellow: vivid.yellow }[tone];
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

/** การ์ดพื้นสี: soft = พื้นรองตามธีม; note/ai/done/danger/accent = พาสเทลที่ใช้ตัวอักษรเข้มเสมอ; navy/coral/mint = การ์ดเด่นสีสด (navy ใช้ตัวอักษรขาว) */
export function Card({ tone = 'soft', children, style, onPress, label }: { tone?: 'soft' | 'note' | 'ai' | 'done' | 'danger' | 'accent' | 'surface' | 'navy' | 'coral' | 'mint'; children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; label?: string }) {
  const { colors } = useSettings();
  const bg = { soft: colors.surfaceSoft, surface: colors.surface, note: colors.note, ai: colors.ai, done: colors.done, danger: colors.danger, accent: colors.accent, navy: vivid.navy, coral: vivid.coral, mint: vivid.mint }[tone];
  if (!onPress) return <View style={[s.card, { backgroundColor: bg }, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.card, { backgroundColor: bg, transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
      {children}
    </Pressable>
  );
}

type Ease = 'sin' | 'up' | 'down';
const EASE = { sin: Easing.inOut(Easing.sin), up: Easing.out(Easing.quad), down: Easing.in(Easing.quad) };
// แต่ละจังหวะ: [ค่าปลายทาง, เวลา (ms), การเร่ง] แล้วพัก rest ก่อนวนใหม่
const MOVES: Record<Motion | PartMove | BodyMove | 'blink', { steps: [number, number, Ease][]; rest: number }> = {
  bob: { steps: [[-6, 1400, 'sin'], [0, 1400, 'sin']], rest: 0 },
  sway: { steps: [[1, 800, 'sin'], [-1, 1600, 'sin'], [0, 800, 'sin']], rest: 0 },
  jump: { steps: [[-20, 240, 'up'], [0, 240, 'down'], [-12, 180, 'up'], [0, 180, 'down']], rest: 900 },
  shake: { steps: [[-5, 70, 'sin'], [5, 140, 'sin'], [-5, 140, 'sin'], [5, 140, 'sin'], [0, 70, 'sin']], rest: 1800 },
  // ผัดกระทะ: กระทะกระดกแล้วของลอยขึ้นสูงกว่า รอบละเท่ากัน (1.2 วินาที) จึงเข้าจังหวะกัน
  toss: { steps: [[-1, 200, 'up'], [0, 260, 'down']], rest: 740 },
  fly: { steps: [[-1, 330, 'up'], [0, 330, 'down']], rest: 540 },
  // เดิน: ยกขาสลับข้าง ขาขวาเริ่มหลังขาซ้ายครึ่งรอบ
  stepL: { steps: [[-1, 200, 'up'], [0, 200, 'down']], rest: 400 },
  stepR: { steps: [[0, 400, 'sin'], [-1, 200, 'up'], [0, 200, 'down']], rest: 0 },
  // ชิม: ลดช้อนลง ค้างไว้ครู่หนึ่ง แล้วยกกลับมาที่ปากและค้างนานกว่า
  sip: { steps: [[1, 420, 'sin'], [1, 350, 'sin'], [0, 420, 'sin']], rest: 1400 },
  // เคาะ (มือเคาะคาง ช้อนเคาะ): สองครั้งแล้วพัก
  tap: { steps: [[-1, 160, 'up'], [0, 160, 'down'], [-1, 160, 'up'], [0, 160, 'down']], rest: 1500 },
  // ลอยช้าๆ (ฟองความคิด หัวใจ)
  puff: { steps: [[-1, 1300, 'sin'], [0, 1300, 'sin']], rest: 0 },
  // หยดเหงื่อไหลลงแล้วหายไป แล้วเริ่มใหม่ที่เดิม
  drip: { steps: [[1, 800, 'down'], [0, 1, 'sin']], rest: 900 },
  // ชูแขนขึ้นลง จังหวะเดียวกับ jump
  pump: { steps: [[-1, 240, 'up'], [0, 240, 'down'], [-0.6, 180, 'up'], [0, 180, 'down']], rest: 900 },
  // วิบวับ (ดาว เส้นตกใจ)
  twinkle: { steps: [[1, 450, 'sin'], [0, 450, 'sin']], rest: 250 },
  still: { steps: [], rest: 0 },
  // กะพริบตา: หลับเร็ว ลืมช้ากว่านิด แล้วเว้นช่วงยาว
  blink: { steps: [[1, 70, 'sin'], [0, 110, 'sin']], rest: 2900 },
  // ขาแกว่งตอนนั่ง: สองข้างสวนทางกัน
  swingL: { steps: [[1, 450, 'sin'], [0, 450, 'sin'], [-1, 450, 'sin'], [0, 450, 'sin']], rest: 0 },
  swingR: { steps: [[-1, 450, 'sin'], [0, 450, 'sin'], [1, 450, 'sin'], [0, 450, 'sin']], rest: 0 },
  // ทั้งตัว: หายใจ, โยกตัวตอนเดิน (รอบเท่ากับ stepL/stepR ขาข้างที่ลอยคือข้างที่ไม่ได้รับน้ำหนัก), โยกช้าๆ ตอนคิด, ยืดตัวตามจังหวะผัด (รอบเท่ากับ toss)
  breathe: { steps: [[1, 1300, 'sin'], [0, 1300, 'sin']], rest: 0 },
  waddle: { steps: [[1, 200, 'sin'], [-1, 400, 'sin'], [0, 200, 'sin']], rest: 0 },
  ponder: { steps: [[1, 1500, 'sin'], [-1, 3000, 'sin'], [0, 1500, 'sin']], rest: 0 },
  squash: { steps: [[1, 200, 'up'], [0, 260, 'down']], rest: 740 },
};
/** วนการขยับชุดหนึ่งไปเรื่อยๆ หลังหน่วง delay หยุดนิ่งถ้าเครื่องตั้งค่าลดการเคลื่อนไหว */
function useMove(move: keyof typeof MOVES, delay = 0) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const { steps, rest } = MOVES[move];
    if (!steps.length) return;
    const frames = steps.map(([toValue, duration, ease]) => Animated.timing(v, { toValue, duration, easing: EASE[ease], useNativeDriver: Platform.OS !== 'web' }));
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!reduce) timer = setTimeout(() => { loop = Animated.loop(Animated.sequence([...frames, Animated.delay(rest)])); loop.start(); }, delay);
    }).catch(() => {});
    return () => { clearTimeout(timer); loop?.stop(); };
  }, [v, move, delay]);
  return v;
}

/** ทำให้ภาพมีชีวิต: bob = ลอยขึ้นลงช้าๆ sway = โยกซ้ายขวา shake = สั่นตกใจ jump = กระโดดสองจังหวะพร้อมเงาที่พื้น
 *  delay = หน่วงก่อนเริ่ม ให้ตัวละครหลายตัวไม่ขยับพร้อมกัน */
export function Float({ children, motion = 'bob', delay = 0 }: { children: ReactNode; motion?: Motion; delay?: number }) {
  const v = useMove(motion, delay);
  if (motion === 'sway') return <Animated.View style={{ transformOrigin: 'bottom', transform: [{ rotate: v.interpolate({ inputRange: [-1, 1], outputRange: ['-4deg', '4deg'] }) }] }}>{children}</Animated.View>;
  if (motion === 'shake') return <Animated.View style={{ transform: [{ translateX: v }] }}>{children}</Animated.View>;
  if (motion === 'bob') return <Animated.View style={{ transform: [{ translateY: v }] }}>{children}</Animated.View>;
  return (
    <View>
      <Animated.View style={{ transform: [{ translateY: v }] }}>{children}</Animated.View>
      {/* เงาอยู่กับพื้น หดเล็กลงตอนตัวลอย */}
      <Animated.View style={{ alignSelf: 'center', width: '46%', height: 6, marginTop: -4, borderRadius: radius.pill, backgroundColor: 'rgba(36,33,43,0.14)', transform: [{ scaleX: v.interpolate({ inputRange: [-20, 0], outputRange: [0.6, 1] }) }] }} />
    </View>
  );
}

/** ชั้นหนึ่งของตัวละครที่ขยับเอง: หมุนรอบข้อต่อ (pivot) และหรือยกขึ้นลง ระยะเป็นสัดส่วนของขนาดภาพ จึงขยับเท่ากันทุกขนาด */
function Limb({ part, width, children }: { part: Part; width: number; children?: ReactNode }) {
  const v = useMove(part.move);
  const deg = part.deg ?? 0;
  const transform = [
    { translateY: Animated.multiply(v, width * (part.lift ?? 0)) },
    { translateX: Animated.multiply(v, part.move === 'sip' ? width * -0.02 : 0) },
    { rotate: v.interpolate({ inputRange: [-1, 1], outputRange: [`${-deg}deg`, `${deg}deg`] }) },
    { scale: part.move === 'twinkle' ? v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) : 1 },
  ];
  const opacity = part.move === 'twinkle' ? v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.45] })
    : part.move === 'drip' ? v.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1, 0] }) : 1;
  const origin = part.pivot ? `${part.pivot[0] * 100}% ${part.pivot[1] * 100}%` : 'center';
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, transformOrigin: origin, transform }]}>
      <Image source={part.source} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
      {children}
    </Animated.View>
  );
}

/** หัว: เอียงหรือเด้งรอบคอตามจังหวะของท่า และกะพริบตาเป็นระยะ (ตาอยู่ในชั้นของหัว จึงเอียงไปด้วยกัน) */
function HeadLayer({ head, width, blinkDelay }: { head: Head; width: number; blinkDelay: number }) {
  const eyes = useMove('blink', blinkDelay);
  return (
    <Limb part={{ source: head.source, move: head.move, lift: head.lift, deg: head.deg, pivot: head.neck }} width={width}>
      <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: `${head.eye[0] * 100}% ${head.eye[1] * 100}%`, transform: [{ scaleY: eyes.interpolate({ inputRange: [0, 1], outputRange: [1, 0.12] }) }] }]}>
        <Image source={head.eyes} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
      </Animated.View>
    </Limb>
  );
}

/** ตัวละครหนึ่งท่า ภาพจัตุรัส: ทั้งตัวขยับไปด้วยกันก่อน (หายใจ โยกตัว) แล้วแขนขาและของในมือขยับรอบข้อต่อของตัวเอง จึงดูเป็นร่างเดียว */
export function Mascot({ name, size }: { name: MascotName; size: number | '100%' }) {
  const [width, setWidth] = useState(typeof size === 'number' ? size : 0);
  const { body, head, front, parts, sway } = LAYERS[name];
  const v = useMove(sway ?? 'still');
  const whole = sway === 'breathe' ? [{ scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.022] }) }, { scaleX: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.99] }) }]
    : sway === 'squash' ? [{ scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }]
    : sway ? [{ rotate: v.interpolate({ inputRange: [-1, 1], outputRange: sway === 'waddle' ? ['-3deg', '3deg'] : ['-2deg', '2deg'] }) }]
    : [];
  return (
    <Animated.View style={{ width: size, aspectRatio: 1, transformOrigin: 'bottom', transform: whole }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {parts.filter((p) => p.behind).map((p, k) => <Limb key={k} part={p} width={width} />)}
      <Image source={body} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
      {/* กะพริบตาไม่พร้อมกันทุกตัว: หน่วงต่างกันตามชื่อท่า */}
      <HeadLayer head={head} width={width} blinkDelay={name.length * 430} />
      {front !== undefined && <Image source={front} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />}
      {parts.filter((p) => !p.behind).map((p, k) => <Limb key={k} part={p} width={width} />)}
    </Animated.View>
  );
}

/** หัวหน้าจอพร้อมมาสคอต พื้นสีสดประจำหน้า แล้วต่อด้วยแผ่นเนื้อหาสีพื้น */
export function Screen({ tint, title, subtitle, mascot, scene, onBack, backLabel, right, children, footer }: { tint: string; title: string; subtitle?: string; mascot?: number; scene?: (typeof SCENE)[keyof typeof SCENE]; onBack?: () => void; backLabel?: string; right?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { colors, isDark } = useSettings();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: tint }}>
      <View style={[s.header, { paddingTop: insets.top + space.md }]}>
        <View style={{ flex: 1, gap: space.xs }}>
          {onBack && <View style={{ marginBottom: space.sm }}><IconButton icon="back" label={backLabel ?? ''} onPress={onBack} onPastelBg /></View>}
          <T v="title" style={isDark ? undefined : { color: onTint(tint) }} accessibilityRole="header">{title}</T>
          {subtitle && <T v="smallBold" tone="muted" style={isDark ? undefined : { color: onTint(tint) }}>{subtitle}</T>}
        </View>
        {right}
        {mascot && <Float><Image source={mascot} style={s.mascot} contentFit="contain" accessible={false} /></Float>}
      </View>
      {scene && (
        <View style={{ width: '100%', aspectRatio: scene.ratio, marginTop: -space.sm }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Image source={scene.source} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
          {scene.cast.map((c, k) => (
            <View key={k} style={{ position: 'absolute', left: `${c.left * 100}%`, top: `${c.top * 100}%`, width: `${c.width * 100}%`, aspectRatio: 1 }}>
              {'motion' in c && c.motion ? <Float motion={c.motion}><Mascot name={c.name} size="100%" /></Float> : <Mascot name={c.name} size="100%" />}
            </View>
          ))}
        </View>
      )}
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Mascot name="think" size={48} />
        <T v="smallBold" tone="muted">{label}</T>
      </View>
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ flex: 1 }}>
          <T v="subheading" style={{ color: kind === 'offline' ? onPastel.ink : onPastel.warn }}>{title}</T>
          <T tone="pastel">{body}</T>
        </View>
        <Float motion="shake"><Mascot name="oops" size={72} /></Float>
      </View>
      {onRetry && (kind === 'offline' || kind === 'failed') && <Button kind="onPastel" label={t('common.retry')} onPress={onRetry} style={{ alignSelf: 'flex-start' }} />}
      {kind === 'unauthorized' && <Button kind="onPastel" label={t('me.signIn')} onPress={() => router.push('/login')} style={{ alignSelf: 'flex-start' }} />}
      {kind === 'quota' && !BETA && <Button kind="onPastel" label={t('ask.seeMember')} onPress={() => router.push('/paywall')} style={{ alignSelf: 'flex-start' }} />}
    </Card>
  );
}

/** ป้ายข้อมูลสั้นๆ พื้นขาว ใช้บนการ์ดสีสด */
export function Pill({ label }: { label: string }) {
  return <View style={s.pill}><Text style={{ fontFamily: fonts.bodySemi, fontSize: type.sm, color: onPastel.ink }}>{label}</Text></View>;
}

export const mmss = (s: number) => Math.floor(s / 60) + ':' + String(Math.max(0, s) % 60).padStart(2, '0');

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
  pill: { backgroundColor: '#FFFFFF', borderRadius: radius.pill, paddingHorizontal: space.md, minHeight: 30, justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.md },
  mascot: { width: 128, height: 128 },
  sheet: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.lg, paddingTop: space.sm },
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  modal: { maxHeight: '88%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: space.lg, paddingTop: space.lg },
  modalHead: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.md },
});
