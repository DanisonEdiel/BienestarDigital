import { AppUsageList } from '@/components/Analytics/AppUsageList';
import { UsageChart } from '@/components/Analytics/UsageChart';
import { SocialShareView } from '@/components/Home/SocialShareView';
import { spacing } from '@/constants/theme/spacing';
import { typography } from '@/constants/theme/typography';
import { useDigitalWellbeing } from '@/hooks/useDigitalWellbeing';
import { useBlockingRisk, useInteractionHistory } from '@/hooks/useMetrics';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, RefreshControl, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

const APPS_DATA_FALLBACK = [
  { name: 'TikTok', time: '2.0 h', category: 'Alto', percentage: '60%' },
  { name: 'Clash Royale', time: '1.0 h', category: 'Medio', percentage: '40%' },
];

export default function AnalyticsScreen() {
  const theme = useTheme();
  const { data: interactionHistory, isLoading, isFetching, refetch: refetchHistory } = useInteractionHistory('week');
  const { metrics: todayMetrics, appUsage: todayAppUsage, refresh: refreshWellbeing } = useDigitalWellbeing();
  const { data: blockingRisk } = useBlockingRisk();
  const [refreshing, setRefreshing] = React.useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const viewRef = useRef<View>(null);
  const insets = useSafeAreaInsets();
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchHistory(),
        Promise.resolve(refreshWellbeing()),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchHistory, refreshWellbeing]);

  // Process metrics for chart if available (based on interactions: taps + scrolls)
  const chartData = useMemo(() => {
    const days: { date: string; taps: number; scrolls: number }[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, taps: 0, scrolls: 0 });
    }

    // Merge backend history
    if (interactionHistory && interactionHistory.length > 0) {
      interactionHistory.forEach((m: any) => {
        const found = days.find(d => d.date === m.record_date);
        if (found) {
          found.taps = m.taps_count ?? 0;
          found.scrolls = m.scroll_events ?? 0;
        }
      });
    }

    // Merge today's live data
    // Usually the last item in 'days' is today
    const todayStr = today.toISOString().split('T')[0];
    const todayItem = days.find(d => d.date === todayStr);
    
    if (todayItem && todayMetrics) {
      // Use the max of local vs backend (in case sync happened partially)
      todayItem.taps = Math.max(todayItem.taps, todayMetrics.tapsCount ?? 0);
      todayItem.scrolls = Math.max(todayItem.scrolls, todayMetrics.scrollEvents ?? 0);
    }

    const points = days;

    const maxTaps = Math.max(...points.map(p => p.taps), 1);
    const maxScrolls = Math.max(...points.map(p => p.scrolls), 1);

    const getTrafficColor = (val: number) => {
      if (val < 40) return '#4CAF50';
      if (val < 75) return '#FF9800';
      return '#F44336';
    };

    return points.map((p) => {
      // Adjust date to display correctly in local time (avoiding timezone shifts on label)
      // Since we constructed dates from local 'today', we can just parse the string parts
      const [y, m, d] = p.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d); // Local date
      
      const dayLabel = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });
      
      const tapsValue = Math.min(100, Math.round((p.taps / maxTaps) * 100));
      const scrollsValue = Math.min(100, Math.round((p.scrolls / maxScrolls) * 100));
      
      // Determine if this day is a peak for either metric
      const isPeak = (p.taps === maxTaps && p.taps > 0) || (p.scrolls === maxScrolls && p.scrolls > 0);

      return {
        day: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
        tapsValue,
        scrollsValue,
        tapsRaw: p.taps,
        scrollsRaw: p.scrolls,
        isPeak,
        tapsColor: getTrafficColor(tapsValue),
        scrollsColor: getTrafficColor(scrollsValue) + '80', // 50% opacity for distinction
      };
    });
  }, [interactionHistory, todayMetrics]);

  const appsData = useMemo(() => {
    if (!todayAppUsage || todayAppUsage.length === 0) return APPS_DATA_FALLBACK;

    const topApps = todayAppUsage.slice(0, 5);
    const totalTopSeconds = topApps.reduce(
      (acc, app) => acc + app.totalTimeInForeground,
      0
    );

    const getDisplayName = (packageName: string, appName?: string) => {
      const knownNames: Record<string, string> = {
        'com.zhiliaoapp.musically': 'TikTok',
        'com.facebook.katana': 'Facebook',
        'com.instagram.android': 'Instagram',
        'com.whatsapp': 'WhatsApp',
        'com.google.android.youtube': 'YouTube',
        'com.twitter.android': 'X',
        'com.snapchat.android': 'Snapchat',
        'com.spotify.music': 'Spotify',
        'com.netflix.mediaclient': 'Netflix',
        'com.google.android.gm': 'Gmail',
        'com.android.chrome': 'Chrome',
        'com.google.android.apps.maps': 'Maps',
        'com.microsoft.teams': 'Teams',
        'com.linkedin.android': 'LinkedIn',
      };

      const pkgLower = packageName.toLowerCase();
      if (knownNames[pkgLower]) return knownNames[pkgLower];

      // Try to use appName if it looks valid (no dots, not empty)
      if (appName && appName.trim().length > 0 && !appName.includes('.')) {
         return appName;
      }

      // Fallback: extract from package name
      const parts = pkgLower.split('.');
      const last = parts[parts.length - 1];
      // Capitalize first letter
      return last.charAt(0).toUpperCase() + last.slice(1);
    };

    const getIconAndCategory = (packageName: string) => {
      const p = packageName.toLowerCase();
      if (p.includes('tiktok') || p.includes('musically') || p.includes('trill')) {
        return { iconUrl: 'https://img.icons8.com/color/96/tiktok--v1.png', category: 'Red social' };
      }
      if (p.includes('instagram')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/instagram-new.png', category: 'Red social' };
      }
      if (p.includes('facebook') || p.includes('orca')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/facebook-new.png', category: 'Red social' };
      }
      if (p.includes('twitter') || p.includes('x.')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/twitterx.png', category: 'Red social' };
      }
      if (p.includes('snapchat')) {
         return { iconUrl: 'https://img.icons8.com/fluency/96/snapchat.png', category: 'Red social' };
      }
      if (p.includes('linkedin')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/linkedin.png', category: 'Profesional' };
      }
      if (p.includes('pinterest')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/pinterest.png', category: 'Red social' };
      }
      if (p.includes('reddit')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/reddit.png', category: 'Red social' };
      }

      // Communication
      if (p.includes('whatsapp')) {
        return { iconUrl: 'https://img.icons8.com/color/96/whatsapp--v1.png', category: 'Mensajería' };
      }
      if (p.includes('telegram') || p.includes('org.telegram')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/telegram-app.png', category: 'Mensajería' };
      }
      if (p.includes('discord')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/discord-logo.png', category: 'Comunicación' };
      }
      if (p.includes('teams') || p.includes('microsoft.teams')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/microsoft-teams-2019.png', category: 'Trabajo' };
      }
      if (p.includes('gmail') || p.includes('android.gm')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/gmail.png', category: 'Productividad' };
      }

      // Entertainment & Media
      if (p.includes('youtube')) {
        return { iconUrl: 'https://img.icons8.com/color/96/youtube-play.png', category: 'Video' };
      }
      if (p.includes('spotify')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/spotify.png', category: 'Música' };
      }
      if (p.includes('netflix')) {
         return { iconUrl: 'https://img.icons8.com/fluency/96/netflix.png', category: 'Entretenimiento' };
      }
      if (p.includes('twitch')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/twitch.png', category: 'Entretenimiento' };
      }

      // Tools & Utilities
      if (p.includes('chrome') || p.includes('brave') || p.includes('browser')) {
        return { iconUrl: 'https://img.icons8.com/color/96/chrome.png', category: 'Navegación' };
      }
      if (p.includes('maps') || p.includes('google.android.apps.maps')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/google-maps-new.png', category: 'Viajes' };
      }
      if (p.includes('uber')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/uber.png', category: 'Viajes' };
      }
      if (p.includes('amazon')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/amazon.png', category: 'Compras' };
      }
      if (p.includes('settings') || p.includes('ajustes')) {
        return { iconUrl: 'https://img.icons8.com/fluency/96/settings.png', category: 'Sistema' };
      }

      return { iconName: 'apps' as const, category: 'N/D' };
    };

    return topApps.map((app) => {
      const totalSeconds = app.totalTimeInForeground;
      const hoursDecimal = (totalSeconds / 3600).toFixed(1);
      const percentage =
        totalTopSeconds > 0
          ? `${Math.round((totalSeconds / totalTopSeconds) * 100)}%`
          : '0%';

      const baseName = getDisplayName(app.packageName, app.appName);
      const { iconName, iconUrl, category } = getIconAndCategory(app.packageName.toLowerCase());

      return {
        name: baseName,
        time: `${hoursDecimal} h`,
        category,
        percentage,
        iconName,
        iconUrl,
        color: theme.colors.primary,
      };
    });
  }, [todayAppUsage, theme.colors.primary]);

  const interactionStats = useMemo(() => {
    const taps = todayMetrics?.tapsCount ?? 0;
    const scrolls = todayMetrics?.scrollEvents ?? 0;
    const totalUsageSeconds = todayAppUsage?.reduce(
      (acc, item) => acc + item.totalTimeInForeground,
      0
    ) ?? 0;
    const totalUsageMinutes = totalUsageSeconds / 60;
    const tapsPerMinute =
      totalUsageMinutes > 0 ? (taps / totalUsageMinutes).toFixed(1) : '0.0';
    const scrollsPerMinute =
      totalUsageMinutes > 0 ? (scrolls / totalUsageMinutes).toFixed(1) : '0.0';

    return [
      { label: 'Taps hoy', value: taps, color: theme.colors.primary },
      { label: 'Scrolls hoy', value: scrolls, color: theme.colors.primary },
      { label: 'Taps/min', value: tapsPerMinute, unit: '', color: theme.colors.primary },
      { label: 'Scrolls/min', value: scrollsPerMinute, unit: '', color: theme.colors.primary },
    ];
  }, [todayMetrics, todayAppUsage, theme.colors.primary]);

  const handleShare = async () => {
    try {
      if (viewRef.current) {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 0.8,
        });

        if (await Sharing.isAvailableAsync()) {
           await Sharing.shareAsync(uri);
        } else {
           // Fallback text
           const level = blockingRisk?.level || 'low';
           const screenPercent = blockingRisk?.usedPercent || 0;
           const focusLevel = Math.max(0, Math.floor(100 - screenPercent));
           await Share.share({
             message: `🚀 Mi nivel de enfoque hoy: ${focusLevel}% con MindPause.`,
           });
        }
      }
      setShareModalVisible(false);
    } catch (error: any) {
      console.log("Error sharing image:", error);
      Alert.alert("Error", "No se pudo compartir la imagen. Intentando texto...");
       // Fallback text
       try {
         const level = blockingRisk?.level || 'low';
         const screenPercent = blockingRisk?.usedPercent || 0;
         const focusLevel = Math.max(0, Math.floor(100 - screenPercent));
         await Share.share({
           message: `🚀 Mi nivel de enfoque hoy: ${focusLevel}% con MindPause.`,
         });
       } catch (e) {}
    }
  };

  const todayDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      
      {/* Share Preview Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.elevation.level2 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Vista Previa</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
            
            <View 
              ref={viewRef}
              collapsable={false}
              style={styles.cardPreview}
            >
              <SocialShareView 
                screenTimePercent={blockingRisk?.usedPercent || 0}
                riskLevel={blockingRisk?.level || 'low'}
                date={todayDate}
              />
            </View>

            <Text style={[styles.modalNote, { color: theme.colors.onSurfaceVariant }]}>
              Comparte este resumen con tus amigos o en redes sociales.
            </Text>

            <Button 
              mode="contained" 
              onPress={handleShare}
              style={styles.shareButton}
              icon="share-variant"
            >
              Compartir Ahora
            </Button>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} tintColor={theme.colors.primary} />}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
           <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Intensidad de uso</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShareModalVisible(true)}>
           <Ionicons name="share-social-outline" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity>
          <Text style={[styles.tabText, styles.tabTextActive, { color: theme.colors.primary }]}>Semana</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
          <UsageChart data={chartData} />
      )}

      {/* {(isLoading || isFetching || refreshing) ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <StatSummaryRow stats={interactionStats} />
      )} */}

      {(isLoading || isFetching || refreshing) ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <AppUsageList apps={appsData} />
      )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  subHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  tabText: {
    fontSize: 16,
  },
  tabTextActive: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.sectionTitle,
    fontSize: 18,
  },
  cardPreview: {
    width: '100%',
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalNote: {
    textAlign: 'center',
    marginBottom: spacing.md,
    ...typography.body2,
    opacity: 0.8,
  },
  shareButton: {
    width: '100%',
    borderRadius: 8,
  },
});
