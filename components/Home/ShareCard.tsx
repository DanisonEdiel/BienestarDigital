import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Alert, Share } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { SocialShareView } from './SocialShareView';
import { spacing } from '@/constants/theme/spacing';
import { typography } from '@/constants/theme/typography';

interface ShareCardProps {
  screenTimePercent: number;
  riskLevel: string;
}

export const ShareCard = ({ screenTimePercent, riskLevel }: ShareCardProps) => {
  const theme = useTheme();
  const [isSharing, setIsSharing] = useState(false);
  const viewRef = useRef<View>(null);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const getTranslatedRisk = (level: string) => {
    switch(level.toLowerCase()) {
      case 'critical': return 'Crítico 🔴';
      case 'high': return 'Alto 🔴';
      case 'medium': return 'Medio 🟠';
      case 'low': return 'Bajo 🟢';
      default: return level;
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      // Pequeño delay para asegurar que la vista se renderice correctamente antes de capturar
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the view as an image
      if (viewRef.current) {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 0.9,
          result: 'tmpfile',
        });

        if (await Sharing.isAvailableAsync()) {
           await Sharing.shareAsync(uri, {
             mimeType: 'image/png',
             dialogTitle: 'Compartir mi progreso en MindPause',
             UTI: 'public.png'
           });
        } else {
           // Fallback to text sharing if file sharing is not available
           const translatedRisk = getTranslatedRisk(riskLevel);
           const focusLevel = Math.max(0, Math.floor(100 - screenTimePercent));
           const message = `🚀 Mi nivel de enfoque hoy: ${focusLevel}% con MindPause.\nNivel de riesgo digital: ${translatedRisk}.\n¡Toma el control de tu bienestar digital! #MindPause #BienestarDigital`;
           await Share.share({ message, title: 'Mi Progreso en MindPause' });
        }
      }
    } catch (error: any) {
      console.log("Error sharing image, falling back to text:", error);
      // Fallback to text sharing on error
      const translatedRisk = getTranslatedRisk(riskLevel);
      const focusLevel = Math.max(0, Math.floor(100 - screenTimePercent));
      const message = `🚀 Mi nivel de enfoque hoy: ${focusLevel}% con MindPause.\nNivel de riesgo digital: ${translatedRisk}.\n¡Toma el control de tu bienestar digital! #MindPause #BienestarDigital`;
      await Share.share({ message, title: 'Mi Progreso en MindPause' });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.elevation.level1 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Comparte tu Logro</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Aquí tienes un resumen visual de tu día.
        </Text>
      </View>

      {/* Visual representation (Dashboard style) */}
      <View 
        ref={viewRef}
        collapsable={false}
        style={styles.captureContainer}
      >
        <SocialShareView 
          screenTimePercent={screenTimePercent}
          riskLevel={riskLevel}
          date={today}
        />
      </View>

      <Button 
        mode="contained" 
        onPress={handleShare}
        loading={isSharing}
        disabled={isSharing}
        style={styles.button}
        icon="share-variant"
      >
        Compartir Imagen
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: 16,
    padding: spacing.md,
    elevation: 1,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.subtitle,
    opacity: 0.8,
  },
  captureContainer: {
    marginBottom: spacing.md,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  note: {
    fontSize: 12,
    marginBottom: spacing.md,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    borderRadius: 8,
  }
});
