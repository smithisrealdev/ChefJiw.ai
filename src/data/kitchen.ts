// ครัวจำลองในหน้าทำอาหาร: แต่ละขั้นเชฟไปยืนที่ไหน และในกระทะ บนเขียง ข้างเตา มีอะไร
// ของในกระทะกับของข้างเตาค้างอยู่จนกว่าขั้นหลังจะเปลี่ยน (เช่น ไข่ดาวที่ตักขึ้นพักอยู่ข้างเตาจนจัดจาน) ของบนเขียงมีเฉพาะขั้นที่ทำบนเขียง
import type { MascotName } from '@/data/images';
import type { Heat, Step } from '@/data/recipes';
import type { L } from '@/lib/i18n';

export type Station = 'fridge' | 'sink' | 'board' | 'stove';
export type Food =
  | 'oil' | 'egg' | 'beaten' | 'omelet' | 'bits' | 'mince' | 'sauce' | 'leaves' | 'beans'
  | 'cream' | 'paste' | 'curry' | 'chicken' | 'veg' | 'water' | 'eggs' | 'caramel' | 'stew' | 'pork' | 'mortar' | 'bowl';
export type Side = 'egg' | 'eggs' | 'dish' | 'box';
type Spec = { at: Station; pan?: Food[]; board?: Food[]; side?: Side | null; sink?: Food; pose?: MascotName };

const SPEC: Record<string, Spec> = {
  // กะเพรา
  fridge: { at: 'fridge' },
  chop: { at: 'board', board: ['bits'] },
  wash: { at: 'sink', sink: 'leaves' },
  stove: { at: 'stove', pan: [] },
  fry: { at: 'stove', pan: ['oil', 'egg'] },
  scoop: { at: 'stove', pan: ['oil'], side: 'egg' },
  aroma: { at: 'stove', pan: ['oil', 'bits'] },
  pork: { at: 'stove', pan: ['mince', 'bits'] },
  season: { at: 'stove', pan: ['mince', 'sauce'] },
  basil: { at: 'stove', pan: ['mince', 'sauce', 'leaves'] },
  plate: { at: 'board', pan: [], side: 'dish', pose: 'cheer' },
  // ไข่เจียว (ใช้ fridge chop stove plate ร่วมกับกะเพรา)
  mix: { at: 'board', board: ['bowl'] },
  whisk: { at: 'board', board: ['bowl'], pose: 'wash' },
  oil: { at: 'stove', pan: ['oil'] },
  pour: { at: 'stove', pan: ['oil', 'beaten'] },
  flip: { at: 'stove', pan: ['omelet'] },
  lift: { at: 'stove', pan: ['omelet'] },
  // แกงเขียวหวาน
  'gc-fridge': { at: 'fridge' },
  'gc-cut': { at: 'board', board: ['chicken'] },
  'gc-veg': { at: 'board', board: ['veg'] },
  'gc-cream': { at: 'stove', pan: ['cream'] },
  'gc-paste': { at: 'stove', pan: ['paste'] },
  'gc-chicken': { at: 'stove', pan: ['paste', 'chicken'] },
  'gc-simmer': { at: 'stove', pan: ['curry', 'chicken', 'veg'] },
  'gc-season': { at: 'stove' },
  'gc-basil': { at: 'stove', pan: ['curry', 'chicken', 'veg', 'leaves'] },
  'gc-store': { at: 'board', side: 'box', pose: 'cheer' },
  // หมูพะโล้
  'mp-fridge': { at: 'fridge' },
  'mp-eggs': { at: 'stove', pan: ['water', 'eggs'] },
  'mp-cut': { at: 'board', board: ['pork'] },
  'mp-pound': { at: 'board', board: ['mortar'], pose: 'wash' },
  'mp-caramel': { at: 'stove', pan: ['caramel'], side: 'eggs' },
  'mp-aroma': { at: 'stove', pan: ['caramel', 'bits'] },
  'mp-sear': { at: 'stove', pan: ['caramel', 'pork'] },
  'mp-braise': { at: 'stove', pan: ['stew', 'pork', 'eggs'], side: null },
  'mp-taste': { at: 'stove' },
  'mp-store': { at: 'board', side: 'box', pose: 'cheer' },
  // พริกขิง
  'pk-fridge': { at: 'fridge' },
  'pk-cut': { at: 'board', board: ['beans'] },
  'pk-paste': { at: 'stove', pan: ['oil', 'paste'] },
  'pk-meat': { at: 'stove', pan: ['paste', 'mince'] },
  'pk-beans': { at: 'stove', pan: ['paste', 'mince', 'beans'] },
  'pk-season': { at: 'stove', pan: ['paste', 'mince', 'beans', 'sauce'] },
  'pk-leaves': { at: 'stove', pan: ['paste', 'mince', 'beans', 'sauce', 'leaves'] },
  'pk-store': { at: 'board', side: 'box', pose: 'cheer' },
};

