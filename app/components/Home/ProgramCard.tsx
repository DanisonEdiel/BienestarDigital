import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { Ionicons } from '@expo/vector-icons';

type ProgramCardProps = {
  title: string;
  time: string;
};

export const ProgramCard = ({ title, time }: ProgramCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
         <Ionicons name="cafe" size={20} color="#1C1C1E" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.avatarContainer}>
         {/* Placeholder para avatar */}
         <View style={styles.avatar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  avatarContainer: {
    marginLeft: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
  },
});
