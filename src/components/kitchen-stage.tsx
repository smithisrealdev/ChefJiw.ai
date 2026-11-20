import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { Actor, T, useMove } from '@/components/ui';
import { IMG } from '@/data/images';
import { actsAt, decoysFor, FOOD_NAME, nextAct, shownStage, stageAt, type Act, type Food, type Side, type Stage, type Station } from '@/data/kitchen';
import type { Heat, Recipe } from '@/data/recipes';
import { useSettings } from '@/lib/settings';

// ครัวยาว 1200 x 320 หน่วย (ตรงกับ kitchen.png ที่วาดใน assets/images/chef/src/draw.py) ตอนเลือกว่าจะไปไหนเห็นทั้งครัว พอเดินถึงกล้องซูมเข้าตามเชฟ
const WORLD = 1200, HEIGHT = 320, FLOOR = 296;
const CHEF = 230, FEET = 0.956; // ขนาดภาพเชฟ และตำแหน่งเท้าในภาพ (สัดส่วนจากบน)
// จุดที่เชฟยืนในแต่ละที่ มือขวาของท่าทำงานยื่นไปทางขวาราวหนึ่งในสี่ของภาพ จึงยืนซ้ายของของที่ทำ ประตูอยู่นอกจอทางซ้าย
const SPOT: Record<Station | 'door', number> = { door: -120, fridge: 240, sink: 368, board: 620, stove: 836 };
// พื้นที่แตะของแต่ละจุดตอนเลือกว่าจะเดินไปไหน (กลาง กว้าง สูง)
const AREA: Record<Station, readonly [number, number, number, number]> = { fridge: [106, 170, 140, 256], sink: [418, 230, 200, 90], board: [670, 230, 200, 90], stove: [924, 236, 236, 110] };
const SPEED = 330; // หน่วยต่อวินาที
const native = Platform.OS !== 'web';

/** ของที่ต้องแตะของขั้นนี้ ใช้ทั้งในครัวและตอนกดไปขั้นต่อไป (ข้ามโดยแตะไม่ครบจะถูกหักคะแนน) */
export const kitchenActs = (r: Recipe, i: number) => actsAt(r.id, r.steps, i, pickables(r).map((g) => g.id));
export type Taps = { step: number; n: number[] };

/** ครัวจำลองของหน้าทำอาหาร (เหมือนต้นแบบ): แตะจุดในครัวให้เชฟเดินไป แล้วแตะหยิบ หมุนไฟ ใส่ของ คน จัดจาน ทีละอย่าง
 *  onMiss = แตะผิด (ของหลอก เดินผิดที่) onStir = แตะคนในขั้นที่มีจับเวลา ให้เริ่มจับเวลาของขั้นนั้น */