// แกงกับพะโล้ใช้หม้อ ที่เหลือใช้กระทะ
const POT = new Set(['green-curry', 'moo-palo']);
const POSE: Record<Station, MascotName> = { fridge: 'think', sink: 'wash', board: 'chop', stove: 'stir' };

export type Stage = { at: Station; pose: MascotName; pot: boolean; pan: Food[]; board: Food[]; side: Side | null; sink: Food | null; heat: Heat };

/** สภาพครัวตอนขั้นที่ i ขั้นที่ไม่มีในตาราง เชฟยืนที่เตา */
export function stageAt(recipe: string, steps: Step[], i: number): Stage {
  const spec = SPEC[steps[i].id] ?? { at: 'stove' };
  let pan: Food[] | undefined, side: Side | null | undefined, heat: Heat | undefined;
  for (let k = i; k >= 0 && (pan === undefined || side === undefined || heat === undefined); k--) {
    const s = SPEC[steps[k].id];
    if (pan === undefined && s?.pan) pan = s.pan;
    if (side === undefined && s && s.side !== undefined) side = s.side;
    if (heat === undefined && steps[k].heat !== undefined) heat = steps[k].heat;
  }
  return {
    at: spec.at, pose: spec.pose ?? POSE[spec.at], pot: POT.has(recipe),
    pan: pan ?? [], board: spec.board ?? [], side: side ?? null, sink: spec.sink ?? null,
    // จัดจานแล้วไม่ต้องมีไฟ แม้ขั้นก่อนหน้าจะยังเปิดไว้
    heat: spec.pose === 'cheer' ? 0 : heat ?? 0,
  };
}

// ---------- สิ่งที่ผู้ใช้แตะในครัวต่อขั้น (เหมือนต้นแบบ): คิดจากสิ่งที่เปลี่ยนไประหว่างขั้นก่อนกับขั้นนี้ ----------
// หยิบของในตู้เย็นแตะลำดับไหนก็ได้ ที่เหลือแตะตามลำดับ: หมุนไฟ หั่นหรือคน เปิดน้ำ ใส่ของ กลับด้าน ตักขึ้นหรือจัดจาน แล้วคน
export type ActKind = 'pick' | 'heat' | 'chop' | 'mix' | 'tap' | 'add' | 'flip' | 'scoop' | 'plate' | 'box' | 'stir';
export type Act = { kind: ActKind; taps: number; food?: Food; item?: string };
const EMPTY: Stage = { at: 'fridge', pose: 'think', pot: false, pan: [], board: [], side: null, sink: null, heat: 0 };

/** pickable = id ของวัตถุดิบที่มีภาพให้แตะในตู้เย็น */
export function actsAt(recipe: string, steps: Step[], i: number, pickable: string[]): Act[] {
  const st = stageAt(recipe, steps, i), prev = i > 0 ? stageAt(recipe, steps, i - 1) : EMPTY;
  if (st.at === 'fridge') return pickable.slice(0, 6).map((item) => ({ kind: 'pick', taps: 1, item }));
  const acts: Act[] = [];
  // จัดจานแล้วไฟดับเอง ไม่ต้องเดินกลับไปหมุนลูกบิด
  if (st.heat !== prev.heat && st.pose !== 'cheer') acts.push({ kind: 'heat', taps: Math.abs(st.heat - prev.heat) });
  if (st.at === 'board' && st.board.length) acts.push({ kind: st.pose === 'wash' ? 'mix' : 'chop', taps: 3 });
  if (st.at === 'sink') acts.push({ kind: 'tap', taps: 1 });
  for (const f of st.pan.filter((x) => !prev.pan.includes(x))) acts.push(f === 'omelet' ? { kind: 'flip', taps: 1 } : { kind: 'add', taps: 1, food: f });
  if (st.side && st.side !== prev.side) acts.push({ kind: st.side === 'dish' ? 'plate' : st.side === 'box' ? 'box' : 'scoop', taps: 1 });
  if (st.at === 'stove' && steps[i].timer && !acts.some((a) => a.kind === 'flip')) acts.push({ kind: 'stir', taps: 1 });
  return acts;
}

