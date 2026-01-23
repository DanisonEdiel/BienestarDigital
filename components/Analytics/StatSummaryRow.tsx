import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme/spacing';
import { useTheme } from 'react-native-paper';

type StatItem = {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
};

type StatSummaryRowProps = {
  stats: StatItem[];
};

export const StatSummaryRow = ({ stats }: StatSummaryRowProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.item}>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{stat.label}</Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { color: stat.color || theme.colors.primary }]}>
              {stat.value}
            </Text>
            {stat.unit && <Text style={[styles.unit, { color: theme.colors.onSurfaceVariant }]}>{stat.unit}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  item: {
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
  },
  unit: {
    fontSize: 12,
    marginLeft: 2,
  },
});
