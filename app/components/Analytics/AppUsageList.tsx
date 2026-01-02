import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { Ionicons } from '@expo/vector-icons';

type AppItem = {
  name: string;
  time: string;
  category: string;
  icon?: string; // URL or name
  color?: string;
};

type AppUsageListProps = {
  apps: AppItem[];
};

export const AppUsageList = ({ apps }: AppUsageListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aplicaciones usadas</Text>
      {apps.map((app, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.info}>
            <Text style={styles.time}>{app.time}</Text>
            <Text style={styles.name}>{app.name}</Text>
            <Text style={styles.category}>{app.time} • {app.category}</Text>
          </View>
          <View style={[styles.iconContainer, { backgroundColor: app.color || '#E0E0E0' }]}>
             <Ionicons name="apps" size={24} color={colors.white} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  item: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
