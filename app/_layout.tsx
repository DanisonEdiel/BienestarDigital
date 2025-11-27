import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Colors, Palette } from '@/constants/theme';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {};

export default function RootLayout() {
  WebBrowser.maybeCompleteAuthSession();
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 60_000,
      },
    },
  });

  const base = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const paperTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: Palette.primary,
      background: colorScheme === 'dark' ? Palette.backgroundDark : Palette.backgroundLight,
      surface: colorScheme === 'dark' ? Palette.surfaceDark : Palette.surfaceLight,
      onSurface: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
    },
  };

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      tokenCache={{
        getToken: (key) => SecureStore.getItemAsync(key),
        saveToken: (key, value) => SecureStore.setItemAsync(key, value ?? ''),
      }}
    >
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={paperTheme}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack initialRouteName="index">
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </PaperProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
