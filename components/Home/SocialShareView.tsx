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
  
  // Colores menos saturados para modo oscuro (Pastel/Soft tones)
  let riskColor = '#81C784'; // Soft Green
  let riskText = 'Bajo';
  let riskIcon: keyof typeof Ionicons.glyphMap = 'shield-checkmark';

  if (riskLevel === 'medium') {
    riskColor = '#FFB74D'; // Soft Orange
    riskText = 'Medio';
    riskIcon = 'warning';
  } else if (riskLevel === 'high') {
    riskColor = '#E57373'; // Soft Red
    riskText = 'Alto';
    riskIcon = 'alert-circle';
  } else if (riskLevel === 'critical') {
    riskColor = '#EF5350'; // Red
    riskText = 'Crítico';
    riskIcon = 'alert-circle';
  }

  // Fondo oscuro limpio y profesional
  const cardBackground = ['#121212', '#1E1E1E'] as const;
  const textColor = '#FFFFFF';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={cardBackground}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image 
              source={require('@/assets/MindPause.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.appName, { color: textColor }]}>MindPause</Text>
          </View>
          <Text style={[styles.date, { color: 'rgba(255,255,255,0.6)' }]}>{date}</Text>
        </View>

        {/* Content Container - Minimalista */}
        <View style={styles.contentContainer}>
            {/* Main Stat */}
            <View style={styles.statContainer}>
              <Text style={[styles.focusValue, { color: textColor }]}>{focusLevel}%</Text>
              <Text style={[styles.focusLabel, { color: riskColor }]}>Nivel de Enfoque</Text>
            </View>

            {/* Risk Indicator - Simple */}
            <View style={styles.riskContainer}>
              <View style={styles.riskRow}>
                <Ionicons name={riskIcon} size={24} color={riskColor} />
                <Text style={[styles.riskText, { color: riskColor }]}>{riskText}</Text>
              </View>
              <Text style={[styles.riskLabel, { color: 'rgba(255,255,255,0.5)' }]}>Riesgo Digital Detectado</Text>
            </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.hashtags, { color: 'rgba(255,255,255,0.4)' }]}>
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
    aspectRatio: 4/5,
    borderRadius: 0, // Sin redondeo
    overflow: 'hidden',
    backgroundColor: '#121212',
  },
  gradient: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  appName: {
    // Usando typography.title existente
    fontFamily: typography.title.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  date: {
    // Usando typography.caption
    fontFamily: typography.caption.fontFamily,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  statContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusValue: {
    fontFamily: typography.title.fontFamily,
    fontSize: 80, // Reducido para evitar superposiciones
    lineHeight: 80,
    includeFontPadding: false,
    marginBottom: spacing.xs,
  },
  focusLabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontWeight: '500',
    opacity: 0.9,
  },
  riskContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', // Sutil fondo para separar visualmente
    width: '100%',
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  riskText: {
    fontFamily: typography.sectionTitle.fontFamily,
    fontSize: 24,
  },
  riskLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
  },
  hashtags: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 12,
  },
});
