-- เบต้าซ่อนหน้าเช็กราคา (src/lib/beta.ts) จึงพักงานอัปเดตราคารายวันไว้ ไม่ให้เสียค่า AI กับหน้าที่ไม่มีใครเห็น
-- เปิดคืนเมื่อปิดเบต้า: select cron.alter_job((select jobid from cron.job where jobname = 'update-prices-daily'), active := true);
select cron.alter_job((select jobid from cron.job where jobname = 'update-prices-daily'), active := false);
