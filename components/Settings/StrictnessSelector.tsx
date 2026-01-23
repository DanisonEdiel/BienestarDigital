import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '@/constants/theme/spacing';
import { useTheme } from 'react-native-paper';

type StrictnessSelectorProps = {
  value: string;
  onPress: () => void;
};

export const StrictnessSelector = ({ value, onPress }: StrictnessSelectorProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>{value}</Text>
      <Ionicons name="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56,
    marginTop: spacing.sm,
  },
  text: {
    fontSize: 16,
  },
});