export function KitchenStage({ r, i, taps, setTaps, onMiss, onStir }: { r: Recipe; i: number; taps: Taps; setTaps: (f: (prev: Taps) => Taps) => void; onMiss: () => void; onStir: () => void }) {
  const { height: screenH } = useWindowDimensions();
  const H = Math.round(Math.min(250, Math.max(170, screenH * 0.27)));
  const k = H / HEIGHT;
  const [viewW, setViewW] = useState(0);
  const base = stageAt(r.id, r.steps, i);
  const pics = pickables(r);
  const acts = kitchenActs(r, i);
  const done = taps.step === i ? taps.n : [];
  const st = shownStage(r.id, r.steps, i, acts, done);

  // เชฟอยู่ที่ไหน: เปิดหน้ามายังอยู่นอกครัว ต้องแตะจุดของขั้นนั้นก่อน เชฟถึงเดินไป
  // กลับมาทำต่อกลางจาน เชฟยืนรออยู่ที่จุดของขั้นก่อนหน้า
  const [chefAt, setChefAt] = useState<Station | 'door'>(() => (i > 0 ? stageAt(r.id, r.steps, i - 1).at : 'door'));
  const arrived = chefAt === base.at;
  const [note, setNote] = useState<{ step: number; text: string } | null>(null);
  const warn = (text: string) => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}); setNote({ step: i, text }); onMiss(); };
  const tap = (n: number) => {
    Haptics.selectionAsync().catch(() => {});
    setNote(null);
    if (acts[n].kind === 'stir') onStir();
    setTaps((prev) => { const list = prev.step === i ? [...prev.n] : []; list[n] = (list[n] ?? 0) + 1; return { step: i, n: list }; });
  };

  const [x] = useState(() => new Animated.Value(SPOT[chefAt]));
  const [zoom] = useState(() => new Animated.Value(arrived ? 1 : 0)); // 0 = ถอยให้เห็นทั้งเชฟและจุดที่ต้องไป 1 = ซูมตามเชฟ
  const [walking, setWalking] = useState<0 | 1 | -1>(0);
  const target = SPOT[chefAt];
  useEffect(() => {
    let alive = true;
    let anim: Animated.CompositeAnimation | undefined;
    // อ่านตำแหน่งปัจจุบันจากค่าที่กำลังเคลื่อนอยู่ ถ้าแตะที่ใหม่ระหว่างเดิน เชฟเลี้ยวไปที่ใหม่ได้ทันที
    const from = (x as unknown as { __getValue: () => number }).__getValue();
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!alive) return;
      const d = target - from;
      if (reduce || Math.abs(d) < 4) { x.setValue(target); setWalking(0); return; }
      setWalking(d > 0 ? 1 : -1);
      anim = Animated.timing(x, { toValue: target, duration: Math.min(2400, Math.max(500, (Math.abs(d) / SPEED) * 1000)), easing: Easing.inOut(Easing.sin), useNativeDriver: native });
      anim.start(({ finished }) => { if (finished && alive) setWalking(0); });
    }).catch(() => { x.setValue(target); });
    return () => { alive = false; anim?.stop(); };
  }, [x, target]);
  useEffect(() => {
    let anim: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) { zoom.setValue(arrived ? 1 : 0); return; }
      anim = Animated.timing(zoom, { toValue: arrived ? 1 : 0, duration: arrived ? 900 : 450, easing: Easing.inOut(Easing.quad), useNativeDriver: native });
      anim.start();
    }).catch(() => zoom.setValue(arrived ? 1 : 0));
    return () => anim?.stop();
  }, [zoom, arrived]);

  // กล้องตอนซูม: เชฟอยู่กลางจอค่อนซ้าย (ของที่ทำอยู่ทางขวาของเชฟ) แต่ไม่เลยขอบครัว ตอนเห็นทั้งครัว: ย่อทั้งครัวให้พอดีความกว้างจอ วางชิดล่าง
  const x0 = viewW / (2 * k) - 60, x1 = x0 + WORLD - viewW / k;
  const cam = x1 > x0 ? x.interpolate({ inputRange: [x0, x1], outputRange: [0, viewW - WORLD * k], extrapolate: 'clamp' }) : 0;
  // ตอนเลือกที่: ถอยกล้องพอให้เห็นเชฟกับจุดที่ต้องไป ไม่ย่อทั้งครัวจนเหลือผนังว่าง วางชิดล่าง
  const fit = viewW ? Math.min(1, viewW / (WORLD * k)) : 1;
  const [cx, , w] = AREA[base.at], me = SPOT[chefAt];
  const left = Math.min(me - 70, cx - w / 2) - 30, right = Math.max(me + 90, cx + w / 2) + 30;
  const out = viewW ? Math.max(fit, Math.min(1, viewW / ((right - left) * k))) : 1;
  const outX = Math.max(viewW - WORLD * k * out, Math.min(0, viewW / 2 - ((left + right) / 2) * k * out));
  const world = [
    { translateX: Animated.add(Animated.multiply(zoom, cam), zoom.interpolate({ inputRange: [0, 1], outputRange: [outX, 0] })) },
    { translateY: zoom.interpolate({ inputRange: [0, 1], outputRange: [H * (1 - out), 0] }) },
    { scale: zoom.interpolate({ inputRange: [0, 1], outputRange: [out, 1] }) },
  ];
  const pose = walking ? 'walk' : arrived ? st.pose : 'think';
  const tapDone = acts.findIndex((a) => a.kind === 'tap');

  return (
    <View style={{ height: H, overflow: 'hidden', backgroundColor: '#FFE9A8' }} onLayout={(e) => setViewW(e.nativeEvent.layout.width)}>
      <Animated.View style={{ width: WORLD * k, height: H, transformOrigin: 'left top', transform: world }}>
        {/* ภาพประกอบทั้งหมดไม่รับการแตะและโปรแกรมอ่านจอข้ามไป สิ่งที่แตะได้อยู่ใน Hotspots */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Image source={require('@/assets/images/chef/kitchen.png')} style={StyleSheet.absoluteFill} contentFit="fill" accessible={false} />
        <Fridge open={arrived && st.at === 'fridge'} k={k} />
        <Sink st={st} k={k} running={arrived && (tapDone < 0 || (done[tapDone] ?? 0) > 0)} />
        <Board items={st.board} k={k} />
        <SidePlate side={st.side} k={k} r={r} />
        {/* เชฟ: ยืนบนพื้น หันตามทางที่เดิน */}
        <Animated.View style={{ position: 'absolute', left: 0, top: (FLOOR - FEET * CHEF) * k, width: CHEF * k, transform: [{ translateX: Animated.add(Animated.multiply(x, k), -(CHEF * k) / 2) }] }}>
          <View style={{ transform: [{ scaleX: walking === -1 ? -1 : 1 }] }}>
            <Actor name={pose} size={CHEF * k} />
          </View>
        </Animated.View>
        {/* กระทะอยู่หน้ามือเชฟ ตะหลิวจึงดูจุ่มลงไปในกระทะ */}
        <Stove st={st} k={k} />
        </View>
        {arrived
          ? <Hotspots acts={acts} done={done} st={st} k={k} pics={pics} onTap={tap} onDecoy={(name) => warn(name)} />
          : <Stations goal={base.at} k={k} scale={k * out} onGo={(s) => { if (s === base.at) { setNote(null); setChefAt(s); } else warn(''); }} />}
      </Animated.View>
      <Guide acts={arrived ? acts : []} done={done} goal={base.heat} go={arrived ? null : base.at} note={note?.step === i ? note.text : null} />
    </View>
  );
}

