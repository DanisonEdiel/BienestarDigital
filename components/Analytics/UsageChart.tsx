import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme/spacing';
import { useTheme } from 'react-native-paper';
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
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Y-Axis Labels */}
      <View style={styles.yAxis}>
        {['Crítico', 'Muy Alto', 'Alto', 'Medio', 'Bajo', '0'].map((label, index) => (
          <Text key={index} style={[styles.yAxisLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
        ))}
      </View>

      {/* Chart Area */}
      <View style={styles.chartArea}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barColumn}>
              {/* Tooltip for Peak */}
              {item.isPeak && (
                <View style={[styles.tooltip, { backgroundColor: theme.colors.inverseSurface }]}>
                  <Text style={[styles.tooltipText, { color: theme.colors.inverseOnSurface }]}>Pico</Text>
                  <View style={[styles.tooltipArrow, { borderTopColor: theme.colors.inverseSurface }]} />
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
                          backgroundColor: theme.colors.primary 
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
                          backgroundColor: theme.colors.secondary // Using secondary for scrolls
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              <Text style={[styles.xLabel, { color: theme.colors.onSurfaceVariant }]}>{item.day}</Text>
            </View>
          ))}
        </View>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>Taps</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
            <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>Scrolls</Text>
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
  },
  tooltip: {
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
  },
});
