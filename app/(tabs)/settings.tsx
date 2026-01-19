import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClerk, useUser, useAuth } from '@clerk/clerk-expo';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { TimeLimitInput } from '@/components/Settings/TimeLimitInput';
import { StrictnessSelector } from '@/components/Settings/StrictnessSelector';
import { GradientButton } from '@/components/ui/GradientButton';
import { api } from '@/lib/api';

export default function SettingsScreen() {
  const [hours, setHours] = useState('3');
  const [minutes, setMinutes] = useState('20');
  const [strictness, setStrictness] = useState('Estricto');
  const { signOut } = useClerk();
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await api.get('/metrics/screen-time-summary', {
          params: { clerkId: user.id },
          headers,
        });
        const data = response.data;
        if (data && data.dailyLimitSeconds && data.dailyLimitSeconds > 0) {
          const totalMinutes = Math.round(data.dailyLimitSeconds / 60);
          const h = Math.floor(totalMinutes / 60);
          const m = totalMinutes % 60;
          setHours(String(h));
          setMinutes(String(m).padStart(1, '0'));
          if (data.strictness === 'strict') {
            setStrictness('Estricto');
          } else if (data.strictness === 'flexible') {
            setStrictness('Flexible');
          }
        }
      } catch (error) {
        console.error('Failed to load screen time configuration', error);
      }
    };
    fetchConfig();
  }, [user, getToken]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar la configuración');
      return;
    }

    const h = parseInt(hours || '0', 10);
    const m = parseInt(minutes || '0', 10);
    const totalMinutes = h * 60 + m;

    if (totalMinutes <= 0) {
      Alert.alert('Tiempo inválido', 'Configura al menos 1 minuto de tiempo saludable diario');
      return;
    }

    const dailyLimitSeconds = totalMinutes * 60;
    const strictnessKey = strictness === 'Estricto' ? 'strict' : 'flexible';

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.post(
        '/metrics/screen-time-limit',
        { dailyLimitSeconds, strictness: strictnessKey },
        {
          params: { clerkId: user.id },
          headers,
        },
      );
      router.back();
    } catch (error) {
      console.error('Failed to save screen time limit', error);
      Alert.alert('Error', 'No se pudo guardar la configuración. Intenta nuevamente.');
    }
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
