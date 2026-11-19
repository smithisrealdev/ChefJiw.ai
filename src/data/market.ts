// ราคาตัวอย่างต่อประเทศจากต้นแบบหน้าราคาตลาด
// shortcut: ตัวเลขคงที่ ไม่ใช่ราคาจริง, แทนด้วยผลจาก api.prices เมื่อมีระบบอัปเดตราคารายวัน
import type { L } from '../lib/i18n.ts';
import type { Country } from '../lib/money.ts';
import type { ImgKey } from './recipes.ts';

export type Cat = 'meat' | 'veg' | 'dry';
export type MarketItem = { id: string; img?: ImgKey; name: L; unit: L; price: number; change: number; cat: Cat };

const l = (th: string, en: string): L => ({ th, en });

export const CURRENCY: Record<Country, { sign: string; decimals: boolean }> = {
  TH: { sign: '฿', decimals: false }, JP: { sign: '¥', decimals: false }, US: { sign: '$', decimals: true },
};

/** ราคาในสกุลเงินท้องถิ่นของประเทศนั้นอยู่แล้ว ไม่ต้องแปลง */
export function local(value: number, c: Country) {
  const cur = CURRENCY[c];
  return cur.sign + (cur.decimals ? value.toFixed(2) : value.toLocaleString('en-US'));
}

export const MARKET: Record<Country, { tip: L; items: MarketItem[] }> = {
  TH: {
    tip: l('วันนี้ผักบุ้งถูกลง ทำผัดผักบุ้งคุ้มสุด', 'Morning glory is cheaper today. Stir-fried morning glory is the best value.'),
    items: [
      { id: 'pork', img: 'pork', name: l('หมูสับ', 'Minced pork'), unit: l('ต่อกิโลกรัม', 'per kg'), price: 165, change: 5, cat: 'meat' },
      { id: 'chicken', img: 'chicken', name: l('อกไก่', 'Chicken breast'), unit: l('ต่อกิโลกรัม', 'per kg'), price: 85, change: -3, cat: 'meat' },
      { id: 'egg', img: 'egg', name: l('ไข่ไก่', 'Eggs'), unit: l('แผง 30 ฟอง', 'tray of 30'), price: 135, change: 0, cat: 'dry' },
      { id: 'morning', img: 'morning-glory', name: l('ผักบุ้ง', 'Morning glory'), unit: l('ต่อกำ', 'per bunch'), price: 15, change: -2, cat: 'veg' },
      { id: 'basil', img: 'basil', name: l('ใบกะเพรา', 'Holy basil'), unit: l('ต่อกำ', 'per bunch'), price: 10, change: 0, cat: 'veg' },
      { id: 'chili', img: 'chili', name: l('พริกขี้หนู', "Bird's eye chili"), unit: l('ต่อขีด', 'per 100 g'), price: 12, change: -1, cat: 'veg' },
      { id: 'garlic', img: 'garlic', name: l('กระเทียม', 'Garlic'), unit: l('ต่อกิโลกรัม', 'per kg'), price: 120, change: 10, cat: 'dry' },
      { id: 'rice', img: 'rice', name: l('ข้าวหอมมะลิ', 'Jasmine rice'), unit: l('ต่อกิโลกรัม', 'per kg'), price: 42, change: 0, cat: 'dry' },
    ],
  },
  JP: {
    tip: l('สะโพกไก่ถูกลง ทำไก่เทอริยากิคุ้มสุด', 'Chicken thigh is cheaper. Teriyaki chicken is the best value.'),
    items: [
      { id: 'pork', img: 'pork', name: l('หมูสับ', 'Minced pork'), unit: l('ต่อ 100 กรัม', 'per 100 g'), price: 158, change: 0, cat: 'meat' },
      { id: 'chicken', img: 'chicken', name: l('สะโพกไก่', 'Chicken thigh'), unit: l('ต่อ 100 กรัม', 'per 100 g'), price: 128, change: -10, cat: 'meat' },
      { id: 'egg', img: 'egg', name: l('ไข่ไก่', 'Eggs'), unit: l('แพ็ก 10 ฟอง', 'pack of 10'), price: 268, change: 10, cat: 'dry' },
      { id: 'negi', name: l('ต้นหอมญี่ปุ่น', 'Japanese leek'), unit: l('ต่อต้น', 'each'), price: 98, change: 0, cat: 'veg' },
      { id: 'tofu', name: l('เต้าหู้ขาว', 'Tofu'), unit: l('ต่อก้อน', 'per block'), price: 88, change: 0, cat: 'dry' },
      { id: 'soy', img: 'soy-sauce', name: l('โชยุ', 'Soy sauce'), unit: l('ขวด 500 มล.', '500 ml bottle'), price: 298, change: 0, cat: 'dry' },
      { id: 'rice', img: 'rice', name: l('ข้าวญี่ปุ่น', 'Japanese rice'), unit: l('ถุง 2 กิโลกรัม', '2 kg bag'), price: 1680, change: 40, cat: 'dry' },
    ],
  },
  US: {
    tip: l('อกไก่ถูกลง ทำไก่อบกระเทียมคุ้มสุด', 'Chicken breast is cheaper. Garlic roast chicken is the best value.'),
    items: [
      { id: 'chicken', img: 'chicken', name: l('อกไก่', 'Chicken breast'), unit: l('ต่อปอนด์', 'per lb'), price: 3.99, change: -0.5, cat: 'meat' },
      { id: 'egg', img: 'egg', name: l('ไข่ไก่', 'Eggs'), unit: l('ต่อโหล', 'per dozen'), price: 3.49, change: 0.2, cat: 'dry' },
      { id: 'garlic', img: 'garlic', name: l('กระเทียม', 'Garlic'), unit: l('ต่อหัว', 'per head'), price: 0.79, change: 0, cat: 'veg' },
      { id: 'butter', name: l('เนย', 'Butter'), unit: l('ต่อปอนด์', 'per lb'), price: 4.99, change: 0, cat: 'dry' },
      { id: 'pasta', name: l('พาสต้า', 'Pasta'), unit: l('กล่อง 1 ปอนด์', '1 lb box'), price: 1.89, change: 0, cat: 'dry' },
      { id: 'rice', img: 'rice', name: l('ข้าวเมล็ดยาว', 'Long-grain rice'), unit: l('ถุง 2 ปอนด์', '2 lb bag'), price: 3.29, change: 0, cat: 'dry' },
    ],
  },
};
