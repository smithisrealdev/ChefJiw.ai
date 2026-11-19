# ChefJiw.ai

แอปสอนทำอาหารทีละขั้น พร้อมเชฟช้างที่ตอบคำถามหน้าเตา สร้างด้วย Expo (React Native) และ Expo Router

## เริ่มใช้งาน

```bash
npm install
npx expo start
```

กด `i` เพื่อเปิด iOS simulator, `a` สำหรับ Android หรือสแกน QR ด้วย Expo Go

## คำสั่งตรวจ

```bash
npm run typecheck
npx expo lint
npm test
```

## โครงสร้าง

| ที่ | มีอะไร |
|---|---|
| `src/app/(tabs)/` | แถบล่าง 4 แท็บ: ร้าน สูตร ทำอาหาร ฉัน |
| `src/app/recipe/[id].tsx` | รายละเอียดสูตร เลือกตัวเลือก ปรับสูตร และวัตถุดิบ |
| `src/app/cook/[id].tsx` | โหมดทำอาหารเต็มจอ จับเวลา ถามเชฟ เหตุฉุกเฉิน และให้คะแนน |
| `src/data/recipes.ts` | ข้อมูลสูตรสองภาษาของกะเพราหมูสับไข่ดาวและไข่เจียวหมูสับ |
| `src/theme/tokens.ts` | สี ตัวอักษร ระยะ มุมโค้ง ของทั้งธีมสว่างและมืด |
| `src/app/onboarding.tsx` `login.tsx` `paywall.tsx` `market.tsx` | แนะนำแอปครั้งแรก เข้าสู่ระบบ สมัครสมาชิก ราคาตลาด |
| `src/lib/api.ts` | จุดเชื่อม backend จุดเดียว: ถาม AI คิดเมนู เช็กราคา เข้าสู่ระบบ ซื้อสมาชิก |
| `src/lib/` | การตั้งค่าที่บันทึกในเครื่อง ภาษาไทย/อังกฤษ สกุลเงินตามประเทศ โควตาคำถามฟรี |

## Backend (Supabase)

| ที่ | มีอะไร |
|---|---|
| `supabase/migrations/` | ตาราง `profiles` (สถานะสมาชิก) `ai_usage` (โควตารายวัน) `prices` (ราคารายวัน) และงาน cron อัปเดตราคา |
| `supabase/functions/ask` | ถามเชฟช้าง: ต้องเข้าสู่ระบบ ฟรีวันละ 3 คำถาม สมาชิกไม่จำกัด ล้มเหลวคืนสิทธิ์ |
| `supabase/functions/menus` | คิดเมนูจากของที่มี (นับรวมในโควตาเดียวกัน) |
| `supabase/functions/prices` | อ่านราคาล่าสุดของประเทศ |
| `supabase/functions/update-prices` | งานรายวัน ค้นราคาจากเว็บผ่านปลั๊กอิน web ของ OpenRouter แล้วบันทึก |

เรียกโมเดลผ่าน OpenRouter แยกตามงาน (ตั้งที่ `MODELS` ใน `supabase/functions/_shared/common.ts`): ถามเชฟใช้ GPT-6 Luna คิดเมนูใช้ Claude Haiku 5.5 อัปเดตราคาใช้ Claude Sonnet 5.5 แต่ละงานมีโมเดลสำรองให้ OpenRouter สลับเมื่อตัวหลักล่ม

โปรเจกต์จริง: `jqfjqsvpjzcktfrnvobo` (migration ทั้งหมด ฟังก์ชันทั้งสี่ และงาน cron รายวัน deploy แล้ว)

ที่เจ้าของโปรเจกต์ต้องตั้งเองใน Dashboard:

1. Edge Functions > Secrets: เพิ่ม `OPENROUTER_API_KEY` (ถ้าไม่มี ถามเชฟ คิดเมนู และอัปเดตราคา จะตอบ error)
2. Auth > Providers: เปิด Google และ Apple แล้วเพิ่ม `chefjiw://auth` ใน Auth > URL Configuration > Redirect URLs (LINE ต้องตั้งเป็น custom OIDC provider ภายหลัง)

ตั้งโปรเจกต์ใหม่จากศูนย์: รัน migration ตามลำดับ (ก่อนไฟล์ cron ให้เก็บ `project_url` ใน Vault ดูหัวไฟล์) deploy ฟังก์ชันทั้งสี่ (`update-prices` ปิด verify JWT เพราะตรวจ secret จาก Vault เอง) แล้วทำสองข้อบน

แอป: คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ URL กับ publishable key (ค่าทั้งสองเป็นค่าสาธารณะ)

ยังไม่ได้ทำ: ระบบซื้อในแอป (App Store / Google Play) ปุ่มสมัครสมาชิกจึงยังขึ้นว่ายังไม่ได้เชื่อมระบบ สถานะสมาชิกอ่านจาก `profiles.member` ซึ่งต้องให้ฝั่งเซิร์ฟเวอร์เป็นคนตั้งหลังตรวจใบเสร็จ

ทดสอบฝั่ง edge function: `cd supabase/functions && SUPABASE_URL=http://x SUPABASE_SERVICE_ROLE_KEY=x deno test --allow-env _shared/common.test.ts`

## สถานะ

ทำแล้ว: ทุกหน้าจอในต้นแบบที่อยู่ใน v1 พร้อมโหมดมืดและสองภาษา

**โหมดเบต้าเปิดอยู่** (`BETA` ใน `src/lib/beta.ts`) ตามข้อเสนอของบอร์ดใน `founder/board.md`: แอปเหลือแค่โหมดทำอาหารกับจานที่ทำเสร็จแล้ว ในประเทศไทย ซ่อนเช็กราคา ญี่ปุ่นกับอเมริกา คิดเมนูจากของที่มี ตัวกรอง และจานที่ยังไม่เสร็จ โค้ดทั้งหมดยังอยู่ เปลี่ยนเป็น `false` เพื่อเปิดกลับ

ยังไม่ทำ: ระบบซื้อในแอป และแอนิเมชันมาสคอต ราคาสมาชิกยังเป็นช่องว่าง

สูตรทั้งหมดยังไม่ได้ลองทำจริง ต้องลองก่อนเปิดให้คนใช้
