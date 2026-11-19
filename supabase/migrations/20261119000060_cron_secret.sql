-- secret ของงาน cron สร้างในฐานข้อมูลเอง ไม่ต้องคัดลอกไปที่ไหน update-prices ตรวจผ่านฟังก์ชันนี้
select vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'cron_secret')
where not exists (select 1 from vault.secrets where name = 'cron_secret');

create or replace function public.check_cron_secret(p text) returns boolean
language sql security definer set search_path = '' as $$
  select exists (select 1 from vault.decrypted_secrets where name = 'cron_secret' and decrypted_secret = p);
$$;
revoke execute on function public.check_cron_secret(text) from public, anon, authenticated;
grant execute on function public.check_cron_secret(text) to service_role;
