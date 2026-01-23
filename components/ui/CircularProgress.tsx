import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from 'react-native-paper';

type CircularProgressProps = {
  size?: number;
  strokeWidth?: number;
  percent: number; // 0 - 100
  trackColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 80,
  strokeWidth = 8,
  percent,
  trackColor,
  progressColor,
  children,
}) => {
  const theme = useTheme();
  const finalTrackColor = trackColor || theme.colors.surfaceVariant;
  const finalProgressColor = progressColor || theme.colors.primary;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animated = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clamped = Math.min(100, Math.max(0, percent));
    const targetOffset = circumference - (circumference * clamped) / 100;
    Animated.timing(animated, {
      toValue: targetOffset,
      duration: 800,
      useNativeDriver: false, // SVG props are not supported by native driver
    }).start();
  }, [percent, circumference]);

  const sizeStyle = { width: size, height: size };

  return (
    <View style={[styles.container, sizeStyle]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          stroke={finalTrackColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <AnimatedCircle
          stroke={finalProgressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={animated as any}
          strokeLinecap="round"
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={[styles.centerContent, sizeStyle]}>{children}</View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgress;