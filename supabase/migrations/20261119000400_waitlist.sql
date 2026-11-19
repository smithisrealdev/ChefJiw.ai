-- หน้า waitlist (waitlist/index.html): ลงชื่อรอเปิดตัว หรือแจ้งโอนสั่งจองชุด 12 จาน 99 บาท (founder/launch.md)
-- มีข้อมูลส่วนตัว (ชื่อ ช่องทางติดต่อ) บันทึกได้ต่อเมื่อติ๊กยินยอม (PDPA) หน้าเว็บเขียนได้อย่างเดียว อ่านผ่าน SQL หรือ Dashboard
-- shortcut: ไม่มี captcha หรือจำกัดจำนวนครั้ง ถ้าเจอสแปมให้เพิ่มก่อนแชร์ลิงก์ไปไกลกว่ากลุ่มทำอาหาร
create table public.waitlist (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('waitlist', 'preorder')),
  name text check (char_length(name) <= 80),
  contact text not null check (char_length(contact) between 3 and 120),
  paid_note text check (char_length(paid_note) <= 200), -- สั่งจอง: โอนเมื่อไร หรือเลขท้ายบัญชี ใช้จับคู่กับยอดเข้า
  source text check (char_length(source) <= 40), -- ?g= ในลิงก์ บอกว่ามาจากกลุ่มไหน
  consent boolean not null check (consent),
  check (kind = 'waitlist' or (name is not null and paid_note is not null))
);
alter table public.waitlist enable row level security;
create policy "page can add a sign-up" on public.waitlist for insert to anon with check (consent);
