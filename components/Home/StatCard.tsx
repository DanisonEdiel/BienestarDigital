import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme/spacing';
import { useTheme } from 'react-native-paper';

type StatCardProps = {
  title: string;
  subtitle?: string;
  value?: string | React.ReactNode;
  status?: string;
  children?: React.ReactNode;
  style?: object;
};

export const StatCard = ({ title, subtitle, value, status, children, style }: StatCardProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }, style]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>{subtitle}</Text>}
        </View>
        {/* Icon placeholder */}
        <View style={[styles.iconDot, { backgroundColor: theme.colors.primary }]} />
      </View>
      
      <View style={styles.content}>
        {children}
      </View>

      {status && <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>{status}</Text>}
      {value && <Text style={[styles.valueText, { color: theme.colors.onSurface }]}>{value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: spacing.md,
    flex: 1, // Para que ocupe espacio equitativo en row
    minHeight: 160,
    justifyContent: 'space-between',
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  valueText: {
    fontSize: 14,
  }
});