/** วัตถุดิบที่มีภาพให้แตะหยิบในตู้เย็น: ใช้ img ของวัตถุดิบ ถ้าไม่มีลองชื่อ id ที่ตรงกับภาพที่มีอยู่ เว้นสองช่องไว้ให้ของหลอก */
function pickables(r: Recipe) {
  return r.ingredients.map((g) => ({ id: g.id, name: g.name, src: g.img ? IMG[g.img] : (IMG as Record<string, number>)[g.id], img: g.img ?? g.id }))
    .filter((g) => g.src).slice(0, 4);
}
type Pic = ReturnType<typeof pickables>[number];

// ตำแหน่งของที่แตะได้ในครัว (กลางชิ้น กว้าง สูง) ชั้นตู้เย็นมีหกช่อง ของจริงกับของหลอกสลับช่องกัน
const SLOTS: [number, number][] = [[78, 112], [136, 112], [78, 180], [136, 180], [78, 232], [136, 232]];
const PICK_SLOT = [0, 3, 4, 1], DECOY_SLOT = [2, 5];
const SPOTS = { knob: [1020, 268, 30, 30], board: [682, 220, 112, 40], tap: [456, 200, 40, 40], source: [1014, 214, 44, 34], side: [772, 216, 56, 40] } as const;
const panSpot = (pot: boolean) => [930, pot ? 200 : 214, 124, pot ? 76 : 52] as const;
const FOOD_COLOR: Partial<Record<Food, string>> = { oil: '#FFE07A', egg: '#FFFFFF', beaten: '#FFD34D', bits: '#FF5A4A', mince: '#9A5B3C', sauce: '#6B3A22', leaves: '#2FB383', beans: '#5DBB63',
  cream: '#FFF8E8', paste: '#E8572F', curry: '#F4F1E4', chicken: '#F7D9B5', veg: '#7BC96F', water: '#BFE6FF', eggs: '#F3E6D3', caramel: '#C8782E', stew: '#7A4526', pork: '#B5683F' };