/** ครัวที่เห็นระหว่างแตะ: เริ่มจากสภาพของขั้นก่อน ของที่แตะแล้วเปลี่ยนตาม ครบทุกอย่างแล้วเท่ากับสภาพของขั้นนี้ */
export function shownStage(recipe: string, steps: Step[], i: number, acts: Act[], done: number[]): Stage {
  const st = stageAt(recipe, steps, i), prev = i > 0 ? stageAt(recipe, steps, i - 1) : EMPTY;
  const isDone = (k: number) => (done[k] ?? 0) >= acts[k].taps;
  const of = (kinds: ActKind[]) => acts.map((a, k) => (kinds.includes(a.kind) ? k : -1)).filter((k) => k >= 0);
  const panActs = of(['add', 'flip', 'scoop', 'plate', 'box']), sideActs = of(['scoop', 'plate', 'box']), heatAct = of(['heat'])[0];
  const added = acts.filter((a, k) => isDone(k) && a.kind === 'add').map((a) => a.food);
  const pan = !panActs.length || panActs.every(isDone) ? st.pan
    : !panActs.some(isDone) ? prev.pan
    : st.pan.filter((f) => prev.pan.includes(f) || added.includes(f));
  const step = st.heat > prev.heat ? 1 : -1;
  const heat = heatAct === undefined ? st.heat : (prev.heat + step * Math.min(done[heatAct] ?? 0, acts[heatAct].taps)) as Heat;
  return { ...st, pan, heat, side: sideActs.length && !sideActs.every(isDone) ? prev.side : st.side };
}

export const FOOD_NAME: Partial<Record<Food, L>> = {
  oil: { th: 'น้ำมัน', en: 'oil' }, egg: { th: 'ไข่', en: 'egg' }, beaten: { th: 'ไข่ที่ตีแล้ว', en: 'beaten egg' },
  bits: { th: 'เครื่องที่สับไว้', en: 'chopped aromatics' }, mince: { th: 'หมูสับ', en: 'minced pork' }, sauce: { th: 'เครื่องปรุง', en: 'seasoning' },
  leaves: { th: 'ใบสมุนไพร', en: 'herb leaves' }, beans: { th: 'ถั่วฝักยาว', en: 'long beans' }, cream: { th: 'หัวกะทิ', en: 'coconut cream' },
  paste: { th: 'พริกแกง', en: 'curry paste' }, curry: { th: 'กะทิ', en: 'coconut milk' }, chicken: { th: 'ไก่', en: 'chicken' },
  veg: { th: 'มะเขือ', en: 'eggplant' }, water: { th: 'น้ำ', en: 'water' }, eggs: { th: 'ไข่', en: 'eggs' },
  caramel: { th: 'น้ำตาลปี๊บ', en: 'palm sugar' }, stew: { th: 'น้ำกับซีอิ๊ว', en: 'water and soy sauce' }, pork: { th: 'หมู', en: 'pork' },
};

/** สิ่งที่ต้องแตะตอนนี้: หยิบของแตะลำดับไหนก็ได้ ที่เหลือทีละอย่าง (-1 = ครบแล้ว) */
export function nextAct(acts: Act[], done: number[]) {
  const left = (k: number) => (done[k] ?? 0) < acts[k].taps;
  const pick = acts.findIndex((a, k) => a.kind === 'pick' && left(k));
  return pick >= 0 ? pick : acts.findIndex((_, k) => left(k));
}

// ของหลอกในตู้เย็น (เหมือนต้นแบบ): ของที่สูตรนี้ไม่ใช้ หยิบผิดแล้วมีคำเตือนและหักคะแนน ใช้ภาพที่มีอยู่แล้ว
export const DECOYS: { img: 'morning-glory' | 'chicken' | 'pork' | 'egg'; name: L }[] = [
  { img: 'morning-glory', name: { th: 'ผักบุ้ง', en: 'morning glory' } }, { img: 'chicken', name: { th: 'ไก่', en: 'chicken' } },
  { img: 'pork', name: { th: 'หมู', en: 'pork' } }, { img: 'egg', name: { th: 'ไข่', en: 'eggs' } },
];
/** ของหลอกสองอย่างที่ไม่ซ้ำกับภาพของที่ต้องหยิบ */
export const decoysFor = (used: string[]) => DECOYS.filter((d) => !used.includes(d.img)).slice(0, 2);

/** หักคะแนนจากในครัว: หยิบผิดหรือเดินผิดที่ครั้งละ 0.2 ข้ามขั้นโดยไม่ได้แตะให้ครบขั้นละ 0.3 คะแนนต่ำสุด 1.5 */
export const kitchenPenalty = (miss: number, skips: number) => Math.round((miss * 0.2 + skips * 0.3) * 10) / 10;
export const finalScore = (taste: number, miss: number, skips: number) => Math.max(1.5, Math.round((taste - kitchenPenalty(miss, skips)) * 10) / 10);
