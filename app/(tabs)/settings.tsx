import { GradientButton } from '@/components/ui/GradientButton';
import { spacing } from '@/constants/theme/spacing';
import { api } from '@/lib/api';
import { useAuth, useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { SegmentedButtons, Snackbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeMode, setThemeMode, colorScheme } = useThemeContext();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Ajustes</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Límites */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Límites diarios de pantalla</Text>
          
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Tiempo límite total</Text>
          
          <TouchableOpacity 
            style={[styles.timeSelector, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }]} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={[styles.timeSelectorText, { color: theme.colors.onSurface }]}>
              {limitTime.getHours()}h {limitTime.getMinutes().toString().padStart(2, '0')}m
            </Text>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={limitTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onTimeChange}
              textColor={theme.colors.onSurface}
            />
          )}

          <View style={{ height: spacing.lg }} />

          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Nivel de restricción</Text>
          <SegmentedButtons
            value={strictness}
            onValueChange={setStrictness}
            buttons={[
              {
                value: 'Estricto',
                label: 'Estricto',
                style: strictness === 'Estricto' ? { backgroundColor: theme.colors.secondaryContainer } : {},
                labelStyle: { color: strictness === 'Estricto' ? theme.colors.onSecondaryContainer : theme.colors.onSurface },
              },
              {
                value: 'Flexible',
                label: 'Flexible',
                style: strictness === 'Flexible' ? { backgroundColor: theme.colors.secondaryContainer } : {},
                labelStyle: { color: strictness === 'Flexible' ? theme.colors.onSecondaryContainer : theme.colors.onSurface },
              },
            ]}
            style={styles.segmentedButton}
            theme={{ colors: { secondaryContainer: theme.colors.secondaryContainer, onSecondaryContainer: theme.colors.onSecondaryContainer } }}
          />
        </View>

        {/* Apariencia */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Apariencia</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.label, { color: theme.colors.onSurface, marginBottom: 0 }]}>Modo oscuro</Text>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
              trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
              thumbColor={colorScheme === 'dark' ? theme.colors.onPrimary : theme.colors.outline}
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <GradientButton
          title="Guardar cambios"
          onPress={handleSave}
        />

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.signOutText, { color: theme.colors.error }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary, marginBottom: 20 }}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
          textColor: theme.colors.onPrimary,
        }}
      >
        <Text style={{ color: theme.colors.onPrimary }}>Cambios guardados correctamente</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
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
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeSelectorText: {
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '500',
  },
});
