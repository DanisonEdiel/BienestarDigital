import { spacing } from '@/constants/theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type ProgramCardProps = {
  id: string;
  title: string;
  time: string;
  icon?: string;
};

export const ProgramCard = ({ id, title, time, icon }: ProgramCardProps) => {
  const theme = useTheme();
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/programs/form', params: { id } })}
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
         <Ionicons name={icon as any || "cafe"} size={20} color={theme.colors.onSurface} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
        <Text style={[styles.time, { color: theme.colors.onSurfaceVariant }]}>{time}</Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
  },
  avatarContainer: {
    marginLeft: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
