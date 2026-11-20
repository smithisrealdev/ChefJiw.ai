import type { ImgKey } from './recipes';

export const IMG: Record<ImgKey, number> = {
  pork: require('@/assets/images/food/pork.png'),
  egg: require('@/assets/images/food/egg.png'),
  garlic: require('@/assets/images/food/garlic.png'),
  chili: require('@/assets/images/food/chili.png'),
  rice: require('@/assets/images/food/rice.png'),
  'morning-glory': require('@/assets/images/food/morning-glory.png'),
  chicken: require('@/assets/images/food/chicken.png'),
  basil: require('@/assets/images/food/basil.png'),
  oil: require('@/assets/images/food/oil.png'),
  'oyster-sauce': require('@/assets/images/food/oyster-sauce.png'),
  'soy-sauce': require('@/assets/images/food/soy-sauce.png'),
  sugar: require('@/assets/images/food/sugar.png'),
  fish: require('@/assets/images/food/fish.png'),
  'dish-kaprao': require('@/assets/images/food/dish-kaprao.png'),
  'dish-omelet': require('@/assets/images/food/dish-omelet.png'),
  'dish-fried-rice': require('@/assets/images/food/dish-fried-rice.png'),
  'dish-morning-glory': require('@/assets/images/food/dish-morning-glory.png'),
  'dish-tom-yum': require('@/assets/images/food/dish-tom-yum.png'),
  'dish-green-curry': require('@/assets/images/food/dish-green-curry.png'),
  'dish-moo-palo': require('@/assets/images/food/dish-moo-palo.png'),
  'dish-prik-khing': require('@/assets/images/food/dish-prik-khing.png'),
};

// พื้นสีสดหลังรูปจาน จานขาวในรูปจะเด่นขึ้น
export const DISH_TINT: Record<string, string> = {
  kaprao: '#FF8F6B', omelet: '#FFD84D', 'fried-rice': '#FFB35C', 'morning-glory': '#7BE0B5', 'tom-yum': '#FF8FA8',
  'green-curry': '#8FDB8A', 'moo-palo': '#A7B0FF', 'prik-khing': '#FFB35C',
};

// ทีมเชฟ ตัวละครสามตัว แต่ละตัวดูแลงานของตัวเอง ใช้เฉพาะจังหวะที่ท่านั้นมีความหมาย ไม่แปะทุกหน้า
export const MASCOT = {
  // เชฟจิ๋ว: พาทำอาหาร
  cook: require('@/assets/images/chef/cook.png'), // ผัดกระทะ: หน้าร้าน หน้าแนะนำแอป ยังไม่เคยทำจานไหน
  cheer: require('@/assets/images/chef/cheer.png'), // สำเร็จ: ครบเวลา ทำจานแรกแล้ว
  think: require('@/assets/images/chef/think.png'), // กำลังรอคำตอบ
  oops: require('@/assets/images/chef/oops.png'), // มีอะไรผิดพลาด
  // ท่าในครัวจำลองของหน้าทำอาหาร
  walk: require('@/assets/images/chef/walk.png'), // เดินไปจุดถัดไป
  stir: require('@/assets/images/chef/stir.png'), // คนในกระทะหรือหม้อ
  chop: require('@/assets/images/chef/chop.png'), // หั่นบนเขียง
  wash: require('@/assets/images/chef/wash.png'), // ล้างของ ตีไข่
  // ใบเตย: จ่ายตลาด
  shop: require('@/assets/images/chef/shop.png'), // แผนวันอาทิตย์ ราคาตลาด
  list: require('@/assets/images/chef/list.png'), // รายการของที่ต้องซื้อ
  // น้องชิม: ให้คะแนนตอนทำจบจาน
  sip: require('@/assets/images/chef/sip.png'), // กำลังถามเรื่องรสชาติ
  yum: require('@/assets/images/chef/yum.png'), // คะแนนดี
  hmm: require('@/assets/images/chef/hmm.png'), // ยังปรับได้อีก
};

