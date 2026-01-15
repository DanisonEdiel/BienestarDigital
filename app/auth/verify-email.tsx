import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { useBootstrapMutation } from '@/hooks/auth/useBootstrapMutation';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserStore } from '@/store/userStore';
import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const colorScheme = useColorScheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: bootstrap } = useBootstrapMutation();

  const setUserData = useUserStore((state) => state.setUserData);

  const handleBootstrap = async (clerkId: string) => {
    try {
      const data = await bootstrap({ clerkId });
      setUserData({
          domainUserId: data.id,
          clerkId: data.clerk_id,
          email: data.email
      });
      
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Bootstrap error:', e);
      router.replace('/(tabs)');
    }
  };

  const onSubmit = async () => {
    try {
      setError(null);
      if (!isLoaded) return;
      const res = await signUp!.attemptEmailAddressVerification({ code });
      await setActive!({ session: res.createdSessionId });
      
      if (res.createdUserId) {
        await handleBootstrap(res.createdUserId);
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? 'Código inválido');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-unread-outline" size={40} color={colors.primary} />
        </View>
        <ThemedText type="title" style={styles.brand}>Verifica tu email</ThemedText>
        <ThemedText style={styles.subtitle}>Ingresa el código enviado a tu correo</ThemedText>
      </View>

      <View style={styles.formContainer}>
        <TextInput 
          label="Código de verificación" 
          value={code} 
          onChangeText={setCode} 
          keyboardType="number-pad" 
          style={styles.input} 
          mode="outlined"
          outlineColor={colors.grayLight}
          activeOutlineColor={colors.primary}
          theme={{ roundness: 12 }} 
        />
        {error && <HelperText type="error" visible>{error}</HelperText>}
        
        <Button 
          mode="contained" 
          onPress={onSubmit} 
          style={styles.button}
          contentStyle={{ height: 50 }}
          buttonColor={colors.primary}
        >
          Verificar Cuenta
        </Button>
        
        <Button 
          mode="text" 
          onPress={async () => {
            try {
              setError(null);
              if (!isLoaded) return;
              await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
            } catch (e: any) {
              setError(e?.errors?.[0]?.message ?? 'No se pudo reenviar el código');
            }
          }} 
          style={styles.resendButton}
          textColor={colors.primary}
        >
          Reenviar código
        </Button>
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
    fontSize: 24, 
    fontWeight: '700', 
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.textSecondary,
    textAlign: 'center',
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
  resendButton: {
    marginTop: spacing.md,
  },
});
