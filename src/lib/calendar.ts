// ปฏิทินทำอาหารและเหรียญรางวัลของแท็บฉัน คิดจากจานที่ทำจบจริงในเครื่อง (runs)
type Cooked = { recipe: string; score: number; at: number };

/** ตารางของเดือน: แต่ละแถวคือหนึ่งสัปดาห์ 7 ช่อง อาทิตย์ถึงเสาร์ ช่องนอกเดือนเป็น null (month เริ่มที่ 0) */
export function monthGrid(year: number, month: number): (number | null)[][] {
  const lead = new Date(year, month, 1).getDay(), days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, k) => k + 1)];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

/** จานที่ทำในแต่ละวันของเดือนนั้น ตามเวลาของเครื่อง ถ้าวันเดียวทำหลายจาน เก็บจานที่คะแนนดีที่สุด */
export function cookedDays<T extends Cooked>(runs: T[], year: number, month: number): Map<number, T> {
  const out = new Map<number, T>();
  for (const r of runs) {
    const d = new Date(r.at);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const had = out.get(d.getDate());
    if (!had || r.score > had.score) out.set(d.getDate(), r);
  }
  return out;
}

/** เหรียญรางวัล: จานแรก ครบ 5 จาน และเคยได้คะแนนเต็ม 5 */
export const badges = (runs: Cooked[]) => ({ first: runs.length >= 1, five: runs.length >= 5, perfect: runs.some((r) => r.score >= 5) });