export type Motion = 'bob' | 'jump' | 'sway' | 'shake';
/** ทุกท่าแยกเป็นหลายชั้น (ทุกชั้นขนาดเท่ากัน วางทับกันพอดี) ลำดับจากหลังมาหน้า: ส่วนที่ behind, ตัว, หัว, ตา, front (แขนที่อยู่หน้าหัว), ส่วนอื่น
 *  ให้ดูเป็นร่างเดียว: sway = ทั้งตัวขยับไปด้วยกัน (หายใจ โยกตัว) หัวเอียงรอบคอ (neck) และกะพริบตา (eye = กึ่งกลางระหว่างตา) แขนขาหมุนรอบข้อต่อ (pivot)
 *  deg = องศาที่หมุน lift = ระยะยกเป็นสัดส่วนของภาพ ชั้นและจุดหมุนสร้างจาก assets/images/chef/src/draw.py */
export type PartMove = 'toss' | 'fly' | 'stepL' | 'stepR' | 'swingL' | 'swingR' | 'armL' | 'armR' | 'stir' | 'chop' | 'scrub' | 'sip' | 'tap' | 'puff' | 'drip' | 'pump' | 'twinkle' | 'still';
export type BodyMove = 'breathe' | 'waddle' | 'ponder' | 'squash' | 'bounce';
export type Part = { source: number; move: PartMove | BodyMove; lift?: number; slide?: number; deg?: number; pivot?: [number, number]; behind?: boolean };
export type Head = { source: number; eyes: number; neck: [number, number]; eye: [number, number]; move: PartMove | BodyMove; lift?: number; deg?: number };
export type Layers = { body: number; head: Head; front?: number; sway?: BodyMove; parts: Part[] };
export type MascotName = keyof typeof MASCOT;
export const LAYERS: Record<MascotName, Layers> = {
  // เชฟจิ๋วเดิน: ตัวเด้งทุกก้าว ขายกสลับ แขนแกว่งสวนขารอบหัวไหล่ หัวเด้งตามตัวช้ากว่านิด
  walk: {
    body: require('@/assets/images/chef/walk-body.png'), sway: 'bounce',
    head: { source: require('@/assets/images/chef/walk-head.png'), eyes: require('@/assets/images/chef/walk-eyes.png'), neck: [0.515, 0.531], eye: [0.524, 0.42], move: 'armR', deg: 1.5 },
    parts: [
      { source: require('@/assets/images/chef/walk-legL.png'), move: 'stepL', lift: 0.035, behind: true },
      { source: require('@/assets/images/chef/walk-legR.png'), move: 'stepR', lift: 0.035, behind: true },
      { source: require('@/assets/images/chef/walk-armL.png'), move: 'armL', deg: 12, pivot: [0.359, 0.584] },
      { source: require('@/assets/images/chef/walk-armR.png'), move: 'armR', deg: 12, pivot: [0.665, 0.6] },
    ],
  },
  // เชฟจิ๋วผัด: แขนกับตะหลิวกวาดไปมาในกระทะรอบหัวไหล่ ตัวหายใจ หัวเอียงตามมือนิดๆ
  stir: {
    body: require('@/assets/images/chef/stir-body.png'), sway: 'breathe', front: require('@/assets/images/chef/stir-front.png'),
    head: { source: require('@/assets/images/chef/stir-head.png'), eyes: require('@/assets/images/chef/stir-eyes.png'), neck: [0.525, 0.532], eye: [0.533, 0.431], move: 'stir', deg: 1.2 },
    parts: [{ source: require('@/assets/images/chef/stir-spatula.png'), move: 'stir', deg: 9, slide: 0.012, pivot: [0.672, 0.606] }],
  },
  // เชฟจิ๋วหั่น: มีดสับลงสามที แล้วพักเลื่อนของ
  chop: {
    body: require('@/assets/images/chef/chop-body.png'), sway: 'breathe', front: require('@/assets/images/chef/chop-front.png'),
    head: { source: require('@/assets/images/chef/chop-head.png'), eyes: require('@/assets/images/chef/chop-eyes.png'), neck: [0.52, 0.531], eye: [0.522, 0.433], move: 'chop', lift: 0.004 },
    parts: [{ source: require('@/assets/images/chef/chop-knife.png'), move: 'chop', deg: -10, pivot: [0.668, 0.603] }],
  },
  // เชฟจิ๋วล้าง: สองมือถูไปมาใต้น้ำ
  wash: {
    body: require('@/assets/images/chef/wash-body.png'), sway: 'breathe',
    head: { source: require('@/assets/images/chef/wash-head.png'), eyes: require('@/assets/images/chef/wash-eyes.png'), neck: [0.52, 0.531], eye: [0.525, 0.432], move: 'scrub', deg: 1 },
    parts: [{ source: require('@/assets/images/chef/wash-hands.png'), move: 'scrub', deg: 3, slide: 0.02, pivot: [0.668, 0.603] }],
  },
  // เชฟจิ๋วผัดกระทะ: ตัวยืดขึ้นตามจังหวะ หัวเด้งตาม กระทะกระดกรอบมือ ผักลอยขึ้นสูงกว่า
  cook: {
    body: require('@/assets/images/chef/cook-body.png'), sway: 'squash',
    head: { source: require('@/assets/images/chef/cook-head.png'), eyes: require('@/assets/images/chef/cook-eyes.png'), neck: [0.544, 0.534], eye: [0.55, 0.423], move: 'toss', lift: 0.012 },
    parts: [
      { source: require('@/assets/images/chef/cook-food.png'), move: 'fly', lift: 0.1 },
      { source: require('@/assets/images/chef/cook-wok.png'), move: 'toss', lift: 0.02, deg: 5, pivot: [0.553, 0.749] },
    ],
  },
  // เชฟจิ๋วดีใจ: หัวเด้ง แขนสองข้างชูรอบหัวไหล่ ดาววิบวับ (การกระโดดอยู่ที่ Float)
  cheer: {
    body: require('@/assets/images/chef/cheer-body.png'),
    head: { source: require('@/assets/images/chef/cheer-head.png'), eyes: require('@/assets/images/chef/cheer-eyes.png'), neck: [0.5, 0.531], eye: [0.5, 0.42], move: 'pump', lift: 0.012 },
    parts: [
      { source: require('@/assets/images/chef/cheer-armL.png'), move: 'pump', deg: -8, pivot: [0.347, 0.592], behind: true },
      { source: require('@/assets/images/chef/cheer-armR.png'), move: 'pump', deg: 8, pivot: [0.653, 0.592], behind: true },
      { source: require('@/assets/images/chef/cheer-stars.png'), move: 'twinkle' },
    ],
  },
  // เชฟจิ๋วคิด: โยกตัวช้าๆ เอียงคอไปมา มือเคาะคางรอบหัวไหล่ ฟองความคิดลอย
  think: {
    body: require('@/assets/images/chef/think-body.png'), sway: 'ponder', front: require('@/assets/images/chef/think-front.png'),
    head: { source: require('@/assets/images/chef/think-head.png'), eyes: require('@/assets/images/chef/think-eyes.png'), neck: [0.515, 0.531], eye: [0.56, 0.415], move: 'ponder', deg: 3 },
    parts: [
      { source: require('@/assets/images/chef/think-hand.png'), move: 'tap', deg: -4, pivot: [0.665, 0.6] },
      { source: require('@/assets/images/chef/think-bubbles.png'), move: 'puff', lift: 0.03 },
    ],
  },
  // เชฟจิ๋วตกใจ: เหงื่อหยด เส้นตกใจกะพริบ (การสั่นอยู่ที่ Float)
  oops: {
    body: require('@/assets/images/chef/oops-body.png'), front: require('@/assets/images/chef/oops-front.png'),
    head: { source: require('@/assets/images/chef/oops-head.png'), eyes: require('@/assets/images/chef/oops-eyes.png'), neck: [0.451, 0.535], eye: [0.424, 0.427], move: 'still' },
    parts: [
      { source: require('@/assets/images/chef/oops-sweat.png'), move: 'drip', lift: 0.1 },
      { source: require('@/assets/images/chef/oops-lines.png'), move: 'twinkle' },
    ],
  },
  // ใบเตยเดิน: โยกตัวซ้ายขวา หัวเอียงสวนเล็กน้อยให้ทรงตัว ขาข้างที่ไม่ได้รับน้ำหนักยกขึ้น
  shop: {
    body: require('@/assets/images/chef/shop-body.png'), sway: 'waddle', front: require('@/assets/images/chef/shop-front.png'),
    head: { source: require('@/assets/images/chef/shop-head.png'), eyes: require('@/assets/images/chef/shop-eyes.png'), neck: [0.525, 0.532], eye: [0.525, 0.421], move: 'waddle', deg: -1.5 },
    parts: [
      { source: require('@/assets/images/chef/shop-legL.png'), move: 'stepL', lift: 0.03, behind: true },
      { source: require('@/assets/images/chef/shop-legR.png'), move: 'stepR', lift: 0.03, behind: true },
      // ผมเปียอยู่หลังตัว เอียงไปพร้อมหัว (จุดหมุนและจังหวะเดียวกับ head)
      { source: require('@/assets/images/chef/shop-braids.png'), move: 'waddle', deg: -1.5, pivot: [0.525, 0.532], behind: true },
    ],
  },
  // ใบเตยนั่งบนลัง: หายใจ เอียงคออ่านรายการ ขาแกว่งรอบสะโพกสลับกัน
  list: {
    body: require('@/assets/images/chef/list-body.png'), sway: 'breathe', front: require('@/assets/images/chef/list-front.png'),
    head: { source: require('@/assets/images/chef/list-head.png'), eyes: require('@/assets/images/chef/list-eyes.png'), neck: [0.5, 0.531], eye: [0.514, 0.42], move: 'ponder', deg: 2.5 },
    parts: [
      { source: require('@/assets/images/chef/list-ground.png'), move: 'still', behind: true },
      { source: require('@/assets/images/chef/list-legL.png'), move: 'swingL', deg: 7, pivot: [0.439, 0.791], behind: true },
      { source: require('@/assets/images/chef/list-legR.png'), move: 'swingR', deg: 7, pivot: [0.561, 0.791], behind: true },
      { source: require('@/assets/images/chef/list-braids.png'), move: 'ponder', deg: 2.5, pivot: [0.5, 0.531], behind: true },
    ],
  },
  // น้องชิมชิม: หายใจ เอียงคอ แขนที่ถือช้อนลดลงรอบหัวไหล่แล้วยกกลับมาที่ปาก หัวใจลอย
  sip: {
    body: require('@/assets/images/chef/sip-body.png'), sway: 'breathe', front: require('@/assets/images/chef/sip-front.png'),
    head: { source: require('@/assets/images/chef/sip-head.png'), eyes: require('@/assets/images/chef/sip-eyes.png'), neck: [0.5, 0.65], eye: [0.49, 0.553], move: 'ponder', deg: 2 },
    parts: [
      { source: require('@/assets/images/chef/sip-spoon.png'), move: 'sip', deg: -14, pivot: [0.635, 0.704] },
      { source: require('@/assets/images/chef/sip-hearts.png'), move: 'puff', lift: 0.03 },
    ],
  },
  // น้องชิมดีใจ: หัวเด้ง แขนกับช้อนชูรอบหัวไหล่ ดาววิบวับ (การกระโดดอยู่ที่ Float)
  yum: {
    body: require('@/assets/images/chef/yum-body.png'),
    head: { source: require('@/assets/images/chef/yum-head.png'), eyes: require('@/assets/images/chef/yum-eyes.png'), neck: [0.53, 0.585], eye: [0.532, 0.487], move: 'pump', lift: 0.012 },
    parts: [
      { source: require('@/assets/images/chef/yum-arm.png'), move: 'pump', deg: -8, pivot: [0.39, 0.622], behind: true },
      { source: require('@/assets/images/chef/yum-spoon.png'), move: 'pump', deg: 8, pivot: [0.658, 0.655] },
      { source: require('@/assets/images/chef/yum-stars.png'), move: 'twinkle' },
    ],
  },
  // น้องชิมสงสัย: โยกตัวช้าๆ เอียงคอไปมา ช้อนเคาะรอบหัวไหล่ ฟองความคิดลอย
  hmm: {
    body: require('@/assets/images/chef/hmm-body.png'), sway: 'ponder', front: require('@/assets/images/chef/hmm-front.png'),
    head: { source: require('@/assets/images/chef/hmm-head.png'), eyes: require('@/assets/images/chef/hmm-eyes.png'), neck: [0.483, 0.584], eye: [0.44, 0.485], move: 'ponder', deg: 3 },
    parts: [
      { source: require('@/assets/images/chef/hmm-spoon.png'), move: 'tap', deg: 4, pivot: [0.621, 0.628] },
      { source: require('@/assets/images/chef/hmm-bubbles.png'), move: 'puff', lift: 0.03 },
    ],
  },
};
/** ฉากเต็มความกว้างใต้ชื่อหน้าจอ: ภาพพื้นหลังโปร่งใสที่วาดให้เข้ากับสีหัวจอ แล้ววางตัวละครทับทีละตัวเพื่อให้ขยับได้
 *  ตำแหน่งเป็นสัดส่วนของฉาก (ซ้าย บน กว้าง) ตัวละครเป็นภาพจัตุรัส */
