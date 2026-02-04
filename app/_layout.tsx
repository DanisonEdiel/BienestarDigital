import { Colors, Palette } from '@/constants/theme';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, configureFonts } from 'react-native-paper';
import 'react-native-reanimated';

import * as Notifications from 'expo-notifications';
import { AppThemeProvider, useThemeContext } from '@/context/ThemeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Configure notifications to show even when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {};

function RootLayoutNav() {
  const { colorScheme } = useThemeContext();
  
  const base = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  
  const fontConfig = {
    fontFamily: 'Poppins_400Regular',
  };

  const paperTheme = {
    ...base,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...base.colors,
      primary: Palette.primary,
      background: colorScheme === 'dark' ? Palette.backgroundDark : Palette.backgroundLight,
      surface: colorScheme === 'dark' ? Palette.surfaceDark : Palette.surfaceLight,
      onSurface: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="oauth-native-callback" options={{ headerShown: false }} />
          <Stack.Screen name="assistant" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  WebBrowser.maybeCompleteAuthSession();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 60_000,
      },
    },
  }));

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <RootLayoutNav />
          </AppThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
