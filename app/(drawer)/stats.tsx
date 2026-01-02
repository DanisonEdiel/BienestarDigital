import { DaySelector } from '@/app/components/Home/DaySelector';
import { ProgramCard } from '@/app/components/Home/ProgramCard';
import { StatCard } from '@/app/components/Home/StatCard';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { typography } from '@/constants/theme/typography';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Datos dummy para simular la UI de Figma
const DAYS = [
  { label: 'Dom', number: '30', active: true },
  { label: 'Lun', number: '1' },
  { label: 'Mar', number: '2' },
  { label: 'Mie', number: '3' },
  { label: 'Jue', number: '4' },
];

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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

      {/* Estadísticas */}
      <Text style={styles.sectionTitle}>Tus estadísticas</Text>
      <View style={styles.statsRow}>
        <StatCard title="Estrés" subtitle="Últimas 24 horas" status="Alto">
          {/* Aquí iría un gráfico real, usamos placeholders visuales */}
          <View style={styles.chartPlaceholder}>
            {[40, 60, 30, 80, 50, 70, 40].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h, backgroundColor: i % 2 === 0 ? '#BFD6FE' : '#5B8DEF' }]} />
            ))}
          </View>
        </StatCard>
        
        <StatCard title="Tiempo uso" subtitle="Hoy" value="20 minutos restantes">
           <View style={styles.circleChart}>
              <Text style={styles.circleText}>85%</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Fondo gris muy claro como en diseño
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 60,
    width: '100%',
    justifyContent: 'center',
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
  circleChart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: '#E0E0E0', // Simula parte vacía
    transform: [{ rotate: '45deg' }],
  },
  circleText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    transform: [{ rotate: '-45deg' }], // Contrarrestar rotación
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});