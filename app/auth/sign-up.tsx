import { useState } from 'react';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useSignUp } from '@clerk/clerk-expo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Gradients } from '@/constants/theme';
import { signInStyles as styles } from '@/styles/auth';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      <LinearGradient colors={colorScheme === 'dark' ? Gradients.headerDark : Gradients.headerLight} style={styles.header}>
        <ThemedText type="title" style={styles.brand}>EcuDiesel</ThemedText>
        <ThemedText style={styles.subtitle}>Crear cuenta</ThemedText>
      </LinearGradient>
      <LinearGradient colors={colorScheme === 'dark' ? Gradients.cardDark : Gradients.cardLight} style={styles.card}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          right={email ? <TextInput.Icon icon="check-circle" /> : undefined}
        />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword((v) => !v)} />}
        />
        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          style={styles.input}
          mode="outlined"
          right={<TextInput.Icon icon={showConfirm ? 'eye-off' : 'eye'} onPress={() => setShowConfirm((v) => !v)} />}
        />
        {error && <HelperText type="error" visible>{error}</HelperText>}
        <Button mode="contained" onPress={onSubmit} style={styles.button}>Continuar</Button>
        <Link href="/auth/sign-in" style={{ marginTop: 16 }}>
          <ThemedText type="link">Ya tengo cuenta</ThemedText>
        </Link>
      </LinearGradient>
    </ThemedView>
  );
}