/** ป้ายมุมซ้ายบน: ต้องแตะอะไร หรือคำเตือนเมื่อแตะผิด */
function Guide({ acts, done, goal, go, note }: { acts: Act[]; done: number[]; goal: Heat; go: Station | null; note: string | null }) {
  const { t, pick } = useSettings();
  if (!go && !acts.length && note === null) return null;
  const c = nextAct(acts, done), a = acts[c], n = done[c] ?? 0;
  const food = a?.food && FOOD_NAME[a.food] ? pick(FOOD_NAME[a.food]!) : '';
  const picks = acts.filter((x) => x.kind === 'pick').length;
  const text = note !== null ? (note ? t('kitchen.notNeeded', { x: note }) : t('kitchen.notThere'))
    : go ? t('kitchen.go', { x: t(`kitchen.at.${go}`) })
    : c < 0 ? t('kitchen.done')
    : a.kind === 'pick' ? t('kitchen.pick', { n: acts.filter((x, j) => x.kind === 'pick' && (done[j] ?? 0) > 0).length, total: picks })
    : a.kind === 'heat' ? t('kitchen.heat', { x: t(`cook.heat${goal}`) })
    : a.kind === 'chop' || a.kind === 'mix' ? t(`kitchen.${a.kind}`, { n, total: a.taps })
    : t(`kitchen.${a.kind}`, { x: food });
  const bg = note !== null ? '#FFD6CC' : !go && c < 0 ? '#C9F2CF' : '#FFFFFF';
  return (
    <View accessibilityLiveRegion="polite" style={{ position: 'absolute', left: 8, top: 8, maxWidth: '80%', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: bg }}>
      <T v="smallBold" tone="pastel">{text}</T>
    </View>
  );
}

/** วงสีเหลืองกะพริบรอบของที่ต้องแตะ ความหนาเส้นชดเชยการย่อของครัว */
function Ring({ round, scale = 1, radius }: { round?: boolean; scale?: number; radius: number }) {
  const glow = useMove('twinkle');
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: round ? 999 : radius, borderWidth: 3 / scale, borderColor: '#24212B', backgroundColor: 'rgba(255,230,109,0.35)',
    opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] }) }]} />;
}

/** ปุ่มแตะในพิกัดของครัว พื้นที่แตะอย่างน้อย 44 จุดแม้ภาพจะเล็ก (scale = ขนาดที่เห็นจริงต่อหน่วยครัว) */
function Spot({ box: [cx, cy, w, h], k, scale, label, onPress, ring, round, children }: { box: readonly [number, number, number, number]; k: number; scale: number; label: string; onPress: () => void; ring: boolean; round?: boolean; children?: ReactNode }) {
  const slopX = Math.max(0, (44 - w * scale) / 2), slopY = Math.max(0, (44 - h * scale) / 2);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={{ left: slopX, right: slopX, top: slopY, bottom: slopY }}
      style={{ position: 'absolute', left: (cx - w / 2) * k, top: (cy - h / 2) * k, width: w * k, height: h * k, alignItems: 'center', justifyContent: 'center' }}>
      {ring && <Ring round={round} scale={scale / k} radius={10 * k} />}
      {children}
    </Pressable>
  );
}

/** ตอนเลือกว่าจะไปไหน: ทุกจุดในครัวแตะได้ จุดของขั้นนี้มีวงกะพริบ แตะผิดที่มีคำเตือน */
function Stations({ goal, k, scale, onGo }: { goal: Station; k: number; scale: number; onGo: (s: Station) => void }) {
  const { t } = useSettings();
  return <>{(Object.keys(AREA) as Station[]).map((s) => (
    <Spot key={s} box={AREA[s]} k={k} scale={scale} label={t('kitchen.walkTo', { x: t(`kitchen.at.${s}`) })} onPress={() => onGo(s)} ring={s === goal} />
  ))}</>;
}

