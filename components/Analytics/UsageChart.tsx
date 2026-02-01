import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';

type ChartData = {
  day: string;
  tapsValue: number; // 0 to 100 relative to max taps
  scrollsValue: number; // 0 to 100 relative to max scrolls
  tapsRaw: number;
  scrollsRaw: number;
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
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barColumn}>
              {/* Tooltip for Peak */}
              {item.isPeak && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>Pico</Text>
                  <View style={styles.tooltipArrow} />
                </View>
              )}
              
              {/* Bar Group: Taps & Scrolls */}
              <View style={styles.barsGroup}>
                {/* Taps Bar */}
                <View style={styles.singleBarWrapper}>
                   <View style={styles.barTrack}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          height: `${item.tapsValue}%`,
                          backgroundColor: colors.primary 
                        }
                      ]} 
                    />
                  </View>
                </View>

                {/* Scrolls Bar */}
                <View style={styles.singleBarWrapper}>
                  <View style={styles.barTrack}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          height: `${item.scrollsValue}%`,
                          backgroundColor: '#FF9F0A' // Orange for scrolls
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.xLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Taps</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9F0A' }]} />
            <Text style={styles.legendText}>Scrolls</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 320,
    marginTop: spacing.md,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingBottom: 40, // Adjusted for legend/labels
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
    paddingBottom: 20, // Space for legend
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barsGroup: {
    flexDirection: 'row',
    height: '85%',
    alignItems: 'flex-end',
    gap: 4,
  },
  singleBarWrapper: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 8, // Thinner bars to fit 2
    height: '100%',
    backgroundColor: 'transparent', // No background track for cleaner look
    justifyContent: 'flex-end',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
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
    position: 'absolute',
    top: 0,
    zIndex: 10,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
