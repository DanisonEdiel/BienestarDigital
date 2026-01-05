import { ThemedText } from '@/components/themed-text';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { useFamilyLinkMutation } from '@/hooks/family/useFamilyLinkMutation';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

interface AddChildFormProps {
  onSuccess: (email: string) => void;
  onCancel: () => void;
}

export function AddChildForm({ onSuccess, onCancel }: AddChildFormProps) {
  const { user } = useUser();
  const linkMutation = useFamilyLinkMutation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) {
      setError('Por favor ingresa un correo electrónico');
      return;
    }
    if (!email.includes('@')) {
      setError('Ingresa un correo válido');
      return;
    }

    setError(null);
    
    try {
      if (!user?.id) {
        throw new Error('No se pudo identificar al usuario actual');
      }

      await linkMutation.mutateAsync({ childEmail: email });
      onSuccess(email);
    } catch (err: any) {
      console.error('Error linking child:', err);
      // Extract error message from backend response if available
      const message = err.response?.data?.message 
        ? (Array.isArray(err.response.data.message) 
            ? err.response.data.message.join(', ') 
            : err.response.data.message)
        : 'Ocurrió un error al vincular la cuenta. Inténtalo de nuevo.';
      setError(message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="link-outline" size={40} color={colors.primary} />
        </View>
        <ThemedText type="title" style={styles.title}>Vincular cuenta</ThemedText>
        <ThemedText style={styles.subtitle}>
          Ingresa el correo electrónico de la cuenta de tu hijo/a para vincularla.
        </ThemedText>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Email del hijo/a"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          outlineColor={colors.grayLight}
          activeOutlineColor={colors.primary}
          style={styles.input}
          theme={{ roundness: 12 }}
          left={<TextInput.Icon icon="account-child-circle" color={colors.textSecondary} />}
        />
        
        {error && <HelperText type="error" visible>{error}</HelperText>}

        <Button 
          mode="contained" 
          onPress={handleSubmit}
          loading={linkMutation.isPending}
          disabled={linkMutation.isPending}
          style={styles.button}
          contentStyle={{ height: 50 }}
          buttonColor={colors.primary}
        >
          Vincular
        </Button>

        <Button 
          mode="text" 
          onPress={onCancel}
          style={styles.cancelButton}
          textColor={colors.textSecondary}
        >
          Cancelar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  title: {
    fontSize: 24,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.background,
    marginBottom: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
    borderRadius: 12,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});
