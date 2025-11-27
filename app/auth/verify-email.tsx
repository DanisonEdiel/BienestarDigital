import { useState } from 'react';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useSignUp } from '@clerk/clerk-expo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Gradients } from '@/constants/theme';
import { signInStyles as styles } from '@/styles/auth';

export default function VerifyEmailScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const colorScheme = useColorScheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setError(null);
      if (!isLoaded) return;
      const res = await signUp!.attemptEmailAddressVerification({ code });
      await setActive!({ session: res.createdSessionId });
      router.replace('/(drawer)/stats');
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? 'Código inválido');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={colorScheme === 'dark' ? Gradients.headerDark : Gradients.headerLight} style={styles.header}>
        <ThemedText type="title" style={styles.brand}>EcuDiesel</ThemedText>
        <ThemedText style={styles.subtitle}>Verifica tu email</ThemedText>
      </LinearGradient>
      <LinearGradient colors={colorScheme === 'dark' ? Gradients.cardDark : Gradients.cardLight} style={styles.card}>
        <TextInput label="Código" value={code} onChangeText={setCode} keyboardType="number-pad" style={styles.input} mode="outlined" />
        {error && <HelperText type="error" visible>{error}</HelperText>}
        <Button mode="contained" onPress={onSubmit} style={styles.button}>Confirmar</Button>
        <Button mode="outlined" onPress={async () => {
          try {
            setError(null);
            if (!isLoaded) return;
            await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
          } catch (e: any) {
            setError(e?.errors?.[0]?.message ?? 'No se pudo reenviar el código');
          }
        }} style={styles.button}>Reenviar código</Button>
      </LinearGradient>
    </ThemedView>
  );
}