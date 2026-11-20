import { Image } from 'expo-image';
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { LAYERS, MASCOT, type BodyMove, type Head, type MascotName, type Motion, type Part, type PartMove } from '@/data/images';
import type { ApiErrorKind } from '@/lib/api';
import { BETA } from '@/lib/beta';
import { FREE_PER_DAY } from '@/lib/quota';
import { useSettings } from '@/lib/settings';
import { fonts, onPastel, onTint, radius, space, touch, type, typeCook, vivid, wide } from '@/theme/tokens';

// จริงเมื่ออยู่ในการ์ดสีอ่อนตอนธีมมืด: พื้นการ์ดเข้มตามธีม ตัวอักษรกับปุ่มแบบ "pastel" จึงต้องเปลี่ยนตามธีมด้วย (การ์ดสีสด coral/navy สีคงที่ ไม่เข้าเงื่อนไขนี้)
const OnThemed = createContext(false);

// จริงในหน้าทำอาหาร: ตัวอักษรชุดใหญ่ (typeCook)
export const BigType = createContext(false);

type TextVariant = 'hero' | 'price' | 'title' | 'heading' | 'subheading' | 'body' | 'bodyBold' | 'small' | 'smallBold' | 'step';
const variants = (z: typeof type | typeof typeCook): Record<TextVariant, TextStyle> => ({
  // ตัวเลขเด่นของจอ (ราคาต่อมื้อ เวลาที่เหลือ จำนวนจานที่ทำแล้ว)
  hero: { fontFamily: fonts.bodyBold, fontSize: z.hero, lineHeight: z.hero * 1.2, fontVariant: ['tabular-nums'] },
  price: { fontFamily: fonts.bodyBold, fontSize: z.xl, lineHeight: z.xl * 1.35, fontVariant: ['tabular-nums'] },
  title: { fontFamily: fonts.heading, fontSize: z.xxl, lineHeight: z.xxl * 1.3 },
  heading: { fontFamily: fonts.heading, fontSize: z.xl, lineHeight: z.xl * 1.35 },
  subheading: { fontFamily: fonts.heading, fontSize: z.lg, lineHeight: z.lg * 1.4 },
  body: { fontFamily: fonts.body, fontSize: z.md, lineHeight: z.md * 1.6 },
  bodyBold: { fontFamily: fonts.bodySemi, fontSize: z.md, lineHeight: z.md * 1.6 },
  small: { fontFamily: fonts.body, fontSize: z.sm, lineHeight: z.sm * 1.5 },
  smallBold: { fontFamily: fonts.bodySemi, fontSize: z.sm, lineHeight: z.sm * 1.5 },
  // คำสั่งในหน้าทำอาหาร อ่านได้จากระยะหนึ่งช่วงแขน (แผน: ไม่ต่ำกว่า 18)
  step: { fontFamily: fonts.bodySemi, fontSize: z.xl, lineHeight: z.xl * 1.55 },
});
const VARIANT = variants(type), VARIANT_COOK = variants(typeCook);

/** ข้อความทั้งแอป ขยายตามขนาดตัวอักษรของเครื่องอัตโนมัติ; tone 'pastel' ใช้บนพื้นสีอ่อนที่ไม่เปลี่ยนตามธีม */
export function T({ v = 'body', tone = 'ink', style, children, ...rest }: { v?: TextVariant; tone?: 'ink' | 'muted' | 'success' | 'warn' | 'pastel' | 'pastelMuted' | 'onPrimary' | 'onNavy' | 'onNavyMuted' | 'yellow'; style?: StyleProp<TextStyle>; children: ReactNode } & Omit<TextProps, 'style' | 'children'>) {
  const { colors } = useSettings();
  const themed = useContext(OnThemed);
  const color = { ink: colors.ink, muted: colors.muted, success: colors.success, warn: colors.warn, pastel: themed ? colors.ink : onPastel.ink, pastelMuted: themed ? colors.muted : onPastel.muted, onPrimary: colors.onPrimary, onNavy: '#FFFFFF', onNavyMuted: vivid.onNavyMuted, yellow: vivid.yellow }[tone];
  return <Text style={[(useContext(BigType) ? VARIANT_COOK : VARIANT)[v], { color }, style]} {...rest}>{children}</Text>;
}

