import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput, Checkbox } from 'react-native-paper';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
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
      <LinearGradient colors={["#a74949ff", "#112f44ff"]} style={styles.header}>
        <ThemedText type="title" style={styles.brand}>EcuDiesel</ThemedText>
        <ThemedText style={styles.subtitle}>Bienvenido de nuevo</ThemedText>
      </LinearGradient>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
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

      <ThemedText style={styles.signInWith}>Ingresa con</ThemedText>
      <Button mode="outlined" icon={() => <Ionicons name="logo-google" size={20} />} onPress={async () => {
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { paddingVertical: 32, alignItems: 'center', borderRadius: 12, marginBottom: 16 },
  brand: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: 6 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  remember: { marginLeft: 4 },
  forgot: { marginRight: 4 },
  signInWith: { textAlign: 'center', marginTop: 24, marginBottom: 8 },
  socialBtn: { alignSelf: 'center', borderRadius: 8, width: 240 },
});