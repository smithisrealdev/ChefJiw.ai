import { BETA } from './beta.ts';

export type Asked = { day: string; n: number };

// เบต้ายังไม่มีระบบจ่ายเงิน จึงให้ถามฟรีมากขึ้น ต้องตรงกับ FREE_PER_DAY ฝั่งเซิร์ฟเวอร์ (supabase/functions/_shared/common.ts)
export const FREE_PER_DAY = BETA ? 20 : 3;

/** คำถามที่พิมพ์ถาม AI ได้ฟรีที่เหลือวันนี้ นับใหม่ทุกวัน */
export function freeLeft(asked: Asked, day: string) {
  return asked.day === day ? Math.max(0, FREE_PER_DAY - asked.n) : FREE_PER_DAY;
}

/** วันที่ตามเวลาท้องถิ่นของเครื่อง โควตาจึงรีเซ็ตตอนเที่ยงคืนของผู้ใช้ ไม่ใช่ตาม UTC */
export function localDay(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function spendOne(asked: Asked, day: string): Asked {
  return asked.day === day ? { day, n: asked.n + 1 } : { day, n: 1 };
}
