import { spacing } from '@/constants/theme/spacing';
import { BlockingRisk } from '@/hooks/useMetrics';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

type Day = {
  label: string;
  number: string;
  active?: boolean;
};

type DaySelectorProps = {
  days: Day[];
  progressPercent?: number; // 0-100 dinámico
  barColor?: string;
  riskDetails?: BlockingRisk | null;
};

export const DaySelector = ({ days, progressPercent = 75, barColor, riskDetails }: DaySelectorProps) => {
  const theme = useTheme();
  const animated = React.useRef(new Animated.Value(progressPercent)).current;
  const activeColor = barColor || theme.colors.primary;
  
  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: progressPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);
  
  const widthInterpolate = animated.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Generar insight dinámico basado en los datos
  const getInsight = () => {
    if (!riskDetails) return "Analizando patrones de uso...";

    const { usedPercent, totalInteractions, emotionLevel, percent } = riskDetails;

    // Prioridad a niveles críticos
    if (percent >= 75) {
        if (emotionLevel === 'high') return "Tu nivel de estrés y uso elevado aumentan drásticamente el riesgo.";
        if (totalInteractions > 1200) return "Demasiadas interacciones (taps/scrolls) están disparando el riesgo.";
        if (usedPercent > 90) return "Has agotado casi todo tu tiempo de pantalla seguro.";
        return "Riesgo crítico de bloqueo. ¡Desconecta ya!";
    }

    if (percent >= 40) {
        if (emotionLevel === 'high') return "El estrés está influyendo en tu patrón de uso.";
        if (totalInteractions > 800) return "Estás revisando el celular con mucha frecuencia.";
        if (usedPercent > 60) return "Tu tiempo de uso está empezando a ser preocupante.";
        return "Tu uso es moderado, pero mantente alerta.";
    }

    return "¡Excelente! Tu patrón de uso es saludable y equilibrado.";
  };

  const insight = getInsight();

  return (
     <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
       {/* Header con Título e Insight */}
       <View style={styles.headerRow}>
         <View style={{ flex: 1, paddingRight: spacing.sm }}>
             <Text style={[styles.title, { color: theme.colors.onSurface }]}>Riesgo de Bloqueo</Text>
             <Text style={[styles.insight, { color: theme.colors.onSurfaceVariant }]}>{insight}</Text>
         </View>
         <Text style={[styles.percentage, { color: activeColor }]}>{Math.round(progressPercent)}%</Text>
       </View>
       
       {/* Barra de progreso dinámica */}
       <View style={styles.progressContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Animated.View style={[styles.progressBarFill, { width: widthInterpolate, backgroundColor: activeColor }]} />
          </View>
       </View>

       {/* Detalles (si existen) */}
       {riskDetails && (
         <View style={[styles.detailsRow, { borderTopColor: theme.colors.outlineVariant }]}>
             <View style={styles.detailItem}>
                 <Ionicons name="time-outline" size={16} color={theme.colors.onSurfaceVariant} />
                 <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                     {riskDetails.usedPercent}% Uso
                 </Text>
             </View>
             <View style={styles.detailItem}>
                 <Ionicons name="finger-print-outline" size={16} color={theme.colors.onSurfaceVariant} />
                 <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                     {riskDetails.totalInteractions} Inter.
                 </Text>
             </View>
             <View style={styles.detailItem}>
                 <Ionicons name="pulse-outline" size={16} color={theme.colors.onSurfaceVariant} />
                 <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                     {riskDetails.emotionLevel === 'high' ? 'Alto' : riskDetails.emotionLevel === 'medium' ? 'Medio' : 'Bajo'}
                 </Text>
             </View>
         </View>
       )}
     </View>
   );
 };

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  insight: {
    fontSize: 14,
    lineHeight: 20,
  },
  percentage: {
    fontSize: 24,
    fontWeight: '800',
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    marginTop: spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  }
});
