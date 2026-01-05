import { AddChildForm } from '@/components/Home/AddChildForm';
import { DaySelector } from '@/components/Home/DaySelector';
import { NoChildrenState } from '@/components/Home/NoChildrenState';
import { ProgramCard } from '@/components/Home/ProgramCard';
import { StatCard } from '@/components/Home/StatCard';
import { ThemedView } from '@/components/themed-view';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { typography } from '@/constants/theme/typography';
import { useFamilyChildrenQuery } from '@/hooks/family/useFamilyChildrenQuery';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

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
  const [isAddingChild, setIsAddingChild] = useState(false);
  const childrenQuery = useFamilyChildrenQuery();
  const hasChildren = (childrenQuery.data?.length ?? 0) > 0;

  const handleLinkChild = (email: string) => {
    setIsAddingChild(false);
    Alert.alert('Éxito', `Se ha vinculado la cuenta de ${email}`);
    childrenQuery.refetch();
  };

  if (!isLoaded || childrenQuery.isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (isAddingChild) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <AddChildForm 
          onSuccess={handleLinkChild} 
          onCancel={() => setIsAddingChild(false)} 
        />
      </ThemedView>
    );
  }

  if (!hasChildren) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <NoChildrenState onAddChild={() => setIsAddingChild(true)} />
      </ThemedView>
    );
  }

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
});
