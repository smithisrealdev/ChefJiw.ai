-- ทำจบจานแล้วให้คะแนนหนูชิม 1 แถวต่อครั้ง ใช้วัดผลการทดสอบกับคนจริงและ 30 วันแรก (founder/launch.md)
-- ไม่มีข้อมูลส่วนตัว: device เป็นรหัสสุ่มที่แอปสร้างเอง แอปเขียนได้อย่างเดียว อ่านผ่าน SQL หรือ Dashboard
create table public.cook_runs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device text not null check (char_length(device) between 8 and 64),
  recipe text not null check (char_length(recipe) between 1 and 40),
  score numeric(2,1) not null check (score between 0 and 5)
);
alter table public.cook_runs enable row level security;
create policy "app can add a run" on public.cook_runs for insert to anon, authenticated
  with check (char_length(device) between 8 and 64);
