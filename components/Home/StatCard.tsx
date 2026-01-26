import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme/spacing';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

type StatCardProps = {
  title: string;
  subtitle?: string;
  value?: string | React.ReactNode;
  status?: string;
  children?: React.ReactNode;
  style?: object;
  icon?: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
};

export const StatCard = ({ title, subtitle, value, status, children, style, icon, accentColor }: StatCardProps) => {
  const theme = useTheme();
  const activeColor = accentColor || theme.colors.primary;

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: theme.colors.surface, 
        borderColor: activeColor, // Semaforización en el borde
        borderWidth: 1.5 // Un poco más grueso para que se note
      }, 
      style
    ]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
            {icon && <Ionicons name={icon} size={18} color={activeColor} />}
          </View>
          {subtitle && <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>{subtitle}</Text>}
        </View>
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
