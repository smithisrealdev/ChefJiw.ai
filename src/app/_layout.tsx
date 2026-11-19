import { IBMPlexSansThaiLooped_400Regular, IBMPlexSansThaiLooped_600SemiBold, IBMPlexSansThaiLooped_700Bold } from '@expo-google-fonts/ibm-plex-sans-thai-looped';
import { Mali_600SemiBold, Mali_700Bold } from '@expo-google-fonts/mali';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import Stack from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { SettingsProvider, useSettings } from '@/lib/settings';

SplashScreen.preventAutoHideAsync();

function Root() {
  const { ready, isDark, colors } = useSettings();
  const [fontsLoaded, fontError] = useFonts({ Mali_600SemiBold, Mali_700Bold, IBMPlexSansThaiLooped_400Regular, IBMPlexSansThaiLooped_600SemiBold, IBMPlexSansThaiLooped_700Bold });
  // ฟอนต์โหลดไม่ได้ก็เปิดแอปด้วยฟอนต์ระบบ ดีกว่าค้างที่หน้าเปิด
  const show = ready && (fontsLoaded || !!fontError);
  useEffect(() => { if (show) SplashScreen.hideAsync(); }, [show]);
  if (!show) return null;

  const base = isDark ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider value={{ ...base, colors: { ...base.colors, background: colors.bg, card: colors.surface, text: colors.ink, border: colors.line } }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe/[id]" />
        {/* หน้าทำอาหารเต็มจอ ปิดการปัดย้อนกลับ ต้องออกผ่านปุ่มที่ถามยืนยัน */}
        <Stack.Screen name="cook/[id]" options={{ gestureEnabled: false, animation: 'slide_from_bottom' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Root />
    </SettingsProvider>
  );
}
