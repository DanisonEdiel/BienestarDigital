import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { colors } from '@/constants/theme/colors';
import { useInteractionSync } from '@/hooks/useInteractionSync';
import { useAppBootstrap } from '@/hooks/useAppBootstrap';

export default function TabsLayout() {
  useInteractionSync();
  useAppBootstrap();

  return (
    <>
      <SignedIn>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.white,
              borderTopWidth: 1,
              borderTopColor: colors.grayLight,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={28} />
              ),
            }}
          />
          <Tabs.Screen
            name="analytics"
            options={{
              title: 'Estadísticas',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={28} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Ajustes',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={28} />
              ),
            }}
          />
        </Tabs>
      </SignedIn>
      <SignedOut>
        <Redirect href="/auth/sign-in" />
      </SignedOut>
    </>
  );
}
