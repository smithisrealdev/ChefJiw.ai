export type Country = 'TH' | 'JP' | 'US';
export const COUNTRIES: Country[] = ['TH', 'JP', 'US'];

// แปลงราคาตัวอย่าง (บาท) เป็นสกุลเงินของประเทศที่เลือก
// shortcut: อัตราแปลงตัวอย่างคงที่ ไม่ใช่ราคาท้องถิ่นจริง, เปลี่ยนเป็นราคาจากข้อมูลรายวันเมื่อมีระบบราคา
export function money(baht: number, country: Country): string {
  if (country === 'JP') return '¥' + Math.max(10, Math.round((baht * 4.5) / 10) * 10).toLocaleString('en-US');
  if (country === 'US') return '$' + (baht * 0.03).toFixed(2);
  return '฿' + Math.round(baht * 100) / 100;
}
