import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useSignUp } from '@clerk/clerk-expo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router, Link } from 'expo-router';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setError(null);
      if (!isLoaded) return;
      await signUp!.create({ emailAddress: email, password });
      await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('/auth/verify-email');
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? 'Error al registrar');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Crear cuenta</ThemedText>
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
      <TextInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {error && <HelperText type="error" visible>{error}</HelperText>}
      <Button mode="contained" onPress={onSubmit} style={styles.button}>Continuar</Button>
      <Link href="/auth/sign-in" style={{ marginTop: 16 }}>
        <ThemedText type="link">Ya tengo cuenta</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
});