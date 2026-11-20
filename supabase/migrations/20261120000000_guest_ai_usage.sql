-- เบต้า: ถามเชฟได้โดยไม่ต้องมีบัญชี นับโควตาต่อรหัสเครื่อง (รหัสสุ่มที่แอปเก็บไว้) แทนผู้ใช้
-- รหัสเครื่องปลอมได้ จึงมีเพดานรวมต่อวันของผู้ใช้ทดลองทั้งหมด กันค่า AI บานถ้าลิงก์หลุด
-- อ่านเขียนได้เฉพาะ edge function (service role) ไม่มี policy ให้ anon หรือ authenticated
create table public.ai_usage_device (
  device text not null check (device ~ '^[a-z0-9]{8,64}$'),
  day date not null,
  n int not null default 0,
  primary key (device, day)
);
alter table public.ai_usage_device enable row level security;

-- shortcut: เช็กเพดานรวมก่อน insert ไม่ได้ล็อก คำขอพร้อมกันอาจเกินเพดานไปไม่กี่ข้อ, ทำล็อกเมื่อเปิดให้คนทั่วไปใช้
create function public.reserve_device_call(p_device text, p_day date, p_limit int, p_total int) returns boolean
language plpgsql security definer set search_path = '' as $$
declare ok boolean;
begin
  if (select coalesce(sum(n), 0) from public.ai_usage_device where day = p_day) >= p_total then return false; end if;
  insert into public.ai_usage_device (device, day, n) values (p_device, p_day, 1)
  on conflict (device, day) do update set n = public.ai_usage_device.n + 1 where public.ai_usage_device.n < p_limit
  returning true into ok;
  return coalesce(ok, false);
end $$;

create function public.refund_device_call(p_device text, p_day date) returns void
language sql security definer set search_path = '' as $$
  update public.ai_usage_device set n = greatest(n - 1, 0) where device = p_device and day = p_day;
$$;

revoke execute on function public.reserve_device_call(text, date, int, int) from public, anon, authenticated;
revoke execute on function public.refund_device_call(text, date) from public, anon, authenticated;
grant execute on function public.reserve_device_call(text, date, int, int) to service_role;
grant execute on function public.refund_device_call(text, date) to service_role;
