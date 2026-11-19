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
  // ใบเตย: จ่ายตลาด
  shop: require('@/assets/images/chef/shop.png'), // แผนวันอาทิตย์ ราคาตลาด
  list: require('@/assets/images/chef/list.png'), // รายการของที่ต้องซื้อ
  // น้องชิม: ให้คะแนนตอนทำจบจาน
  sip: require('@/assets/images/chef/sip.png'), // กำลังถามเรื่องรสชาติ
  yum: require('@/assets/images/chef/yum.png'), // คะแนนดี
  hmm: require('@/assets/images/chef/hmm.png'), // ยังปรับได้อีก
};

export type Motion = 'bob' | 'jump' | 'sway' | 'shake';
/** ทุกท่าแยกเป็นหลายชั้น: ภาพตัว แล้วซ้อนด้วยส่วนที่ขยับเอง (ทุกชั้นขนาดเท่ากัน วางทับกันพอดี) behind = อยู่หลังตัว
 *  ชั้นทั้งหมดสร้างจาก assets/images/chef/src/draw.py (ตาราง SPLIT) */
export type PartMove = 'toss' | 'fly' | 'stepL' | 'stepR' | 'sip' | 'tap' | 'puff' | 'drip' | 'pump' | 'twinkle' | 'still';
export type Layers = { body: number; parts: { source: number; move: PartMove; behind?: boolean }[] };
export type MascotName = keyof typeof MASCOT;
export const LAYERS: Record<MascotName, Layers> = {
  // เชฟจิ๋วผัดกระทะ: กระทะกับแขนกระดกขึ้น ผักลอยขึ้นสูงกว่า
  cook: { body: require('@/assets/images/chef/cook-body.png'), parts: [
    { source: require('@/assets/images/chef/cook-food.png'), move: 'fly' },
    { source: require('@/assets/images/chef/cook-wok.png'), move: 'toss' },
  ] },
  // เชฟจิ๋วดีใจ: แขนชูขึ้นลง ดาววิบวับ
  cheer: { body: require('@/assets/images/chef/cheer-body.png'), parts: [
    { source: require('@/assets/images/chef/cheer-arms.png'), move: 'pump', behind: true },
    { source: require('@/assets/images/chef/cheer-stars.png'), move: 'twinkle' },
  ] },
  // เชฟจิ๋วคิด: มือเคาะคาง ฟองความคิดลอย
  think: { body: require('@/assets/images/chef/think-body.png'), parts: [
    { source: require('@/assets/images/chef/think-hand.png'), move: 'tap' },
    { source: require('@/assets/images/chef/think-bubbles.png'), move: 'puff' },
  ] },
  // เชฟจิ๋วตกใจ: เหงื่อหยด เส้นตกใจกะพริบ
  oops: { body: require('@/assets/images/chef/oops-body.png'), parts: [
    { source: require('@/assets/images/chef/oops-sweat.png'), move: 'drip' },
    { source: require('@/assets/images/chef/oops-lines.png'), move: 'twinkle' },
  ] },
  // ใบเตยเดิน: ขาซ้ายขวายกสลับกัน
  shop: { body: require('@/assets/images/chef/shop-body.png'), parts: [
    { source: require('@/assets/images/chef/shop-legL.png'), move: 'stepL', behind: true },
    { source: require('@/assets/images/chef/shop-legR.png'), move: 'stepR', behind: true },
  ] },
  // ใบเตยนั่งบนลัง: แกว่งขาสลับกัน
  list: { body: require('@/assets/images/chef/list-body.png'), parts: [
    { source: require('@/assets/images/chef/list-ground.png'), move: 'still', behind: true },
    { source: require('@/assets/images/chef/list-legL.png'), move: 'stepL', behind: true },
    { source: require('@/assets/images/chef/list-legR.png'), move: 'stepR', behind: true },
  ] },
  // น้องชิมชิม: ช้อนลดลงแล้วยกกลับมาที่ปาก หัวใจลอย
  sip: { body: require('@/assets/images/chef/sip-body.png'), parts: [
    { source: require('@/assets/images/chef/sip-spoon.png'), move: 'sip' },
    { source: require('@/assets/images/chef/sip-hearts.png'), move: 'puff' },
  ] },
  // น้องชิมดีใจ: แขนกับช้อนชูขึ้นลง ดาววิบวับ
  yum: { body: require('@/assets/images/chef/yum-body.png'), parts: [
    { source: require('@/assets/images/chef/yum-arm.png'), move: 'pump', behind: true },
    { source: require('@/assets/images/chef/yum-spoon.png'), move: 'pump' },
    { source: require('@/assets/images/chef/yum-stars.png'), move: 'twinkle' },
  ] },
  // น้องชิมสงสัย: ช้อนเคาะ ฟองความคิดลอย
  hmm: { body: require('@/assets/images/chef/hmm-body.png'), parts: [
    { source: require('@/assets/images/chef/hmm-spoon.png'), move: 'tap' },
    { source: require('@/assets/images/chef/hmm-bubbles.png'), move: 'puff' },
  ] },
};
/** ฉากเต็มความกว้างใต้ชื่อหน้าจอ: ภาพพื้นหลังโปร่งใสที่วาดให้เข้ากับสีหัวจอ แล้ววางตัวละครทับทีละตัวเพื่อให้ขยับได้
 *  ตำแหน่งเป็นสัดส่วนของฉาก (ซ้าย บน กว้าง) ตัวละครเป็นภาพจัตุรัส */
export const SCENE = {
  // ครัวของทีมเชฟ (หัวจอสีน้ำเงิน): ใบเตยเดินกลับจากตลาด เชฟจิ๋วผัดกระทะ น้องชิมกระโดดรอ
  home: {
    source: require('@/assets/images/chef/scene-home.png'), ratio: 780 / 360,
    cast: [
      { name: 'shop', left: 0.008, top: 0.46, width: 0.246, motion: 'bob', delay: 400 },
      { name: 'cook', left: 0.344, top: 0.278, width: 0.326, motion: 'bob', delay: 0 },
      { name: 'yum', left: 0.759, top: 0.528, width: 0.215, motion: 'jump', delay: 900 },
    ],
  },
  // แผงตลาด (หัวจอสีส้ม): ใบเตยเดินเลือกของ
  plan: {
    source: require('@/assets/images/chef/scene-plan.png'), ratio: 780 / 300,
    cast: [{ name: 'shop', left: 0.038, top: 0.233, width: 0.295, motion: 'bob', delay: 0 }],
  },
} satisfies Record<string, { source: number; ratio: number; cast: { name: MascotName; left: number; top: number; width: number; motion: Motion; delay: number }[] }>;
