import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function DrawerLayout() {
  const theme = useTheme();

  return (
    <>
      <SignedIn>
        <Drawer
          screenOptions={{
            headerShown: false, // We are using custom headers in screens
            drawerActiveTintColor: theme.colors.primary,
            drawerInactiveTintColor: theme.colors.onSurfaceVariant,
            drawerStyle: {
              backgroundColor: theme.colors.surface,
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
