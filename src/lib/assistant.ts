// สิ่งที่ทำให้เชฟจิ๋วเป็นผู้ช่วย ไม่ใช่แชตทั่วไป: จำคำตอบตอนชิมครั้งก่อนแล้วเตือนตรงขั้นที่เกี่ยว และรู้ว่าตอนนี้ผู้ใช้อยู่ขั้นไหนของสูตรแบบไหน
import type { Recipe, Step } from '../data/recipes.ts';
import type { L } from './i18n.ts';

// คำแนะนำหลังชิมแต่ละข้อใช้ที่ขั้นไหนของสูตร: [รสชาติ, กลิ่น, หน้าตา] ข้อละ [ตอบตัวเลือกแรก, ตอบตัวเลือกที่สาม]
const AT: Record<string, [string, string][]> = {
  kaprao: [['season', 'season'], ['aroma', 'aroma'], ['pork', 'pork']],
  omelet: [['mix', 'mix'], ['whisk', 'lift'], ['oil', 'flip']],
  'green-curry': [['gc-season', 'gc-season'], ['gc-paste', 'gc-paste'], ['gc-simmer', 'gc-cream']],
  'moo-palo': [['mp-braise', 'mp-braise'], ['mp-aroma', 'mp-caramel'], ['mp-caramel', 'mp-caramel']],
  'prik-khing': [['pk-season', 'pk-season'], ['pk-paste', 'pk-paste'], ['pk-beans', 'pk-beans']],
};

/** คำตอบตอนชิมของครั้งล่าสุดที่ทำจานนี้ (ครั้งที่ทำก่อนมีการเก็บคำตอบจะไม่มี) */
export const lastAns = (runs: { recipe: string; ans?: number[] }[], recipe: string) => runs.findLast((x) => x.recipe === recipe && x.ans)?.ans;

export type Reminder = { sense: L; said: L; tip: L; step: string };
/** สิ่งที่ครั้งก่อนยังไม่ดี (ตอบไม่ใช่ตัวเลือกกลาง) พร้อมคำแนะนำที่ให้ไว้ ส่ง stepId มาเพื่อเอาเฉพาะของขั้นนั้น */
export function reminders(r: Recipe, ans: number[] | undefined, stepId?: string): Reminder[] {
  if (!ans) return [];
  return r.senses.flatMap((s, k) => {
    const a = ans[k];
    if (a !== 0 && a !== 2) return [];
    const step = AT[r.id]?.[k]?.[a === 0 ? 0 : 1] ?? '';
    return stepId === undefined || stepId === step ? [{ sense: s.label, said: s.options[a], tip: s.tips[a === 0 ? 0 : 1], step }] : [];
  });
}

/** รายละเอียดของขั้นที่ส่งให้ AI พร้อมคำถาม คำตอบจึงเจาะจงกับสิ่งที่ผู้ใช้ทำอยู่จริง (เซิร์ฟเวอร์รับไม่เกิน 1500 ตัวอักษร) */
export function stepContext(r: Recipe, i: number, o: { o1: number; o2: number; heat: string | null; ans?: number[]; pick: (l: L) => string }) {
  const step: Step = r.steps[i], { pick } = o;
  const opt = (g: Recipe['g1'], v: number) => (g.opts[v] ? `${pick(g.title)}: ${pick(g.opts[v].label)}` : '');
  return [
    `Step ${i + 1} of ${r.steps.length}. Do: ${pick(step.do)}`,
    `Should see: ${pick(step.see)}`,
    `Why: ${pick(step.why)}`,
    o.heat && `Heat: ${o.heat}`,
    step.timer && `Timer: ${step.timer} seconds`,
    i > 0 && `Previous step: ${pick(r.steps[i - 1].title)}`,
    i < r.steps.length - 1 && `Next step: ${pick(r.steps[i + 1].title)}`,
    [opt(r.g1, o.o1), opt(r.g2, o.o2)].filter(Boolean).join(', '),
    r.adaptNotes.length > 0 && `Recipe adapted: ${r.adaptNotes.map(pick).join(' ')}`,
    ...reminders(r, o.ans).map((m) => `Last time the cook said ${pick(m.sense)}: ${pick(m.said)}`),
  ].filter(Boolean).join('\n').slice(0, 1500);
}
