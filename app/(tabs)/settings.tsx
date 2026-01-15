import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClerk } from '@clerk/clerk-expo';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { TimeLimitInput } from '@/components/Settings/TimeLimitInput';
import { StrictnessSelector } from '@/components/Settings/StrictnessSelector';
import { GradientButton } from '@/components/ui/GradientButton';

export default function SettingsScreen() {
  const [hours, setHours] = useState('3');
  const [minutes, setMinutes] = useState('20');
  const [strictness, setStrictness] = useState('Estricto');
  const { signOut } = useClerk();

  const handleSave = () => {
    // Save logic here
    console.log('Settings saved:', { hours, minutes, strictness });
    router.back();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth/sign-in');
    } catch (err) {
      console.error('Error signing out:', err);
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes de Límites</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Límites diarios de pantalla</Text>
        <Text style={styles.label}>Tiempo saludable diario</Text>
        <TimeLimitInput 
          hours={hours} 
          minutes={minutes} 
          onHoursChange={setHours} 
          onMinutesChange={setMinutes} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>¿Qué tan estricto quieres que sea?</Text>
        <StrictnessSelector 
          value={strictness} 
          onPress={() => {
            // Placeholder for dropdown logic
            setStrictness(strictness === 'Estricto' ? 'Flexible' : 'Estricto');
          }} 
        />
      </View>

      <View style={styles.spacer} />

      <GradientButton title="Guardar Configuración" onPress={handleSave} />

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.signOutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});
