import { ThemedText } from '@/components/themed-text';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface NoChildrenStateProps {
  onAddChild: () => void;
}

export function NoChildrenState({ onAddChild }: NoChildrenStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        {/* Placeholder for the illustration - Using Icons composition */}
        <View style={styles.iconCircle}>
            <Ionicons name="phone-portrait-outline" size={60} color={colors.primary} style={styles.phoneIcon} />
            <Ionicons name="game-controller-outline" size={40} color={colors.textSecondary} style={styles.gameIcon} />
            <Ionicons name="happy-outline" size={50} color={colors.textSecondary} style={styles.faceIcon} />
        </View>
      </View>

      <ThemedText type="title" style={styles.title}>
        Administra los dispositivos de tu hijo o hija
      </ThemedText>
      
      <ThemedText style={styles.subtitle}>
        Para administrar el dispositivo de un hijo o una hija, agrega o crea una cuenta
      </ThemedText>

      <Button 
        mode="contained" 
        onPress={onAddChild}
        style={styles.button}
        contentStyle={styles.buttonContent}
        icon="plus"
        buttonColor={colors.primary}
      >
        Agregar hijo o hija
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl * 2,
  },
  illustrationContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0EBFF', // Light blue circle background
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  phoneIcon: {
    position: 'absolute',
    left: 40,
    top: 50,
    transform: [{ rotate: '-15deg' }]
  },
  gameIcon: {
    position: 'absolute',
    right: 45,
    top: 40,
    transform: [{ rotate: '15deg' }]
  },
  faceIcon: {
    position: 'absolute',
    bottom: 50,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
    fontSize: 24,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl * 2,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    borderRadius: 25,
    width: '100%',
  },
  buttonContent: {
    height: 50,
  },
});
