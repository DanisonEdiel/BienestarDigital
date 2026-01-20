import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

type Day = {
  label: string;
  number: string;
  active?: boolean;
};
 
type DaySelectorProps = {
  days: Day[];
  progressPercent?: number; // 0-100 dinámico
};
 
export const DaySelector = ({ days, progressPercent = 75 }: DaySelectorProps) => {
  const animated = React.useRef(new Animated.Value(progressPercent)).current;
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
     <View style={styles.container}>
       <View style={styles.daysRow}>
         {days.map((day, index) => {
           if (day.active) {
             return (
               <LinearGradient
                 key={`${day.label}-${index}`}
                 colors={['#5B8DEF', '#8EB4FF']} // Ajustar gradiente según diseño
                 style={[styles.dayItem, styles.dayItemActive]}
                 start={{ x: 0, y: 0 }}
                 end={{ x: 1, y: 1 }}
               >
                 <Text style={[styles.dayText, styles.dayTextActive]}>{day.label}</Text>
                 <Text style={[styles.dayNumber, styles.dayTextActive]}>{day.number}</Text>
               </LinearGradient>
             );
           }
           return (
             <View key={`${day.label}-${index}`} style={styles.dayItem}>
               <Text style={styles.dayText}>{day.label}</Text>
               <Text style={styles.dayNumber}>{day.number}</Text>
             </View>
           );
         })}
       </View>
       
       {/* Barra de progreso dinámica */}
       <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, { width: widthInterpolate }]} />
          </View>
          <View style={styles.progressTextRow}>
             <Text style={styles.progressLabel}>Riesgo de bloqueo</Text>
             <Text style={styles.progressValue}>{Math.round(progressPercent)}%</Text>
          </View>
       </View>
     </View>
   );
 };

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
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
    borderColor: '#F0F0F0',
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
    backgroundColor: colors.white,
  },
  dayItemActive: {
    // Background color handled by LinearGradient
  },
  dayText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dayTextActive: {
    color: colors.white,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F2F4F7',
    borderRadius: 3,
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
