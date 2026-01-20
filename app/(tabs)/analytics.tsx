import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme/spacing';
import { UsageChart } from '@/components/Analytics/UsageChart';
import { StatSummaryRow } from '@/components/Analytics/StatSummaryRow';
import { AppUsageList } from '@/components/Analytics/AppUsageList';
import { useInteractionHistory } from '@/hooks/useMetrics';
import { useDigitalWellbeing } from '@/hooks/useDigitalWellbeing';

// Dummy Data (Fallback)
const CHART_DATA_FALLBACK = [
  { day: 'Dom', tapsValue: 0, scrollsValue: 0, tapsRaw: 0, scrollsRaw: 0 },
  { day: 'Lun', tapsValue: 0, scrollsValue: 0, tapsRaw: 0, scrollsRaw: 0 },
  { day: 'Mar', tapsValue: 0, scrollsValue: 0, tapsRaw: 0, scrollsRaw: 0 },
  { day: 'Mie', tapsValue: 0, scrollsValue: 0, tapsRaw: 0, scrollsRaw: 0 },
  { day: 'Jue', tapsValue: 0, scrollsValue: 0, tapsRaw: 0, scrollsRaw: 0 },
  { day: 'Vie', tapsValue: 0, scrollsValue: 0, tapsRaw: 0, scrollsRaw: 0 },
  { day: 'Sab', tapsValue: 0, scrollsValue: 0, tapsRaw: 0, scrollsRaw: 0 },
];

const APPS_DATA_FALLBACK = [
  { name: 'TikTok', time: '2.0 h', category: 'Alto', percentage: '60%', color: '#000000' },
  { name: 'Clash Royale', time: '1.0 h', category: 'Medio', percentage: '40%', color: '#5B8DEF' },
];

export default function AnalyticsScreen() {
  // ... existing code ...
  const { data: interactionHistory, isLoading, isFetching, refetch: refetchHistory } = useInteractionHistory('week');
  const { metrics: todayMetrics, appUsage: todayAppUsage, refresh: refreshWellbeing } = useDigitalWellbeing();
  const [refreshing, setRefreshing] = React.useState(false);
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
    // Generate the last 7 days including today
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
      if (packageName.includes('tiktok')) {
        return { iconName: 'logo-instagram' as const, category: 'Red social' };
      }
      if (packageName.includes('instagram')) {
        return { iconName: 'logo-instagram' as const, category: 'Red social' };
      }
      if (packageName.includes('facebook') || packageName.includes('orca')) {
        return { iconName: 'logo-facebook' as const, category: 'Red social' };
      }
      if (packageName.includes('whatsapp')) {
        return { iconName: 'logo-whatsapp' as const, category: 'Mensajería' };
      }
      if (packageName.includes('youtube')) {
        return { iconName: 'logo-youtube' as const, category: 'Video' };
      }
      if (packageName.includes('twitter') || packageName.includes('x.')) {
        return { iconName: 'logo-twitter' as const, category: 'Red social' };
      }
      if (packageName.includes('chrome') || packageName.includes('brave') || packageName.includes('browser')) {
        return { iconName: 'globe-outline' as const, category: 'Navegación' };
      }
      if (packageName.includes('settings') || packageName.includes('ajustes')) {
        return { iconName: 'settings-outline' as const, category: 'Sistema' };
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
      const { iconName, category } = getIconAndCategory(app.packageName.toLowerCase());

      return {
        name: baseName,
        time: `${hoursDecimal} h`,
        category,
        percentage,
        iconName,
        color: colors.primary,
      };
    });
  }, [todayAppUsage]);

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
      { label: 'Taps hoy', value: taps, color: colors.primary },
      { label: 'Scrolls hoy', value: scrolls, color: colors.primary },
      { label: 'Taps/min', value: tapsPerMinute, unit: '', color: colors.primary },
      { label: 'Scrolls/min', value: scrollsPerMinute, unit: '', color: colors.primary },
    ];
  }, [todayMetrics, todayAppUsage]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} tintColor={colors.primary} />}>
      {/* Header Customization for Drawer/Stack */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Intensidad de uso</Text>
        <TouchableOpacity style={styles.iconBtn}>
           <Ionicons name="share-social-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity>
          <Text style={[styles.tabText, styles.tabTextActive]}>Semana</Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
      ) : (
          <UsageChart data={chartData} />
      )}

      {/* Stats Row: Interacciones reales de hoy */}
      {(isLoading || isFetching || refreshing) ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <StatSummaryRow stats={interactionStats} />
      )}

      {/* App List */}
      {(isLoading || isFetching || refreshing) ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <AppUsageList apps={appsData} />
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
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
    color: colors.textPrimary,
  },
  subHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
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
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
