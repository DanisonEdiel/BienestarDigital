import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';

type StatCardProps = {
  title: string;
  subtitle?: string;
  value?: string | React.ReactNode;
  status?: string;
  children?: React.ReactNode;
  style?: object;
};

export const StatCard = ({ title, subtitle, value, status, children, style }: StatCardProps) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {/* Icon placeholder */}
        <View style={styles.iconDot} />
      </View>
      
      <View style={styles.content}>
        {children}
      </View>

      {status && <Text style={styles.statusText}>{status}</Text>}
      {value && <Text style={styles.valueText}>{value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
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
    borderColor: '#F5F5F5',
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
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
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
    color: colors.textPrimary,
  },
  valueText: {
    fontSize: 14,
    color: colors.textPrimary,
  }
});
