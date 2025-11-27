import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function DrawerLayout() {
  return (
    <>
      <SignedIn>
        <Drawer
          screenOptions={{
            headerShown: true,
          }}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              title: 'Inicio',
              drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
            }}
          />
          <Drawer.Screen
            name="stats"
            options={{
              title: 'Estadísticas',
              drawerIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} />,
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              title: 'Ajustes',
              drawerIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
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