/** ของที่แตะได้หลังเดินถึง: ของที่ต้องแตะตอนนี้มีวงกะพริบ ตู้เย็นมีของหลอกปนอยู่สองอย่าง */
function Hotspots({ acts, done, st, k, pics, onTap, onDecoy }: { acts: Act[]; done: number[]; st: Stage; k: number; pics: Pic[]; onTap: (n: number) => void; onDecoy: (name: string) => void }) {
  const { t, pick } = useSettings();
  const bob = useMove('puff');
  const [tried, setTried] = useState<string[]>([]);
  const c = nextAct(acts, done);
  if (c < 0) return null;
  const a = acts[c];
  const bubble = (src: number) => (
    <View style={{ width: 40 * k, height: 40 * k, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <Image source={src} style={{ width: 32 * k, height: 32 * k }} contentFit="contain" accessible={false} />
    </View>
  );
  const float = (n: number, child: ReactNode) => <Animated.View key={n} style={{ position: 'absolute', left: 0, top: 0, transform: [{ translateY: Animated.multiply(bob, (n % 2 ? 3 : -3) * k) }] }}>{child}</Animated.View>;
  if (a.kind === 'pick') {
    const decoys = decoysFor(pics.map((g) => g.img));
    return <>
      {acts.map((x, n) => {
        if (x.kind !== 'pick' || (done[n] ?? 0) > 0) return null;
        const g = pics.find((p) => p.id === x.item)!, [cx, cy] = SLOTS[PICK_SLOT[n] ?? n];
        return float(n, <Spot box={[cx, cy, 46, 46]} k={k} scale={k} label={t('kitchen.take', { x: pick(g.name) })} onPress={() => onTap(n)} ring round>{bubble(g.src)}</Spot>);
      })}
      {decoys.map((d, n) => {
        const [cx, cy] = SLOTS[DECOY_SLOT[n]];
        return float(n + 7, <Spot box={[cx, cy, 46, 46]} k={k} scale={k} label={t('kitchen.take', { x: pick(d.name) })} ring={!tried.includes(d.img)} round
          onPress={() => { setTried([...tried, d.img]); onDecoy(pick(d.name)); }}>{bubble(IMG[d.img])}</Spot>);
      })}
    </>;
  }
  const go = (box: readonly [number, number, number, number], label: string, child?: ReactNode, round?: boolean) =>
    <Spot box={box} k={k} scale={k} label={label} onPress={() => onTap(c)} ring round={round}>{child}</Spot>;
  if (a.kind === 'heat') return go(SPOTS.knob, t('kitchen.knob', { x: t(`cook.heat${st.heat}`) }),
    <View style={{ width: 22 * k, height: 22 * k, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', transform: [{ rotate: `${-90 + st.heat * 60}deg` }] }}>
      <View style={{ width: 3, height: 9 * k, backgroundColor: '#24212B', borderRadius: 2 }} />
    </View>, true);
  if (a.kind === 'chop' || a.kind === 'mix') return go(SPOTS.board, t(`kitchen.${a.kind}`, { n: done[c] ?? 0, total: a.taps }));
  if (a.kind === 'tap') return go(SPOTS.tap, t('kitchen.tap'), undefined, true);
  if (a.kind === 'plate' || a.kind === 'box') return go(SPOTS.side, t(`kitchen.${a.kind}`));
  if (a.kind === 'add') return go(SPOTS.source, t('kitchen.add', { x: a.food && FOOD_NAME[a.food] ? pick(FOOD_NAME[a.food]!) : '' }),
    <Svg width={40 * k} height={30 * k} viewBox="0 0 40 30">
      <Ellipse cx={20} cy={13} rx={14} ry={7} fill={FOOD_COLOR[a.food!] ?? '#FFFFFF'} />
      {a.food === 'egg' && <Circle cx={20} cy={11} r={4} fill="#FFB020" />}
      <Path d="M3 12 H37 Q35 28 20 28 Q5 28 3 12 Z" fill="#FFFFFF" stroke="#D8D1F0" strokeWidth={2} />
    </Svg>);
  return go(panSpot(st.pot), t(`kitchen.${a.kind}`, { x: '' }));
}

/** วางภาพ SVG ชิ้นหนึ่งในครัวตามพิกัดของครัว */
function Piece({ x, y, w, h, k, children, style }: { x: number; y: number; w: number; h: number; k: number; children: ReactNode; style?: object }) {
  return (
    <Animated.View style={[{ position: 'absolute', left: x * k, top: y * k, width: w * k, height: h * k }, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>{children}</Svg>
    </Animated.View>
  );
}

/** ตู้เย็นเปิดตอนหยิบของ ของที่ต้องหยิบอยู่ในชั้น (แตะได้ใน Hotspots) */
function Fridge({ open, k }: { open: boolean; k: number }) {
  if (!open) return null;
  return (
    <Piece x={10} y={40} w={168} h={258} k={k}>
      <Rect x={34} y={6} width={130} height={248} rx={16} fill="#EEF4FF" />
      <Path d="M36 98 H162 M36 166 H162 M36 218 H162" stroke="#D8D1F0" strokeWidth={5} />
      {/* ประตูเปิดออกไปทางซ้าย */}
      <Path d="M2 2 L32 10 V252 L2 258 Z" fill="#FFFFFF" stroke="#D8D1F0" strokeWidth={4} />
    </Piece>
  );
}

/** น้ำไหลจากก๊อกตอนล้าง พร้อมของที่ล้างอยู่ในอ่าง */
function Sink({ st, k, running }: { st: Stage; k: number; running: boolean }) {
  const flow = useMove('twinkle');
  if (st.at !== 'sink') return null;
  return (
    <>
      {running && <Piece x={430} y={200} w={20} h={42} k={k} style={{ opacity: flow.interpolate({ inputRange: [0, 1], outputRange: [0.95, 0.6] }) }}>
        <Rect x={6} y={0} width={8} height={42} rx={4} fill="#8FD3FF" />
      </Piece>}
      <Piece x={396} y={222} w={72} h={22} k={k}>
        {st.sink === 'leaves' && <Leaves cx={36} cy={14} />}
        <Ellipse cx={20} cy={18} rx={6} ry={3} fill="#FFFFFF" opacity={0.8} /><Ellipse cx={56} cy={16} rx={5} ry={2.5} fill="#FFFFFF" opacity={0.8} />
      </Piece>
    </>
  );
}

function Board({ items, k }: { items: Food[]; k: number }) {
  if (!items.length) return null;
  return <Piece x={620} y={196} w={130} h={40} k={k}>{items.map((f) => <G key={f}>{BOARD[f]}</G>)}</Piece>;
}

/** ของที่พักข้างเตา: ไข่ดาวที่ตักขึ้น จานที่ทำเสร็จ กล่องเก็บแกง */
function SidePlate({ side, k, r }: { side: Side | null; k: number; r: Recipe }) {
  const pop = useMove('puff');
  if (!side) return null;
  if (side === 'dish') return (
    <Animated.View style={{ position: 'absolute', left: 724 * k, top: 168 * k, width: 76 * k, height: 76 * k, transform: [{ translateY: Animated.multiply(pop, -4 * k) }] }}>
      <Image source={IMG[r.img]} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
    </Animated.View>
  );
  return (
    <Piece x={744} y={204} w={56} h={36} k={k}>
      {side === 'box' ? <>
        <Rect x={6} y={10} width={44} height={24} rx={6} fill="#CDEBFF" stroke="#8FB8E8" strokeWidth={3} />
        <Rect x={2} y={4} width={52} height={10} rx={5} fill="#7BC6F5" />
      </> : <>
        <Ellipse cx={28} cy={28} rx={26} ry={7} fill="#FFFFFF" stroke="#D8D1F0" strokeWidth={3} />
        {side === 'egg' ? <><Path d="M12 26 Q14 14 26 16 Q40 12 44 24 Q40 32 28 31 Q14 32 12 26 Z" fill="#FFFFFF" stroke="#EEE6D8" strokeWidth={2} /><Circle cx={28} cy={22} r={6} fill="#FFB020" /></>
          : <><Ellipse cx={20} cy={22} rx={7} ry={9} fill="#FFFDF5" /><Ellipse cx={34} cy={22} rx={7} ry={9} fill="#FFFDF5" /></>}
      </>}
    </Piece>
  );
}

/** เตา: เปลวไฟตามระดับไฟ กระทะหรือหม้อพร้อมของข้างใน ของกระดกตามจังหวะผัดตอนไฟเปิด ไอร้อนลอยขึ้น */
function Stove({ st, k }: { st: Stage; k: number }) {
  const flick = useMove('flick');
  const toss = useMove(st.pot ? 'puff' : 'toss');
  const s1 = useMove('rise'), s2 = useMove('rise', 600), s3 = useMove('rise', 1200);
  const hot = st.heat > 0, food = st.pan.length > 0;
  const rim = st.pot ? 186 : 206;
  return (
    <>
      {hot && (
        <Piece x={880} y={218} w={100} h={30} k={k} style={{ transformOrigin: 'bottom', transform: [{ scaleY: flick.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.15] }) }] }}>
          {Array.from({ length: st.heat + 1 }, (_, n) => {
            const fx = 50 + (n - st.heat / 2) * 18, fh = 10 + st.heat * 5;
            return <G key={n}><Path d={`M${fx - 7} 26 Q${fx} ${26 - fh * 2} ${fx + 7} 26 Z`} fill="#FF8A4C" /><Path d={`M${fx - 4} 26 Q${fx} ${26 - fh} ${fx + 4} 26 Z`} fill="#FFD84D" /></G>;
          })}
        </Piece>
      )}
      <Piece x={860} y={st.pot ? 150 : 170} w={140} h={st.pot ? 92 : 72} k={k}>
        {st.pot ? <>
          <Path d="M14 54 h10 M116 54 h10" stroke="#5E9FD8" strokeWidth={9} strokeLinecap="round" />
          <Rect x={22} y={36} width={96} height={52} rx={12} fill="#7BC6F5" />
          <Ellipse cx={70} cy={36} rx={50} ry={10} fill="#5E9FD8" />
          <Ellipse cx={70} cy={37} rx={44} ry={7} fill={food ? surface(st.pan) : '#3A5F86'} />
        </> : <>
          <Path d="M128 34 L140 28" stroke="#24212B" strokeWidth={8} strokeLinecap="round" />
          <Ellipse cx={70} cy={36} rx={62} ry={9} fill="#3A3644" />
        </>}
      </Piece>
      {food && (
        <Piece x={860} y={rim - 40} w={140} h={50} k={k} style={hot ? { transform: [{ translateY: Animated.multiply(toss, (st.pot ? 2 : 7) * k) }] } : undefined}>
          {st.pan.map((f) => <G key={f}>{(st.pot ? POT : WOK)[f]}</G>)}
        </Piece>
      )}
      {!st.pot && (
        <Piece x={860} y={196} w={140} h={44} k={k}>
          {/* ขอบหน้ากระทะบังของที่อยู่ต่ำกว่าขอบ */}
          <Path d="M8 10 Q70 58 132 10 Q70 22 8 10 Z" fill="#24212B" />
        </Piece>
      )}
      {hot && food && [s1, s2, s3].map((v, n) => (
        <Piece key={n} x={890 + n * 22} y={rim - 70} w={20} h={40} k={k}
          style={{ opacity: v.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.85, 0.5, 0] }), transform: [{ translateY: Animated.multiply(v, -26 * k) }] }}>
          <Path d="M10 38 q-8 -9 0 -18 q8 -9 0 -18" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" />
        </Piece>
      ))}
    </>
  );
}

