// ครัวจำลองในหน้าทำอาหาร: แต่ละขั้นเชฟไปยืนที่ไหน และในกระทะ บนเขียง ข้างเตา มีอะไร
// ของในกระทะกับของข้างเตาค้างอยู่จนกว่าขั้นหลังจะเปลี่ยน (เช่น ไข่ดาวที่ตักขึ้นพักอยู่ข้างเตาจนจัดจาน) ของบนเขียงมีเฉพาะขั้นที่ทำบนเขียง
import type { MascotName } from '@/data/images';
import type { Heat, Step } from '@/data/recipes';

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