// ฉากใต้หัวจอ: lead = ตัวเอกของฉาก ขยับได้ตัวเดียว ที่เหลือเป็นภาพนิ่ง (จอหนึ่งมีของขยับไม่เกินหนึ่งถึงสองจุด)
export const SCENE = {
  // ครัวของทีมเชฟ (หัวจอสีน้ำเงิน): ใบเตยกลับจากตลาด เชฟจิ๋วผัดกระทะ น้องชิมรอชิม
  home: {
    source: require('@/assets/images/chef/scene-home.png'), ratio: 780 / 360,
    cast: [{ name: 'shop', left: 0.008, top: 0.46, width: 0.246 }, { name: 'cook', left: 0.344, top: 0.278, width: 0.326, lead: true }, { name: 'yum', left: 0.759, top: 0.528, width: 0.215 }],
  },
  // ห้องอ่านสูตร (หัวจอสีชมพู): เชฟจิ๋วคิดเมนู น้องชิมสงสัยว่าจะกินอะไร
  recipes: {
    source: require('@/assets/images/chef/scene-recipes.png'), ratio: 780 / 360,
    cast: [{ name: 'think', left: 0.3, top: 0.31, width: 0.3, lead: true }, { name: 'hmm', left: 0.52, top: 0.36, width: 0.28 }],
  },
  // หน้าเตา (หัวจอสีส้ม): เชฟจิ๋วผัดกระทะ น้องชิมนั่งชิมอยู่ข้างๆ
  cook: {
    source: require('@/assets/images/chef/scene-cook.png'), ratio: 780 / 360,
    cast: [{ name: 'sip', left: 0.02, top: 0.44, width: 0.26 }, { name: 'cook', left: 0.33, top: 0.25, width: 0.34, lead: true }],
  },
  // มุมรางวัล (หัวจอสีเขียว): ใบเตยนั่งดูรายการ เชฟจิ๋วดีใจ
  me: {
    source: require('@/assets/images/chef/scene-me.png'), ratio: 780 / 360,
    cast: [{ name: 'list', left: 0.24, top: 0.4, width: 0.26, lead: true }, { name: 'cheer', left: 0.47, top: 0.36, width: 0.27 }],
  },
  // แผงตลาด (หัวจอสีส้ม): ใบเตยเดินเลือกของ
  plan: {
    source: require('@/assets/images/chef/scene-plan.png'), ratio: 780 / 300,
    cast: [{ name: 'shop', left: 0.038, top: 0.233, width: 0.295, lead: true }],
  },
} satisfies Record<string, { source: number; ratio: number; cast: { name: MascotName; left: number; top: number; width: number; lead?: true }[] }>;
