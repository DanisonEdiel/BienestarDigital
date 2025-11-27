import { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, TextInput, Checkbox } from 'react-native-paper';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { signInStyles as styles } from '@/styles/auth';
import { Gradients } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onSubmit = async () => {
    try {
      setError(null);
      if (!isLoaded) return;
      const res = await signIn!.create({ identifier: email, password });
      await setActive!({ session: res.createdSessionId });
      router.replace('/(drawer)/stats');
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? 'Error al iniciar sesión');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={colorScheme === 'dark' ? Gradients.headerDark : Gradients.headerLight} style={styles.header}>
        <ThemedText type="title" style={styles.brand}>EcuDiesel</ThemedText>
        <ThemedText style={styles.subtitle}>Bienvenido de nuevo</ThemedText>
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
        {error && <HelperText type="error" visible>{error}</HelperText>}

        <View style={styles.row}>
          <Checkbox status={remember ? 'checked' : 'unchecked'} onPress={() => setRemember((v) => !v)} />
          <ThemedText style={styles.remember}>Recordarme</ThemedText>
          <View style={{ flex: 1 }} />
          <Link href="/auth/verify-email" style={styles.forgot}>
            <ThemedText type="link">¿Olvidaste la contraseña?</ThemedText>
          </Link>
        </View>

        <Button mode="contained" onPress={onSubmit} style={styles.button}>
          Iniciar sesión
        </Button>

        <Link href="/auth/sign-up" style={{ marginTop: 16 }}>
          <ThemedText type="link">Crear cuenta</ThemedText>
        </Link>
      </LinearGradient>

      <ThemedText style={styles.signInWith}>Ingresa con</ThemedText>
      <Button mode="contained-tonal" icon={() => <Ionicons name="logo-google" size={20} />} onPress={async () => {
        try {
          setError(null);
          const redirectUrl = Linking.createURL('/oauth-native-callback');
          const { createdSessionId, setActive, signIn, signUp } = await startOAuthFlow({ redirectUrl });
          if (createdSessionId) {
            await setActive!({ session: createdSessionId });
            router.replace('/(drawer)/stats');
          } else if (signIn?.createdSessionId) {
            await setActive!({ session: signIn.createdSessionId });
            router.replace('/(drawer)/stats');
          } else if (signUp?.createdSessionId) {
            await setActive!({ session: signUp.createdSessionId });
            router.replace('/(drawer)/stats');
          }
        } catch (e: any) {
          setError(e?.errors?.[0]?.message ?? 'No se pudo iniciar con Google');
        }
      }} style={styles.socialBtn}>
        Google
      </Button>
    </ThemedView>
  );
}