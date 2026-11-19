import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// โทเคนเข้าสู่ระบบเก็บใน Keychain/Keystore ไม่ใช่ที่เก็บค่าตั้งค่าทั่วไป
// shortcut: บนเว็บไม่เก็บโทเคนข้ามการเปิดใหม่, ทำเมื่อจะเปิดแอปเวอร์ชันเว็บให้คนใช้จริง
const KEY = 'chefjiw.token';
let memory: string | null = null;

export async function saveToken(token: string | null) {
  memory = token;
  if (Platform.OS === 'web') return;
  if (token) await SecureStore.setItemAsync(KEY, token);
  else await SecureStore.deleteItemAsync(KEY);
}

export async function getToken() {
  if (memory || Platform.OS === 'web') return memory;
  memory = await SecureStore.getItemAsync(KEY);
  return memory;
}
