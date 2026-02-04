import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import { BlockingRisk } from '@/hooks/useMetrics';
import { spacing } from '@/constants/theme/spacing';
import { typography } from '@/constants/theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface RiskBreakdownProps {
  riskData: BlockingRisk | undefined;
  isLoading: boolean;
}

export const RiskBreakdown = ({ riskData, isLoading }: RiskBreakdownProps) => {
  const theme = useTheme();

  if (isLoading || !riskData) return null;

  // 1. Screen Time (already in percent)
  const screenColor = riskData.usedPercent > 80 ? theme.colors.error : riskData.usedPercent > 50 ? '#FF9800' : '#4CAF50';

  // 2. Intensity (Interactions)
  // Baseline: 800 (low), 1200 (med), 1700 (high)
  const interactionPercent = Math.min(1, riskData.totalInteractions / 1700);
  const interactionColor = interactionPercent > 0.8 ? theme.colors.error : interactionPercent > 0.5 ? '#FF9800' : '#4CAF50';

  // 3. Emotion
  const emotionPercent = riskData.emotionLevel === 'high' ? 0.9 : riskData.emotionLevel === 'medium' ? 0.6 : 0.2;
  const emotionColor = riskData.emotionLevel === 'high' ? theme.colors.error : riskData.emotionLevel === 'medium' ? '#FF9800' : '#4CAF50';
  
  // 4. Doomscrolling (Speed)
  // Threshold: e.g., > 15-20 interactions/sec (pixel speed is variable)
  const isDoomscrolling = riskData.avgScrollSpeed > 20; 

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.elevation.level1 }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Desglose de Riesgo</Text>
      
      {/* Screen Time */}
      <View style={styles.row}>
        <View style={styles.labelRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.onSurface} />
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Tiempo en Pantalla</Text>
        </View>
        <ProgressBar progress={riskData.usedPercent / 100} color={screenColor} style={styles.bar} />
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>{riskData.usedPercent}%</Text>
      </View>

      {/* Intensity */}
      <View style={styles.row}>
        <View style={styles.labelRow}>
            <Ionicons name="finger-print-outline" size={16} color={theme.colors.onSurface} />
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Intensidad (Taps/Scrolls)</Text>
        </View>
        <ProgressBar progress={interactionPercent} color={interactionColor} style={styles.bar} />
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>{riskData.totalInteractions} interacciones</Text>
      </View>

      {/* Emotion */}
      <View style={styles.row}>
        <View style={styles.labelRow}>
            <Ionicons name="heart-outline" size={16} color={theme.colors.onSurface} />
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Estado Emocional</Text>
        </View>
        <ProgressBar progress={emotionPercent} color={emotionColor} style={styles.bar} />
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>
            {riskData.emotionLevel === 'high' ? 'Tenso' : riskData.emotionLevel === 'medium' ? 'Regular' : 'Calma'}
        </Text>
      </View>

      {/* Doomscrolling Alert */}
      {isDoomscrolling && (
        <View style={[styles.alert, { backgroundColor: theme.colors.errorContainer }]}>
            <Ionicons name="flame" size={20} color={theme.colors.error} />
            <Text style={[styles.alertText, { color: theme.colors.onErrorContainer }]}>
                ¡Alerta de Doomscrolling! Velocidad de scroll muy alta.
            </Text>
        </View>
      )}

      {/* Night Usage Alert */}
      {riskData.nightUsage && (
        <View style={[styles.alert, { backgroundColor: '#311b92' }]}>
            <Ionicons name="moon" size={20} color="#b39ddb" />
            <Text style={[styles.alertText, { color: '#ede7f6' }]}>
                Uso Nocturno Detectado. Tu sueño podría verse afectado.
            </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 16,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  row: {
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  label: {
    fontSize: 12,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  value: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 2,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
    gap: 8,
  },
  alertText: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  }
});
