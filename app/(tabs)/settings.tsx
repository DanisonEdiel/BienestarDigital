import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClerk, useUser, useAuth } from '@clerk/clerk-expo';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { GradientButton } from '@/components/ui/GradientButton';
import { api } from '@/lib/api';
import { Snackbar, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsScreen() {
  const [limitTime, setLimitTime] = useState(() => {
    const d = new Date();
    d.setHours(3);
    d.setMinutes(20);
    d.setSeconds(0);
    return d;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [strictness, setStrictness] = useState('Estricto');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  
  // Ref to track if we have already loaded config from server to avoid overwriting user edits on re-renders
  const isLoadedRef = useRef(false);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!user || isLoadedRef.current) return;
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
          
          const newTime = new Date();
          newTime.setHours(h);
          newTime.setMinutes(m);
          newTime.setSeconds(0);
          setLimitTime(newTime);

          if (data.strictness === 'strict') {
            setStrictness('Estricto');
          } else if (data.strictness === 'flexible') {
            setStrictness('Flexible');
          }
          isLoadedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to load screen time configuration', error);
      }
    };
    fetchConfig();
  }, [user, getToken]);

  const onTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || limitTime;
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    setLimitTime(currentDate);
  };

  const handleSave = async () => {
    if (!user) return;
    
    const h = limitTime.getHours();
    const m = limitTime.getMinutes();
    const totalSeconds = (h * 3600) + (m * 60);

    if (totalSeconds <= 0) {
      Alert.alert('Error', 'El límite de tiempo debe ser mayor a 0');
      return;
    }

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await api.post('/metrics/screen-time-limit', {
        dailyLimitSeconds: totalSeconds,
        strictness: strictness === 'Estricto' ? 'strict' : 'flexible',
      }, {
        params: { clerkId: user.id },
        headers,
      });

      await queryClient.invalidateQueries({ queryKey: ['screen-time-summary'] });

      setSnackbarVisible(true);
    } catch (error) {
      console.error('Failed to save screen time limit', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajustes</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Límites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Límites diarios de pantalla</Text>
          
          <Text style={styles.label}>Tiempo límite total</Text>
          
          <TouchableOpacity 
            style={styles.timeSelector} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeSelectorText}>
              {limitTime.getHours()}h {limitTime.getMinutes().toString().padStart(2, '0')}m
            </Text>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={limitTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onTimeChange}
            />
          )}

          <View style={{ height: spacing.lg }} />

          <Text style={styles.label}>Nivel de restricción</Text>
          <SegmentedButtons
            value={strictness}
            onValueChange={setStrictness}
            buttons={[
              {
                value: 'Estricto',
                label: 'Estricto',
                style: strictness === 'Estricto' ? { backgroundColor: '#E8EAF6' } : {},
              },
              {
                value: 'Flexible',
                label: 'Flexible',
                style: strictness === 'Flexible' ? { backgroundColor: '#E8EAF6' } : {},
              },
            ]}
            style={styles.segmentedButton}
            theme={{ colors: { secondaryContainer: colors.primary + '20', onSecondaryContainer: colors.primary } }}
          />
        </View>

        <View style={styles.spacer} />

        <GradientButton
          title="Guardar cambios"
          onPress={handleSave}
        />

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: colors.primary, marginBottom: 20 }}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
          textColor: '#FFFFFF',
        }}
      >
        Cambios guardados correctamente
      </Snackbar>
    </View>
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
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  timeSelectorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  segmentedButton: {
    marginTop: spacing.sm,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  signOutText: {
    marginLeft: spacing.sm,
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
});
