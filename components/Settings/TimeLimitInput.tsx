import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme/spacing';
import { useTheme } from 'react-native-paper';

type TimeLimitInputProps = {
  hours: string;
  minutes: string;
  onHoursChange: (val: string) => void;
  onMinutesChange: (val: string) => void;
};

export const TimeLimitInput = ({ hours, minutes, onHoursChange, onMinutesChange }: TimeLimitInputProps) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.onSurfaceVariant }]}
          value={hours}
          onChangeText={onHoursChange}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={theme.colors.onSurfaceDisabled}
        />
        <Text style={[styles.unit, { color: theme.colors.onSurfaceVariant }]}>h</Text>
      </View>
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.onSurfaceVariant }]}
          value={minutes}
          onChangeText={onMinutesChange}
          keyboardType="numeric"
          placeholder="00"
          placeholderTextColor={theme.colors.onSurfaceDisabled}
        />
        <Text style={[styles.unit, { color: theme.colors.onSurfaceVariant }]}>m</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
  },
});
