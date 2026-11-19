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
| `supabase/functions/update-prices` | งานรายวัน ให้ Claude ค้นราคาจากเว็บแล้วบันทึก |

โมเดลที่ใช้คือ `claude-opus-5-5` ตั้งไว้ที่ `supabase/functions/_shared/common.ts`

ตั้งค่าครั้งแรก:

1. สร้างโปรเจกต์ Supabase แล้วรัน migration ทั้งสองไฟล์ (ไฟล์ cron ต้องสร้าง Vault secret `project_url` และ `cron_secret` ก่อน ดูหัวไฟล์)
2. ตั้ง secret ของ Edge Functions: `ANTHROPIC_API_KEY` และ `CRON_SECRET`
3. Deploy ฟังก์ชันทั้งสี่ (`update-prices` ปิด verify JWT เพราะตรวจด้วย `CRON_SECRET` เอง)
4. Auth > Providers: เปิด Google และ Apple แล้วเพิ่ม `chefjiw://auth` ใน Redirect URLs (LINE ต้องตั้งเป็น custom OIDC provider ภายหลัง)
5. คัดลอก `.env.example` เป็น `.env` แล้วใส่ URL กับ publishable key

ยังไม่ได้ทำ: ระบบซื้อในแอป (App Store / Google Play) ปุ่มสมัครสมาชิกจึงยังขึ้นว่ายังไม่ได้เชื่อมระบบ สถานะสมาชิกอ่านจาก `profiles.member` ซึ่งต้องให้ฝั่งเซิร์ฟเวอร์เป็นคนตั้งหลังตรวจใบเสร็จ

ทดสอบฝั่ง edge function: `cd supabase/functions && deno test --allow-env _shared/common.test.ts`

## สถานะ

ทำแล้ว: ทุกหน้าจอในต้นแบบที่อยู่ใน v1 พร้อมโหมดมืดและสองภาษา

ยังไม่ทำ: deploy backend ขึ้นโปรเจกต์ Supabase จริง ระบบซื้อในแอป และแอนิเมชันมาสคอต ราคาสมาชิกยังเป็นช่องว่าง

สูตรทั้งหมดยังไม่ได้ลองทำจริง ต้องลองก่อนเปิดให้คนใช้
