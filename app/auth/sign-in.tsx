import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, HelperText, TextInput } from 'react-native-paper';

export default function SignInScreen() {
  const router = useRouter();
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

      if (res.status === 'complete') {
        await setActive!({ session: res.createdSessionId });
        router.replace('/(tabs)/analytics');
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? 'Error al iniciar sesión');
    }
  };


  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={40} color={colors.primary} />
        </View>
        <ThemedText type="title" style={styles.brand}>Bienestar Digital</ThemedText>
        <ThemedText style={styles.subtitle}>Tu bienestar es primero</ThemedText>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          outlineColor={colors.grayLight}
          activeOutlineColor={colors.primary}
          right={email ? <TextInput.Icon icon="check-circle" color={colors.primary} /> : undefined}
          theme={{ roundness: 12 }}
        />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          outlineColor={colors.grayLight}
          activeOutlineColor={colors.primary}
          theme={{ roundness: 12 }}
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword((v) => !v)} />}
        />
        {error && <HelperText type="error" visible>{error}</HelperText>}

        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <Checkbox.Android 
              status={remember ? 'checked' : 'unchecked'} 
              onPress={() => setRemember((v) => !v)} 
              color={colors.primary}
            />
            <ThemedText style={styles.remember}>Recordarme</ThemedText>
          </View>
          <Link href="/auth/verify-email" style={styles.forgot}>
            <ThemedText type="link" style={{ color: colors.primary }}>¿Olvidaste la contraseña?</ThemedText>
          </Link>
        </View>

        <Button 
          mode="contained" 
          onPress={onSubmit} 
          style={styles.button}
          contentStyle={{ height: 50 }}
          buttonColor={colors.primary}
        >
          Iniciar sesión
        </Button>

        <View style={styles.footer}>
          <ThemedText style={styles.signInWith}>O continúa con</ThemedText>
          
          <Button 
            mode="outlined" 
            icon={() => <Ionicons name="logo-google" size={20} color={colors.textPrimary} />} 
            onPress={async () => {
              try {
                setError(null);
                const redirectUrl = Linking.createURL('/oauth-native-callback');
                const { createdSessionId, setActive, signIn, signUp } = await startOAuthFlow({ redirectUrl });

                if (createdSessionId) {
                  await setActive!({ session: createdSessionId });
                  router.replace('/(tabs)/analytics');
                } else if (signIn?.createdSessionId) {
                  await setActive!({ session: signIn.createdSessionId });
                  router.replace('/(tabs)/analytics');
                } else if (signUp?.createdSessionId) {
                  await setActive!({ session: signUp.createdSessionId });
                  router.replace('/(tabs)/analytics');
                } else {
                   if (signUp && signUp.status === 'missing_requirements') {
                      const missing = signUp.missingFields?.join(', ') || '';
                      if (missing.includes('username')) {
                        setError('Error: Clerk requiere un "Username". Desactívalo en el Dashboard de Clerk (User & Authentication > Email, Phone, Username) o implementa el campo.');
                      } else {
                        setError(`Faltan datos para completar el registro: ${missing}`);
                      }
                    } else {
                      setError('No se pudo completar el inicio de sesión.');
                    }
                }
              } catch (e: any) {
                setError(e?.errors?.[0]?.message ?? 'No se pudo iniciar con Google');
              }
            }}
            style={styles.socialBtn}
            textColor={colors.textPrimary}
          >
            Google
          </Button>

          <View style={styles.createAccount}>
            <ThemedText>¿No tienes cuenta? </ThemedText>
            <Link href="/auth/sign-up">
              <ThemedText type="link" style={{ color: colors.primary, fontWeight: '600' }}>Crear cuenta</ThemedText>
            </Link>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: {
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.textSecondary 
  },
  formContainer: {
    flex: 1,
  },
  input: { 
    marginBottom: spacing.md, 
    backgroundColor: colors.background,
  },
  button: { 
    marginTop: spacing.md, 
    borderRadius: 12,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remember: { 
    fontSize: 14,
    color: colors.textSecondary 
  },
  forgot: { 
    // alignSelf: 'flex-end' 
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  signInWith: { 
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  socialBtn: { 
    width: '100%', 
    borderRadius: 12, 
    borderColor: '#E5E5EA',
    height: 50,
    justifyContent: 'center',
  },
  createAccount: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
});
