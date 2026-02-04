import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '@/constants/theme/typography';
import { spacing } from '@/constants/theme/spacing';

interface SocialShareViewProps {
  screenTimePercent: number;
  riskLevel: string; // 'low', 'medium', 'high'
  date: string;
}

export const SocialShareView = ({ screenTimePercent, riskLevel, date }: SocialShareViewProps) => {
  const theme = useTheme();
  
  const focusLevel = Math.max(0, Math.floor(100 - screenTimePercent));
  
  let riskColor = '#4CAF50';
  let riskText = 'Bajo';
  let riskIcon: keyof typeof Ionicons.glyphMap = 'shield-checkmark';
  let gradientColors = ['#E8F5E9', '#FFFFFF']; // Light Greenish default
  let accentColor = '#2E7D32';

  if (riskLevel === 'medium') {
    riskColor = '#FF9800';
    riskText = 'Medio';
    riskIcon = 'warning';
    gradientColors = ['#FFF3E0', '#FFFFFF'];
    accentColor = '#EF6C00';
  } else if (riskLevel === 'high') {
    riskColor = theme.colors.error;
    riskText = 'Alto';
    riskIcon = 'alert-circle';
    gradientColors = ['#FFEBEE', '#FFFFFF'];
    accentColor = '#C62828';
  } else if (riskLevel === 'critical') {
    riskColor = '#B71C1C';
    riskText = 'Crítico';
    riskIcon = 'alert-circle';
    gradientColors = ['#FFEBEE', '#FFFFFF'];
    accentColor = '#B71C1C';
  }

  // Use a dark theme card for better contrast on social media
  const cardBackground = ['#1A1A1A', '#000000'];
  const textColor = '#FFFFFF';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={cardBackground}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Decorative Elements */}
        <View style={[styles.circleDecoration, { backgroundColor: riskColor, opacity: 0.1 }]} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.appName, { color: textColor }]}>MindPause</Text>
          </View>
          <View style={styles.dateContainer}>
             <Text style={[styles.date, { color: 'rgba(255,255,255,0.7)' }]}>{date}</Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
            {/* Main Stat */}
            <View style={styles.statCircleContainer}>
              <View style={[styles.statCircle, { borderColor: riskColor }]}>
                  <Text style={[styles.focusValue, { color: textColor }]}>{focusLevel}%</Text>
                  <Text style={[styles.focusLabel, { color: 'rgba(255,255,255,0.7)' }]}>Nivel de Enfoque</Text>
              </View>
            </View>

            {/* Risk Badge */}
            <View style={[styles.riskBadge, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: riskColor }]}>
              <Ionicons name={riskIcon} size={24} color={riskColor} />
              <View>
                  <Text style={[styles.riskLabel, { color: 'rgba(255,255,255,0.5)' }]}>Riesgo Digital</Text>
                  <Text style={[styles.riskText, { color: riskColor }]}>{riskText}</Text>
              </View>
            </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: 'rgba(255,255,255,0.6)' }]}>
            ¡Toma el control de tu bienestar digital!
          </Text>
          <Text style={[styles.hashtags, { color: riskColor }]}>
            #MindPause #BienestarDigital
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4/5, // Portrait format for Stories/Status
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gradient: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  circleDecoration: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align to top
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  appName: {
    ...typography.h3,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dateContainer: {
    maxWidth: '40%',
    alignItems: 'flex-end',
  },
  date: {
    ...typography.body2,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.xl,
  },
  statCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  focusValue: {
    ...typography.h1,
    fontSize: 72,
    fontWeight: 'bold',
    includeFontPadding: false,
    lineHeight: 80,
  },
  focusLabel: {
    ...typography.body1,
    fontSize: 14,
    fontWeight: '500',
    marginTop: -4,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    width: '90%',
    justifyContent: 'center',
  },
  riskLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  riskText: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: spacing.sm,
  },
  footerText: {
    ...typography.body2,
    fontSize: 14,
    textAlign: 'center',
  },
  hashtags: {
    ...typography.body2,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
