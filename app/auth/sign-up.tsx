import { useState } from 'react';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useSignUp } from '@clerk/clerk-expo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router, Link } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { Ionicons } from '@expo/vector-icons';

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
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      await signUp!.create({ emailAddress: email, password });
      await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('/auth/verify-email');
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? 'Error al registrar');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-add-outline" size={40} color={colors.primary} />
        </View>
        <ThemedText type="title" style={styles.brand}>Crear cuenta</ThemedText>
        <ThemedText style={styles.subtitle}>Únete a Bienestar Digital</ThemedText>
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
          theme={{ roundness: 12 }}
          right={email ? <TextInput.Icon icon="check-circle" color={colors.primary} /> : undefined}
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
        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          style={styles.input}
          mode="outlined"
          outlineColor={colors.grayLight}
          activeOutlineColor={colors.primary}
          theme={{ roundness: 12 }}
          right={<TextInput.Icon icon={showConfirm ? 'eye-off' : 'eye'} onPress={() => setShowConfirm((v) => !v)} />}
        />
        {error && <HelperText type="error" visible>{error}</HelperText>}
        
        <Button 
          mode="contained" 
          onPress={onSubmit} 
          style={styles.button}
          contentStyle={{ height: 50 }}
          buttonColor={colors.primary}
        >
          Continuar
        </Button>

        <View style={styles.footer}>
          <ThemedText>¿Ya tienes cuenta? </ThemedText>
          <Link href="/auth/sign-in">
            <ThemedText type="link" style={{ color: colors.primary, fontWeight: '600' }}>Inicia sesión</ThemedText>
          </Link>
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
  footer: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
