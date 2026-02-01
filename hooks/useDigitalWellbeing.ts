import { api } from '@/lib/api';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, NativeModules, Platform } from 'react-native';

const { InteractionModule } = NativeModules;

export interface DailyMetrics {
  recordDate: string;
  tapsCount: number;
  scrollEvents: number;
  avgScrollSpeed: number;
}

export interface AppUsage {
  packageName: string;
  appName?: string;
  totalTimeInForeground: number;
}

export function useDigitalWellbeing() {
  const { userId, isSignedIn } = useAuth();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [hasAccessibility, setHasAccessibility] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const checkPermission = async () => {
    if (Platform.OS === 'android' && InteractionModule) {
      let usageAllowed = false;
      
      // Check Usage Stats Permission
      if (InteractionModule.checkUsagePermission) {
        usageAllowed = await InteractionModule.checkUsagePermission();
        setHasPermission(usageAllowed);
      }
      
      // Check Accessibility Service
      if (InteractionModule.isAccessibilityServiceEnabled) {
        const accessibilityAllowed = await InteractionModule.isAccessibilityServiceEnabled();
        setHasAccessibility(accessibilityAllowed);
      }
      return usageAllowed;
    }
    return false;
  };

  const requestPermission = () => {
    if (Platform.OS === 'android' && InteractionModule?.requestUsagePermission) {
      InteractionModule.requestUsagePermission();
    }
  };

  const requestAccessibility = () => {
    if (Platform.OS === 'android' && InteractionModule?.requestAccessibilityPermission) {
        InteractionModule.requestAccessibilityPermission();
    }
  };

  const fetchData = async () => {
    if (!isSignedIn || !userId || Platform.OS !== 'android' || !InteractionModule) return;
    try {
      // 1. Retrieve daily interaction metrics fron native module
      const dailyMetrics = await InteractionModule.getDailyMetrics();
      setMetrics(dailyMetrics);

      // 2. Get Usage Stats (if permission granted)
      const allowed = await checkPermission();
      if (allowed && InteractionModule.getAppUsage) {
        const usage = await InteractionModule.getAppUsage();
        setAppUsage(usage);
        
        // 3. Sync Usage metrics with Backend service
        // Fix: nightUsage must be boolean, details removed if not in DTO or backend ignores it
        await api.post(`/metrics/usage?clerkId=${userId}`, {
             usageDate: dailyMetrics.recordDate,
             totalUsageSeconds: Math.floor(usage.reduce((acc: number, item: AppUsage) => acc + item.totalTimeInForeground, 0)),
             sessionsCount: 0, 
             longestSessionSeconds: 0,
             nightUsage: false, // Fixed: boolean instead of number
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
    } catch (error: any) {
      console.error('Failed to fetch/sync wellbeing data:', error?.response?.status, error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
        fetchData();
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchData();
      }
      appState.current = nextAppState;
    });

    const interval = setInterval(fetchData, 5 * 1000); // Update every 5 seconds

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [userId, isSignedIn]); // Added user dependency to re-trigger bootstrap if needed

  return {
    metrics,
    appUsage,
    hasPermission,
    hasAccessibility,
    requestPermission,
    requestAccessibility,
    refresh: fetchData
  };
}