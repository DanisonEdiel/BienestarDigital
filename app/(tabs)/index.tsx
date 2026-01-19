import { DaySelector } from '@/components/Home/DaySelector';
import { ProgramCard } from '@/components/Home/ProgramCard';
import { StatCard } from '@/components/Home/StatCard';
import { ThemedView } from '@/components/themed-view';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { typography } from '@/constants/theme/typography';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useDigitalWellbeing } from '@/hooks/useDigitalWellbeing';
import { useEmotionSummary, useScreenTimeSummary } from '@/hooks/useMetrics';
import { router } from 'expo-router';

// Datos dummy para simular la UI de Figma
const DAYS = [
  { label: 'Dom', number: '30', active: true },
  { label: 'Lun', number: '1' },
  { label: 'Mar', number: '2' },
  { label: 'Mie', number: '3' },
  { label: 'Jue', number: '4' },
];

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const { metrics, appUsage, hasPermission, hasAccessibility, requestPermission, requestAccessibility } = useDigitalWellbeing();
  const { data: screenSummary } = useScreenTimeSummary();
  const { data: emotionSummary } = useEmotionSummary();
  
  if (!isLoaded) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.firstName || 'Usuario'}</Text>
          <Text style={styles.subtitle}>Desconecta para conectar</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
           <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Selector de días */}
      <DaySelector days={DAYS} />

      {/* Permisos Warning: Uso de Apps */}
      {Platform.OS === 'android' && !hasPermission && (
        <View style={styles.permissionAlert}>
            <Text style={styles.permissionText}>⚠️ Se requiere permiso de Uso de Apps para medir el tiempo.</Text>
            <Button mode="contained" onPress={requestPermission} style={styles.permissionBtn} buttonColor="#856404">
                Activar Permiso de Uso
            </Button>
        </View>
      )}

      {/* Permisos Warning: Accesibilidad */}
      {Platform.OS === 'android' && !hasAccessibility && (
        <View style={[styles.permissionAlert, { backgroundColor: '#F8D7DA', borderColor: '#F5C6CB' }]}>
            <Text style={[styles.permissionText, { color: '#721C24' }]}>⚠️ Activa el Servicio de Accesibilidad para contar taps y scrolls.</Text>
            <Button mode="contained" onPress={requestAccessibility} style={styles.permissionBtn} buttonColor="#721C24">
                Activar Accesibilidad
            </Button>
        </View>
      )}

      {/* Estadísticas Dummy (Originales) */}
      <Text style={styles.sectionTitle}>Análisis de Bienestar</Text>
      <View style={styles.statsRow}>
        <StatCard
          title="Estrés"
          subtitle="Últimas 24 horas"
          status={emotionSummary?.label ?? 'Alto'}
        >
          {/* Aquí iría un gráfico real, usamos placeholders visuales */}
          <View style={styles.chartPlaceholder}>
            {[40, 60, 30, 80, 50, 70, 40].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h, backgroundColor: i % 2 === 0 ? '#BFD6FE' : '#5B8DEF' }]} />
            ))}
          </View>
        </StatCard>
        
        <StatCard
          title="Tiempo uso"
          subtitle="Hoy"
          value={
            screenSummary && screenSummary.dailyLimitSeconds > 0
              ? `${Math.max(0, Math.round(screenSummary.remainingSeconds / 60))} minutos restantes`
              : 'Sin límite configurado'
          }
        >
          <View style={styles.circleChart}>
            <Text style={styles.circleText}>
              {screenSummary && screenSummary.dailyLimitSeconds > 0
                ? `${screenSummary.usedPercent}%`
                : '--'}
            </Text>
          </View>
        </StatCard>
      </View>

      {/* Programas */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Programas</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Ver más</Text>
        </TouchableOpacity>
      </View>
      
      <ProgramCard title="Almuerzo con familia" time="13h00 - 14h00" />
      <ProgramCard title="Lectura matutina" time="07h00 - 07h30" />

    </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/assistant')}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scroll: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.title,
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  notificationBtn: {
    padding: spacing.xs,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  circleChart: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#E0EBFF',
    borderLeftColor: '#5B8DEF',
    borderTopColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  metricText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4
  },
  permissionAlert: {
      backgroundColor: '#FFF3CD',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#FFEEBA'
  },
  permissionText: {
      color: '#856404',
      fontSize: 12,
      marginBottom: 5
  },
  permissionBtn: {
      marginTop: 5
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
