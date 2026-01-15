import { useEffect, useState, useRef } from 'react';
import { NativeModules, AppState, AppStateStatus, Platform } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { api } from '@/lib/api';

const { InteractionModule } = NativeModules;

export interface DailyMetrics {
  recordDate: string;
  tapsCount: number;
  scrollEvents: number;
  avgScrollSpeed: number;
}

export interface AppUsage {
  packageName: string;
  totalTimeInForeground: number; // seconds
}

export function useDigitalWellbeing() {
  const { userId, isSignedIn } = useAuth();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const checkPermission = async () => {
    if (Platform.OS === 'android' && InteractionModule?.checkUsagePermission) {
      const has = await InteractionModule.checkUsagePermission();
      setHasPermission(has);
      return has;
    }
    return false;
  };

  const requestPermission = () => {
    if (Platform.OS === 'android' && InteractionModule?.requestUsagePermission) {
      InteractionModule.requestUsagePermission();
    }
  };

  const fetchData = async () => {
    if (!isSignedIn || !userId || Platform.OS !== 'android' || !InteractionModule) return;

    try {
      // 1. Get Interaction Metrics
      const dailyMetrics = await InteractionModule.getDailyMetrics();
      setMetrics(dailyMetrics);

      // 2. Get Usage Stats (if permission granted)
      const allowed = await checkPermission();
      if (allowed && InteractionModule.getAppUsage) {
        const usage = await InteractionModule.getAppUsage();
        setAppUsage(usage);
        
        // 3. Sync Usage to Backend
        await api.post(`/metrics/usage?clerkId=${userId}`, {
             usageDate: dailyMetrics.recordDate,
             totalUsageSeconds: usage.reduce((acc: number, item: AppUsage) => acc + item.totalTimeInForeground, 0),
             sessionsCount: 0, // Not calculated yet
             longestSessionSeconds: 0,
             nightUsage: 0,
             details: usage
        });
      }

      // 4. Sync Interactions to Backend
      if (dailyMetrics) {
        await api.post(`/metrics/interactions?clerkId=${userId}`, {
          recordDate: dailyMetrics.recordDate,
          tapsCount: dailyMetrics.tapsCount,
          scrollEvents: dailyMetrics.scrollEvents,
          avgScrollSpeed: dailyMetrics.avgScrollSpeed || 0,
        });
      }

    } catch (error) {
      console.error('Failed to fetch/sync wellbeing data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchData();
      }
      appState.current = nextAppState;
    });

    const interval = setInterval(fetchData, 60 * 1000); // Update every minute

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [userId, isSignedIn]);

  return {
    metrics,
    appUsage,
    hasPermission,
    requestPermission,
    refresh: fetchData
  };
}
