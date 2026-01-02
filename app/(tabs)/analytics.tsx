import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { UsageChart } from '@/app/components/Analytics/UsageChart';
import { StatSummaryRow } from '@/app/components/Analytics/StatSummaryRow';
import { AppUsageList } from '@/app/components/Analytics/AppUsageList';

// Dummy Data
const CHART_DATA = [
  { day: 'Dom', value: 40 },
  { day: 'Lun', value: 60 },
  { day: 'Mar', value: 85, isPeak: true },
  { day: 'Mie', value: 50 },
  { day: 'Jue', value: 65 },
  { day: 'Vie', value: 75 },
  { day: 'Sab', value: 55 },
];

const STATS_SUMMARY = [
  { label: 'Pausas Forzadas', value: 3, color: '#5B8DEF' },
  { label: 'Calma', value: 18, unit: 'hrs', color: '#5B8DEF' },
  { label: 'Alertas Ira', value: 5, color: '#5B8DEF' },
];

const APPS_DATA = [
  { name: 'TikTok', time: '9:34 PM', category: '2h • Alto', color: '#000000' },
  { name: 'Clash Royale', time: '12:34 PM', category: '1h • Medio', color: '#5B8DEF' },
];

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<'Semana' | 'Mes'>('Semana');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Customization for Drawer/Stack */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Intensidad de uso</Text>
        <TouchableOpacity style={styles.iconBtn}>
           <Ionicons name="share-social-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeaderTitle}>uso</Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Semana')}>
          <Text style={[styles.tabText, activeTab === 'Semana' && styles.tabTextActive]}>Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Mes')}>
          <Text style={[styles.tabText, activeTab === 'Mes' && styles.tabTextActive]}>Mes</Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <UsageChart data={CHART_DATA} />

      {/* Stats Row */}
      <StatSummaryRow stats={STATS_SUMMARY} />

      {/* App List */}
      <AppUsageList apps={APPS_DATA} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