export function Button({ label, onPress, kind = 'primary', icon, size = 'md', disabled, style }: { label: string; onPress: () => void; kind?: 'primary' | 'secondary' | 'accent' | 'onPastel' | 'onPastelLight'; icon?: IconName; size?: 'md' | 'cook'; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors } = useSettings();
  // onPastel*: ปุ่มที่วางบนการ์ดพาสเทล สีคงที่ทั้งสองธีมเพื่อให้คอนทราสต์ผ่านเสมอ
  const themed = useContext(OnThemed), big = useContext(BigType);
  const bg = { primary: colors.primary, secondary: colors.surfaceSoft, accent: colors.accent, onPastel: themed ? colors.primary : onPastel.ink, onPastelLight: themed ? colors.surface : '#FFFFFF' }[kind];
  const fg = { primary: colors.onPrimary, secondary: colors.ink, accent: colors.onAccent, onPastel: themed ? colors.onPrimary : '#FFFFFF', onPastelLight: themed ? colors.ink : onPastel.ink }[kind];
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.button, { backgroundColor: bg, minHeight: size === 'cook' ? touch.cook : 48, opacity: disabled ? 0.45 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}>
      {icon && <Icon name={icon} color={fg} />}
      <Text style={{ fontFamily: fonts.heading, fontSize: size === 'cook' ? typeCook.lg : big ? typeCook.md : type.md, color: fg }}>{label}</Text>
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
  const big = useContext(BigType);
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
      style={({ pressed }) => [s.chip, { backgroundColor: selected ? colors.primary : colors.surfaceSoft, transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
      <Text style={{ fontFamily: fonts.bodySemi, fontSize: big ? typeCook.md : type.md, color: selected ? colors.onPrimary : colors.ink }}>{label}</Text>
    </Pressable>
  );
}

/** การ์ด: soft = พื้นรองตามธีม; note/ai/done/danger = สีอ่อนมากตามความหมาย (ธีมมืดเป็นสีเข้มอมสีเดียวกัน); accent/mint = พื้นรองสำหรับตัวเลขและสรุป;
 *  navy/coral = การ์ดเด่นสีสด จอละใบเดียว (navy ใช้ตัวอักษรขาว) */
export function Card({ tone = 'soft', children, style, onPress, label }: { tone?: 'soft' | 'note' | 'ai' | 'done' | 'danger' | 'accent' | 'surface' | 'navy' | 'coral' | 'mint'; children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; label?: string }) {
  const { colors, isDark } = useSettings();
  const bg = { soft: colors.surfaceSoft, surface: colors.surface, note: colors.note, ai: colors.ai, done: colors.done, danger: colors.danger, accent: colors.surfaceSoft, navy: vivid.navy, coral: vivid.coral, mint: colors.surfaceSoft }[tone];
  const themed = isDark && tone !== 'navy' && tone !== 'coral';
  if (!onPress) return <OnThemed.Provider value={themed}><View style={[s.card, { backgroundColor: bg }, style]}>{children}</View></OnThemed.Provider>;
  return (
    <OnThemed.Provider value={themed}>
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.card, { backgroundColor: bg, transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
      {children}
    </Pressable>
    </OnThemed.Provider>
  );
}

type Ease = 'sin' | 'up' | 'down';
const EASE = { sin: Easing.inOut(Easing.sin), up: Easing.out(Easing.quad), down: Easing.in(Easing.quad) };
// แต่ละจังหวะ: [ค่าปลายทาง, เวลา (ms), การเร่ง] แล้วพัก rest ก่อนวนใหม่
const MOVES: Record<Motion | PartMove | BodyMove | 'blink' | 'flick' | 'rise', { steps: [number, number, Ease][]; rest: number }> = {
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
  // เดิน: ตัวเด้งลงทุกครั้งที่เท้าแตะพื้น (สองครั้งต่อรอบก้าว) แขนแกว่งสวนกับขา รอบเท่ากับ stepL/stepR
  bounce: { steps: [[-1, 200, 'up'], [0, 200, 'down']], rest: 0 },
  armL: { steps: [[1, 400, 'sin'], [-1, 400, 'sin']], rest: 0 },
  armR: { steps: [[-1, 400, 'sin'], [1, 400, 'sin']], rest: 0 },
  // คนกระทะ: กวาดไปกลับ บางรอบหยุดดูครู่หนึ่ง
  stir: { steps: [[1, 420, 'sin'], [-1, 520, 'sin'], [1, 480, 'sin'], [0, 300, 'sin']], rest: 500 },
  // สับ: ลงเร็วสามที แล้วพักเลื่อนของ
  chop: { steps: [[1, 90, 'down'], [0, 130, 'up'], [1, 90, 'down'], [0, 130, 'up'], [1, 90, 'down'], [0, 200, 'up']], rest: 650 },
  // ครัวจำลอง: เปลวไฟพลิ้ว ไอร้อนลอยขึ้นแล้วจางหายเริ่มใหม่
  flick: { steps: [[1, 120, 'sin'], [0.3, 140, 'sin'], [0.8, 110, 'sin'], [0, 130, 'sin']], rest: 0 },
  rise: { steps: [[1, 1700, 'sin'], [0, 1, 'sin']], rest: 250 },
  // ถูล้าง: ไปมาเร็วๆ
  scrub: { steps: [[1, 220, 'sin'], [-1, 260, 'sin'], [1, 240, 'sin'], [0, 200, 'sin']], rest: 260 },
};
/** วนการขยับชุดหนึ่งไปเรื่อยๆ หลังหน่วง delay หยุดนิ่งถ้าเครื่องตั้งค่าลดการเคลื่อนไหว
 *  คนจริงไม่ขยับเป๊ะเท่ากันทุกรอบ: แต่ละตัวมีจังหวะเร็วช้าของตัวเอง และช่วงพักสุ่มสั้นยาวทุกรอบ
 *  tempo ส่งมาจากตัวละคร ให้ทุกส่วนของตัวเดียวกันใช้จังหวะเดียวกัน แขนขาจึงยังเข้าจังหวะกัน */
export function useMove(move: keyof typeof MOVES, delay = 0, tempo = 1) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let run: Animated.CompositeAnimation | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let alive = true;
    const { steps, rest } = MOVES[move];
    if (!steps.length) return;
    const frames = steps.map(([toValue, duration, ease]) => Animated.timing(v, { toValue, duration: duration * tempo, easing: EASE[ease], useNativeDriver: Platform.OS !== 'web' }));
    const once = () => {
      if (!alive) return;
      run = Animated.sequence(frames);
      run.start(({ finished }) => { if (finished && alive) timer = setTimeout(once, rest * tempo * (0.6 + Math.random() * 0.8)); });
    };
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => { if (!reduce && alive) timer = setTimeout(once, delay); }).catch(() => {});
    return () => { alive = false; clearTimeout(timer); run?.stop(); };
  }, [v, move, delay, tempo]);
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
function Limb({ part, width, tempo, children }: { part: Part; width: number; tempo: number; children?: ReactNode }) {
  const v = useMove(part.move, 0, tempo);
  const deg = part.deg ?? 0;
  const transform = [
    { translateY: Animated.multiply(v, width * (part.lift ?? 0)) },
    { translateX: Animated.multiply(v, width * (part.slide ?? (part.move === 'sip' ? -0.02 : 0))) },
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
function HeadLayer({ head, width, blinkDelay, tempo }: { head: Head; width: number; blinkDelay: number; tempo: number }) {
  const eyes = useMove('blink', blinkDelay, tempo);
  return (
    <Limb part={{ source: head.source, move: head.move, lift: head.lift, deg: head.deg, pivot: head.neck }} width={width} tempo={tempo}>
      <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: `${head.eye[0] * 100}% ${head.eye[1] * 100}%`, transform: [{ scaleY: eyes.interpolate({ inputRange: [0, 1], outputRange: [1, 0.12] }) }] }]}>
        <Image source={head.eyes} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
      </Animated.View>
    </Limb>
  );
}

