import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '@/constants/theme/spacing';
import { useTheme } from 'react-native-paper';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export const GradientButton = ({ title, onPress, style }: GradientButtonProps) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]} activeOpacity={0.8}>
      <LinearGradient
        colors={[theme.colors.primaryContainer, theme.colors.primary]} // Dynamic theme colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, { color: theme.colors.onPrimary }]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 56,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
