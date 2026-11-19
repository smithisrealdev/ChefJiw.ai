-- trigger function ไม่ควรถูกเรียกผ่าน REST API
revoke execute on function public.handle_new_user() from public, anon, authenticated;
