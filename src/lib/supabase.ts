import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// ยังไม่ตั้ง env ก็เปิดแอปได้ ทุกส่วนที่ต้องใช้ backend จะแสดงว่ายังไม่ได้เชื่อมระบบ
// shortcut: เก็บ session ใน AsyncStorage แบบไม่เข้ารหัสตามตัวอย่างของ Supabase, เปลี่ยนเป็น LargeSecureStore ก่อนเปิดให้คนใช้จริง
export const supabase = url && key
  ? createClient(url, key, {
      auth: {
        storage: typeof window === 'undefined' && Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// ต่ออายุ token เฉพาะตอนแอปอยู่หน้าจอ ตามที่ Supabase แนะนำสำหรับแอปมือถือ
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
