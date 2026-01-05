import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';

type StrictnessSelectorProps = {
  value: string;
  onPress: () => void;
};

export const StrictnessSelector = ({ value, onPress }: StrictnessSelectorProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.text}>{value}</Text>
      <Ionicons name="chevron-down" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
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
    color: colors.textPrimary,
  },
});