/** สีผิวน้ำในหม้อ: ของเหลวชั้นบนสุดของรายการ */
function surface(pan: Food[]) {
  const liquid: Partial<Record<Food, string>> = { cream: '#FFF8E8', paste: '#E8572F', curry: '#A8D46A', water: '#BFE6FF', caramel: '#C8782E', stew: '#7A4526' };
  return pan.map((f) => liquid[f]).filter(Boolean).at(-1) ?? '#3A5F86';
}

const Leaves = ({ cx, cy }: { cx: number; cy: number }) => (
  <G>{[[-16, 0, -20], [-4, -4, 15], [8, 1, -10], [18, -3, 25], [0, 4, 0]].map(([dx, dy, a], n) => (
    <Ellipse key={n} cx={cx + dx} cy={cy + dy} rx={8} ry={4} fill={n % 2 ? '#4CC992' : '#2FB383'} transform={`rotate(${a} ${cx + dx} ${cy + dy})`} />))}</G>
);
const dots = (pts: [number, number][], r: number, colors: string[]) => pts.map(([x, y], n) => <Circle key={n} cx={x} cy={y} r={r} fill={colors[n % colors.length]} />);
const cubes = (pts: [number, number][], s: number, fill: string, edge: string) => pts.map(([x, y], n) => <Rect key={n} x={x - s / 2} y={y - s / 2} width={s} height={s} rx={2} fill={fill} stroke={edge} strokeWidth={1.5} />);