/** ตัวละครหนึ่งท่า ภาพจัตุรัส: ทั้งตัวขยับไปด้วยกันก่อน (หายใจ โยกตัว) แล้วแขนขาและของในมือขยับรอบข้อต่อของตัวเอง จึงดูเป็นร่างเดียว */
export function Mascot({ name, size, still }: { name: MascotName; size: number | '100%'; still?: boolean }) {
  // still = ภาพนิ่ง จอหนึ่งให้ขยับได้แค่ตัวเอกหรือจังหวะที่มีความหมาย (ครบเวลา ได้คะแนน กำลังรอคำตอบ) แอปจึงไม่ดูเป็นเกม
  if (still) return <Image source={MASCOT[name]} style={{ width: size, aspectRatio: 1 }} contentFit="contain" accessible={false} />;
  return <Moving name={name} size={size} />;
}
function Moving({ name, size }: { name: MascotName; size: number | '100%' }) {
  const [width, setWidth] = useState(typeof size === 'number' ? size : 0);
  const [tempo] = useState(() => 0.9 + Math.random() * 0.22); // แต่ละตัวเร็วช้าไม่เท่ากัน
  const { body, head, front, parts, sway } = LAYERS[name];
  const v = useMove(sway ?? 'still', 0, tempo);
  const whole = sway === 'bounce' ? [{ translateY: Animated.multiply(v, width * 0.014) }]
    : sway === 'breathe' ? [{ scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.022] }) }, { scaleX: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.99] }) }]
    : sway === 'squash' ? [{ scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }]
    : sway ? [{ rotate: v.interpolate({ inputRange: [-1, 1], outputRange: sway === 'waddle' ? ['-3deg', '3deg'] : ['-2deg', '2deg'] }) }]
    : [];
  return (
    <Animated.View style={{ width: size, aspectRatio: 1, transformOrigin: 'bottom', transform: whole }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {parts.filter((p) => p.behind).map((p, k) => <Limb key={k} part={p} width={width} tempo={tempo} />)}
      <Image source={body} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
      {/* กะพริบตาไม่พร้อมกันทุกตัว: หน่วงต่างกันตามชื่อท่า */}
      <HeadLayer head={head} width={width} blinkDelay={name.length * 430} tempo={tempo} />
      {front !== undefined && <Image source={front} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />}
      {parts.filter((p) => !p.behind).map((p, k) => <Limb key={k} part={p} width={width} tempo={tempo} />)}
    </Animated.View>
  );
}

