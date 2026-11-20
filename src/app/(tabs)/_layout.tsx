import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { useSettings } from '@/lib/settings';
import { fonts, radius } from '@/theme/tokens';

const TABS: { name: string; key: 'tab.home' | 'tab.recipes' | 'tab.cook' | 'tab.me'; icon: IconName }[] = [
  { name: 'index', key: 'tab.home', icon: 'home' },
  { name: 'recipes', key: 'tab.recipes', icon: 'book' },
  { name: 'cook', key: 'tab.cook', icon: 'pot' },
  { name: 'me', key: 'tab.me', icon: 'user' },
];

export default function TabLayout() {
  const { colors, t, onboarded } = useSettings();
  useEffect(() => { if (!onboarded) router.replace('/onboarding'); }, [onboarded]);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line, height: 76, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 12 },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name}
          options={{
            title: t(tab.key),
            tabBarIcon: ({ focused }) => (
              <View style={{ width: 52, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? colors.surfaceSoft : 'transparent' }}>
                <Icon name={tab.icon} color={focused ? colors.ink : colors.muted} />
              </View>
            ),
          }} />
      ))}
    </Tabs>
  );
}
