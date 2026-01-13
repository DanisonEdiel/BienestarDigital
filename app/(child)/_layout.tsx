import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useInteractionSync } from '@/hooks/useInteractionSync';

export default function ChildLayout() {
  useInteractionSync();
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="home" options={{ title: 'Bienestar Digital' }} />
    </Stack>
  );
}
