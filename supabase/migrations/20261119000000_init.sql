-- ข้อมูลผู้ใช้: สถานะสมาชิกตั้งได้จากฝั่งเซิร์ฟเวอร์เท่านั้น (ผลการซื้อในแอป) ผู้ใช้อ่านได้แค่ของตัวเอง
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  member boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- จำนวนคำถามที่ถาม AI ต่อวัน (วันตามเวลาท้องถิ่นของผู้ใช้)
create table public.ai_usage (
  user_id uuid not null references auth.users on delete cascade,
  day date not null,
  n int not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;
create policy "read own usage" on public.ai_usage for select to authenticated using ((select auth.uid()) = user_id);

-- จองสิทธิ์ถาม 1 ครั้งแบบ atomic: สมาชิกผ่านเสมอ คนทั่วไปผ่านเมื่อยังไม่ครบ p_limit
create function public.reserve_ai_call(p_user uuid, p_day date, p_limit int) returns boolean
language plpgsql security definer set search_path = '' as $$
declare ok boolean;
begin
  if exists (select 1 from public.profiles where id = p_user and member) then return true; end if;
  insert into public.ai_usage (user_id, day, n) values (p_user, p_day, 1)
  on conflict (user_id, day) do update set n = public.ai_usage.n + 1 where public.ai_usage.n < p_limit
  returning true into ok;
  return coalesce(ok, false);
end $$;

-- คืนสิทธิ์เมื่อเรียกโมเดลไม่สำเร็จ คำถามที่ล้มเหลวจึงไม่ถูกนับ
create function public.refund_ai_call(p_user uuid, p_day date) returns void
language sql security definer set search_path = '' as $$
  update public.ai_usage set n = greatest(n - 1, 0) where user_id = p_user and day = p_day;
$$;

revoke execute on function public.reserve_ai_call(uuid, date, int) from public, anon, authenticated;
revoke execute on function public.refund_ai_call(uuid, date) from public, anon, authenticated;
grant execute on function public.reserve_ai_call(uuid, date, int) to service_role;
grant execute on function public.refund_ai_call(uuid, date) to service_role;

-- ราคาวัตถุดิบล่าสุดต่อประเทศ อัปเดตรายวันโดย edge function update-prices ทุกคนอ่านได้
create table public.prices (
  country text not null check (country in ('TH', 'JP', 'US')),
  item_id text not null,
  price numeric not null check (price > 0),
  change numeric not null default 0,
  source text not null,
  updated_at timestamptz not null default now(),
  primary key (country, item_id)
);
alter table public.prices enable row level security;
create policy "anyone reads prices" on public.prices for select to anon, authenticated using (true);
