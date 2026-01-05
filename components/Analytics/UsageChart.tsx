import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';

type ChartData = {
  day: string;
  value: number; // 0 to 100
  isPeak?: boolean;
};

type UsageChartProps = {
  data: ChartData[];
};

export const UsageChart = ({ data }: UsageChartProps) => {
  return (
    <View style={styles.container}>
      {/* Y-Axis Labels */}
      <View style={styles.yAxis}>
        {['Crítico', 'Muy Alto', 'Alto', 'Medio', 'Bajo', '0'].map((label, index) => (
          <Text key={index} style={styles.yAxisLabel}>{label}</Text>
        ))}
      </View>

      {/* Chart Area */}
      <View style={styles.chartArea}>
        {/* Horizontal Grid Lines (simplified) */}
        {/* We could map lines here matching labels */}
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barColumn}>
              {/* Tooltip for Peak */}
              {item.isPeak && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>Pico de Uso</Text>
                  <View style={styles.tooltipArrow} />
                </View>
              )}
              
              {/* Bar Track */}
              <View style={styles.barTrack}>
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      height: `${item.value}%`,
                      backgroundColor: item.isPeak ? colors.primary : '#F2F2F7' // Highlight peak
                    }
                  ]} 
                />
              </View>
              <Text style={styles.xLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 300,
    marginTop: spacing.md,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingBottom: 24, // Space for x labels alignment
    paddingRight: spacing.sm,
    height: '100%',
  },
  yAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 0,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 12,
    height: '85%', // Leave space for labels and tooltip
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  xLabel: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
  tooltip: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  tooltipText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1C1C1E',
    position: 'absolute',
    bottom: -4,
  },
});
