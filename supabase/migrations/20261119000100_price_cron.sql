-- เรียก update-prices ทุกวัน 06:00 เวลาไทย (23:00 UTC)
-- ก่อนรัน migration นี้ ให้เก็บ URL โปรเจกต์ใน Vault (cron_secret สร้างใน migration 20261119000060 แล้ว):
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
create extension if not exists pg_cron schema pg_catalog;
create extension if not exists pg_net schema extensions;

select cron.schedule('update-prices-daily', '0 23 * * *', $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/update-prices',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
$$);
