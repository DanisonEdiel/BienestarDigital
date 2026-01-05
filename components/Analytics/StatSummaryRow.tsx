import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';

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
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.label}>{stat.label}</Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { color: stat.color || colors.primary }]}>
              {stat.value}
            </Text>
            {stat.unit && <Text style={styles.unit}>{stat.unit}</Text>}
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
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    marginLeft: 2,
  },
});
