import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { useBootstrapMutation } from '@/hooks/auth/useBootstrapMutation';
import { useUserStore } from '@/store/userStore';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const setRole = useUserStore((state) => state.setRole);
  const { mutateAsync: bootstrap, isPending } = useBootstrapMutation();

  useEffect(() => {
    if (isLoaded && user) {
        bootstrap({ clerkId: user.id })
            .then((data) => {
                if (data.role && data.role !== 'new_user') {
                    setRole(data.role);
                    if (data.role === 'parent') router.replace('/(parent)/home');
                    else if (data.role === 'child') router.replace('/(child)/home');
                }
            })
            .catch((err) => console.log('Check role failed', err));
    }
  }, [isLoaded, user]);

  const handleSelectRole = async (role: 'parent' | 'child') => {
    try {
        if (user) {
            await bootstrap({ clerkId: user.id, role });
        }
        setRole(role);
        if (role === 'parent') {
          router.replace('/(parent)/home');
        } else {
          router.replace('/(child)/home');
        }
    } catch (error) {
        console.error('Error setting role:', error);
        // Proceed anyway locally
        setRole(role);
        if (role === 'parent') router.replace('/(parent)/home');
        else router.replace('/(child)/home');
    }
  };

  if (!isLoaded || isPending) {
     return (
         <ThemedView style={[styles.container, styles.centered]}>
             <ActivityIndicator size="large" color={colors.primary} />
         </ThemedView>
     );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          ¿Cómo usarás esta app?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Selecciona tu rol para configurar la experiencia adecuada.
        </ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectRole('parent')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#E0EBFF' }]}>
            <Ionicons name="shield-checkmark-outline" size={32} color={colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <ThemedText type="subtitle">Supervisar</ThemedText>
            <ThemedText style={styles.description}>
              Soy padre, madre o tutor y quiero gestionar el bienestar digital.
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.grayMedium} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectRole('child')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#E0F7FA' }]}>
            <Ionicons name="happy-outline" size={32} color={colors.secondary} />
          </View>
          <View style={styles.textContainer}>
            <ThemedText type="subtitle">Ser supervisado</ThemedText>
            <ThemedText style={styles.description}>
              Este es mi dispositivo y quiero mejorar mis hábitos.
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.grayMedium} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  centered: {
      alignItems: 'center',
  },
  header: {
    marginBottom: spacing.xl * 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
  },
  optionsContainer: {
    gap: spacing.lg,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.grayLight,
    elevation: 2,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