// ของในกระทะ: ผิวกระทะอยู่ที่ y≈44 ของชิ้นนี้ (ขอบกระทะ) กองนูนขึ้นเหนือขอบเล็กน้อย
const WOK: Partial<Record<Food, ReactNode>> = {
  oil: <Ellipse cx={70} cy={44} rx={48} ry={5} fill="#FFE07A" opacity={0.6} />,
  egg: <G><Path d="M44 44 Q46 30 64 33 Q86 28 94 40 Q90 50 70 49 Q48 51 44 44 Z" fill="#FFFFFF" /><Circle cx={70} cy={38} r={8} fill="#FFB020" /></G>,
  beaten: <Ellipse cx={70} cy={43} rx={50} ry={6} fill="#FFD34D" />,
  omelet: <G><Ellipse cx={70} cy={41} rx={46} ry={9} fill="#F2B13A" />{dots([[50, 37], [64, 34], [80, 36], [92, 40], [58, 43], [76, 42]], 5, ['#F7C95B', '#E59A2A'])}</G>,
  bits: <G>{dots([[46, 42], [56, 39], [64, 43], [74, 38], [84, 42], [94, 40], [60, 36], [88, 37]], 3, ['#FFF3DC', '#FF5A4A'])}</G>,
  mince: <G>{dots([[42, 43], [50, 39], [58, 42], [64, 36], [72, 40], [80, 35], [88, 41], [96, 43], [54, 34], [68, 32], [84, 31], [76, 44]], 5, ['#9A5B3C', '#7E4A30', '#B06A45'])}</G>,
  sauce: <G><Ellipse cx={70} cy={41} rx={44} ry={7} fill="#6B3A22" opacity={0.35} /><Ellipse cx={56} cy={36} rx={8} ry={2} fill="#FFFFFF" opacity={0.5} /></G>,
  leaves: <Leaves cx={72} cy={34} />,
  beans: <G>{[[44, 40, 20], [60, 36, -15], [76, 38, 10], [90, 40, -25], [66, 42, 30]].map(([x, y, a], n) => (
    <Rect key={n} x={x - 10} y={y - 2.5} width={20} height={5} rx={2.5} fill="#5DBB63" transform={`rotate(${a} ${x} ${y})`} />))}</G>,
  paste: <Ellipse cx={70} cy={42} rx={40} ry={6} fill="#E8572F" />,
};
// ของในหม้อ: ผิวน้ำอยู่ที่ y≈46 ของชิ้นนี้ ของลอยอยู่บนผิวน้ำ
const POT: Partial<Record<Food, ReactNode>> = {
  chicken: <G>{cubes([[52, 44], [70, 42], [86, 45]], 9, '#F7D9B5', '#E3B98D')}</G>,
  veg: <G>{dots([[60, 46], [80, 44], [94, 47]], 5, ['#7BC96F'])}{dots([[60, 46], [80, 44], [94, 47]], 2, ['#E8F7D8'])}</G>,
  eggs: <G><Ellipse cx={58} cy={44} rx={7} ry={5} fill="#F3E6D3" /><Ellipse cx={82} cy={45} rx={7} ry={5} fill="#F3E6D3" /></G>,
  pork: <G>{cubes([[50, 45], [66, 42], [90, 44]], 10, '#B5683F', '#8E4E2C')}</G>,
  bits: <G>{dots([[54, 44], [66, 46], [78, 43], [88, 46]], 3, ['#FFF3DC', '#2FB383'])}</G>,
  leaves: <Leaves cx={74} cy={44} />,
};
// ของบนเขียง: ผิวเขียงอยู่ที่ y≈34 ของชิ้นนี้
const BOARD: Partial<Record<Food, ReactNode>> = {
  bits: <G>{dots([[30, 32], [38, 30], [46, 33], [56, 31], [64, 33], [36, 34], [52, 34]], 3.5, ['#FFF3DC', '#FF5A4A'])}<Ellipse cx={92} cy={30} rx={9} ry={6} fill="#FFF3DC" /></G>,
  chicken: <G>{cubes([[30, 30], [42, 31], [54, 30], [36, 24], [48, 24]], 10, '#F7D9B5', '#E3B98D')}<Rect x={78} y={22} width={34} height={12} rx={6} fill="#F7D9B5" /></G>,
  veg: <G>{dots([[32, 29], [46, 30], [60, 29]], 7, ['#7BC96F'])}{dots([[32, 29], [46, 30], [60, 29]], 3, ['#E8F7D8'])}<Leaves cx={92} cy={30} /></G>,
  pork: <G>{cubes([[30, 29], [44, 30], [58, 29], [37, 21], [51, 21]], 12, '#E9A88A', '#C9805F')}</G>,
  beans: <G>{[24, 34, 44, 54, 64].map((x2, n) => <Rect key={n} x={x2} y={29 - (n % 2) * 3} width={8} height={4} rx={2} fill="#5DBB63" />)}<Rect x={80} y={27} width={36} height={5} rx={2.5} fill="#5DBB63" /></G>,
  mortar: <G><Path d="M40 16 H86 Q84 36 63 36 Q42 36 40 16 Z" fill="#9AA6BD" /><Ellipse cx={63} cy={16} rx={23} ry={4} fill="#6E7891" /><Rect x={70} y={-2} width={8} height={22} rx={4} fill="#C98B4E" transform="rotate(20 74 10)" /></G>,
  bowl: <G><Path d="M38 14 H90 Q88 36 64 36 Q40 36 38 14 Z" fill="#FFFFFF" stroke="#D8D1F0" strokeWidth={3} /><Ellipse cx={64} cy={15} rx={24} ry={4} fill="#FFD34D" /></G>,
};
