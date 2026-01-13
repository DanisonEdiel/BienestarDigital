import { useEffect, useRef } from 'react';
import { AppState, NativeModules, Platform, AppStateStatus } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { api } from '@/lib/api';

const { InteractionModule } = NativeModules;

export function useInteractionSync() {
  const { userId, isSignedIn } = useAuth();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Only run if signed in, on Android, and the native module exists
    if (!isSignedIn || !userId || Platform.OS !== 'android') return;

    const syncMetrics = async () => {
      try {
        if (InteractionModule && InteractionModule.getDailyMetrics) {
          const metrics = await InteractionModule.getDailyMetrics();
          if (metrics) {
            console.log('Syncing metrics:', metrics);
            await api.post(`/metrics/interactions?clerkId=${userId}`, {
              recordDate: metrics.recordDate,
              tapsCount: metrics.tapsCount,
              scrollEvents: metrics.scrollEvents,
              avgScrollSpeed: metrics.avgScrollSpeed || 0,
            });
          }
        } else {
            console.warn('InteractionModule not found. Ensure you are running on a native build with the module linked.');
        }
      } catch (error) {
        console.error('Failed to sync metrics:', error);
      }
    };

    syncMetrics();
    // Sync on background -> active transition
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        syncMetrics();
      }
      appState.current = nextAppState;
    });

    // Periodic sync
    const interval = setInterval(syncMetrics, 15 * 60 * 1000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [userId, isSignedIn]);
}
