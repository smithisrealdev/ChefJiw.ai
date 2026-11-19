import { IBMPlexSansThaiLooped_400Regular, IBMPlexSansThaiLooped_600SemiBold, IBMPlexSansThaiLooped_700Bold } from '@expo-google-fonts/ibm-plex-sans-thai-looped';
import { Mitr_500Medium } from '@expo-google-fonts/mitr';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import Stack from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { SettingsProvider, useSettings } from '@/lib/settings';

SplashScreen.preventAutoHideAsync();
// ตัวจับเวลาของจานที่วางไว้ต้องเด้งเตือนแม้กำลังเปิดแอปทำจานอื่นอยู่ (แผนวันอาทิตย์ทำหลายจานสลับกัน)
if (Platform.OS !== 'web') Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });

function Root() {
  const { ready, isDark, colors } = useSettings();
  const [fontsLoaded, fontError] = useFonts({ Mitr_500Medium, IBMPlexSansThaiLooped_400Regular, IBMPlexSansThaiLooped_600SemiBold, IBMPlexSansThaiLooped_700Bold });
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
        <Stack.Screen name="login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
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
