import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { colors } from '@/constants/theme/colors';

export default function DrawerLayout() {
  return (
    <>
      <SignedIn>
        <Drawer
          screenOptions={{
            headerShown: false, // We are using custom headers in screens
            drawerActiveTintColor: colors.primary,
            drawerInactiveTintColor: colors.textSecondary,
            drawerStyle: {
              backgroundColor: colors.white,
            },
          }}
        >
          <Drawer.Screen
            name="stats"
            options={{
              title: 'Inicio',
              drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
            }}
          />
          <Drawer.Screen
            name="analytics"
            options={{
              title: 'Estadísticas',
              drawerIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" color={color} size={size} />,
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              title: 'Ajustes',
              drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
            }}
          />
        </Drawer>
      </SignedIn>
      <SignedOut>
        <Redirect href="/auth/sign-in" />
      </SignedOut>
    </>
  );
}
