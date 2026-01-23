import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

type AppItem = {
  name: string;
  time: string;
  category: string;
  percentage?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  color?: string;
};

type AppUsageListProps = {
  apps: AppItem[];
};

export const AppUsageList = ({ apps }: AppUsageListProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Aplicaciones usadas</Text>
      {apps.map((app, index) => (
        <View key={index} style={[styles.item, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
          <View style={styles.info}>
            <Text style={[styles.time, { color: theme.colors.onSurfaceVariant }]}>{app.time}</Text>
            <Text style={[styles.name, { color: theme.colors.onSurface }]}>{app.name}</Text>
            <Text style={[styles.category, { color: theme.colors.onSurfaceVariant }]}>
              {app.percentage ? `${app.percentage} • ` : ''}
              {app.category}
            </Text>
          </View>
          <View style={[styles.iconContainer, { backgroundColor: app.color || theme.colors.surfaceVariant }]}>
             <Ionicons
               name={app.iconName || 'apps'}
               size={24}
               color={theme.colors.surface}
             />
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
    marginBottom: spacing.md,
  },
  item: {
    borderRadius: 20,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    // Shadow
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
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
