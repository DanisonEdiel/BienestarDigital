import { spacing } from '@/constants/theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';
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
};
 
export const DaySelector = ({ days, progressPercent = 75, barColor }: DaySelectorProps) => {
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

  return (
     <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
       {/* <View style={styles.daysRow}>
         {days.map((day, index) => {
           if (day.active) {
             return (
               <LinearGradient
                 key={`${day.label}-${index}`}
                 colors={[theme.colors.primary, theme.colors.primaryContainer]} 
                 style={[styles.dayItem, styles.dayItemActive]}
                 start={{ x: 0, y: 0 }}
                 end={{ x: 1, y: 1 }}
               >
                 <Text style={[styles.dayText, styles.dayTextActive, { color: theme.colors.onPrimary }]}>{day.label}</Text>
                 <Text style={[styles.dayNumber, styles.dayTextActive, { color: theme.colors.onPrimary }]}>{day.number}</Text>
               </LinearGradient>
             );
           }
           return (
             <View key={`${day.label}-${index}`} style={[styles.dayItem, { backgroundColor: theme.colors.surface }]}>
               <Text style={[styles.dayText, { color: theme.colors.onSurfaceVariant }]}>{day.label}</Text>
               <Text style={[styles.dayNumber, { color: theme.colors.onSurface }]}>{day.number}</Text>
             </View>
           );
         })}
       </View> */}
       
       {/* Barra de progreso dinámica */}
       <View style={styles.progressContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Animated.View style={[styles.progressBarFill, { width: widthInterpolate, backgroundColor: activeColor }]} />
          </View>
          <View style={styles.progressTextRow}>
             <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>Riesgo de bloqueo</Text>
             <Text style={[styles.progressValue, { color: theme.colors.onSurface }]}>{Math.round(progressPercent)}%</Text>
          </View>
       </View>
     </View>
   );
 };

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 24,
    // Sombra suave estilo iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dayItem: {
    width: 48,
    height: 68,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayItemActive: {
    // Background color handled by LinearGradient
  },
  dayText: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayTextActive: {
    // Colors handled inline
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
  },
});