/** ตัวละครที่เปลี่ยนท่าได้ (เชฟในครัวจำลอง): ท่าใหม่ค่อยๆ ขึ้นแทนพร้อมย่อตัวนิดหนึ่ง เหมือนคนขยับเปลี่ยนท่า ไม่กระตุกจากภาพหนึ่งไปอีกภาพ */
export function Actor({ name, size }: { name: MascotName; size: number | '100%' }) {
  const [v] = useState(() => new Animated.Value(1));
  useEffect(() => {
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }).start();
  }, [v, name]);
  return (
    <Animated.View style={{ width: size, opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }), transformOrigin: 'bottom',
      transform: [{ scaleY: v.interpolate({ inputRange: [0, 1], outputRange: [0.93, 1] }) }, { scaleX: v.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1] }) }] }}>
      <Mascot key={name} name={name} size={size} />
    </Animated.View>
  );
}

/** หัวหน้าจอพร้อมมาสคอต พื้นสีสดประจำหน้า แล้วต่อด้วยแผ่นเนื้อหาสีพื้น */
export function Screen({ tint, title, subtitle, lead, onBack, backLabel, right, children, footer }: { tint: string; title: string; subtitle?: string; lead?: MascotName; onBack?: () => void; backLabel?: string; right?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { colors, isDark } = useSettings();
  const insets = useSafeAreaInsets();
  const head = (
    <View style={[s.header, wide, { paddingTop: insets.top + space.md }]}>
      <View style={{ flex: 1, gap: space.xs }}>
        {onBack && <View style={{ marginBottom: space.sm }}><IconButton icon="back" label={backLabel ?? ''} onPress={onBack} onPastelBg /></View>}
        <T v="title" style={isDark ? undefined : { color: onTint(tint) }} accessibilityRole="header">{title}</T>
        {subtitle && <T v="smallBold" tone="muted" style={isDark ? undefined : { color: onTint(tint) }}>{subtitle}</T>}
      </View>
      {right}
      {/* ตัวละครตัวเดียวบนสีเรียบ ไม่มีฉากหลัง: สีของจอกับตัวละครพอแล้ว ที่เหลือให้เนื้อหา */}
      {lead && <View style={{ marginBottom: -space.sm }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Mascot name={lead} size={104} /></View>}
    </View>
  );
  const content = { padding: space.lg, gap: space.md, paddingBottom: footer ? 120 : space.xxl };
  const foot = footer && <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, space.md), backgroundColor: colors.bg }]}><View style={[wide, { paddingHorizontal: space.lg }]}>{footer}</View></View>;
  // หน้าแท็บ (มีตัวละคร): หัวจอเลื่อนขึ้นไปพร้อมเนื้อหา ไม่กินที่ของรายการ
  if (lead && !onBack) return (
    <View style={{ flex: 1, backgroundColor: tint }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {head}
        <View style={[s.sheet, { overflow: 'visible', backgroundColor: colors.bg }]}>
          <View style={[content, wide]}>{children}</View>
          {/* ปิดสีหัวจอที่จะโผล่ตอนเลื่อนเกินด้านล่าง */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: '100%', height: 800, backgroundColor: colors.bg }} />
        </View>
      </ScrollView>
      {foot}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: tint }}>
      {head}
      <View style={[s.sheet, { backgroundColor: colors.bg }]}>
        <ScrollView contentContainerStyle={[content, wide]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {foot}
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
        <View style={[s.modalHead, wide]}>
          <T v="heading" style={{ flex: 1 }} accessibilityRole="header">{title}</T>
          <Button label={closeLabel} kind="secondary" onPress={onClose} />
        </View>
        <ScrollView contentContainerStyle={[wide, { gap: space.sm, paddingBottom: space.lg }]}>{children}</ScrollView>
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
          <T v="subheading" tone={kind === 'offline' ? 'pastel' : 'warn'}>{title}</T>
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
  header: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.md },
  sheet: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: space.sm },
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  modal: { maxHeight: '88%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: space.lg, paddingTop: space.lg },
  modalHead: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.md },
});
