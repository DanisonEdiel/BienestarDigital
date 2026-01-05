import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ChildHomeScreen() {
  const { user } = useUser();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Hola, {user?.firstName || 'Campeón'}</ThemedText>
        <ThemedText style={styles.subtitle}>¡Que tengas un gran día!</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
            <Ionicons name="shield-checkmark" size={60} color={colors.primary} />
            <ThemedText type="subtitle" style={styles.statusTitle}>Todo está bien</ThemedText>
            <ThemedText style={styles.statusDesc}>Tu dispositivo está protegido.</ThemedText>
        </View>

        {/* Placeholder for more child features */}
        <View style={styles.infoCard}>
            <ThemedText style={styles.infoText}>
                Usa tu dispositivo con responsabilidad. Recuerda tomar descansos.
            </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  statusCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: '#E0EBFF',
    borderRadius: 20,
    width: '100%',
  },
  statusTitle: {
    marginTop: spacing.md,
    fontSize: 24,
  },
  statusDesc: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  infoCard: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.grayLight,
  },
  infoText: {
      textAlign: 'center',
      color: colors.textSecondary,
  }
});
