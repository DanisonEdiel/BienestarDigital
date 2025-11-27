import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useSignUp } from '@clerk/clerk-expo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';

export default function VerifyEmailScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
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
      <ThemedText type="title">Verifica tu email</ThemedText>
      <TextInput label="Código" value={code} onChangeText={setCode} keyboardType="number-pad" style={styles.input} />
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
});