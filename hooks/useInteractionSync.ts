import { useEffect, useRef } from 'react';
import { AppState, NativeModules, Platform, AppStateStatus } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { api } from '@/lib/api';
import * as Notifications from 'expo-notifications';

const { InteractionModule } = NativeModules;

export function useInteractionSync() {
  const { userId, isSignedIn } = useAuth();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const lastNotificationDateRef = useRef<string | null>(null);
  const lastNotificationLevelRef = useRef<number>(0);

  useEffect(() => {
    // Only run if signed in, on Android, and the native module exists
    if (!isSignedIn || !userId || Platform.OS !== 'android') return;

    const ensureNotificationPermissions = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted) {
        await Notifications.requestPermissionsAsync();
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('intensity-alerts', {
          name: 'Alertas de Intensidad',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    const maybeNotifyIntensity = async (metrics: {
      recordDate: string;
      tapsCount: number;
      scrollEvents: number;
    }) => {
      const totalInteractions = (metrics.tapsCount ?? 0) + (metrics.scrollEvents ?? 0);

      let level = 0;
      let title = '';
      let body = '';

      if (totalInteractions >= 1700) {
        level = 5;
        title = 'Uso crítico detectado';
        body =
          'Nivel crítico de uso detectado. Te recomendamos una pausa obligatoria de 5 minutos para cuidar tu salud visual.';
      } else if (totalInteractions >= 1201) {
        level = 4;
        title = 'Uso muy alto';
        body =
          'Has realizado mucha interacción continua. Un descanso de 3–5 minutos puede ayudar a tu vista.';
      } else if (totalInteractions >= 801) {
        level = 3;
        title = 'Uso alto';
        body =
          'Llevas un uso intenso. Considera parpadear y ajustar tu postura.';
      }

      if (level === 0) {
        return;
      }

      const todayStr = metrics.recordDate;

      if (lastNotificationDateRef.current !== todayStr) {
        lastNotificationDateRef.current = todayStr;
        lastNotificationLevelRef.current = 0;
      }

      if (level > lastNotificationLevelRef.current) {
        await ensureNotificationPermissions();

        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { url: '/(tabs)/analytics' },
            // @ts-ignore
            channelId: 'intensity-alerts',
          },
          trigger: null,
        });

        lastNotificationLevelRef.current = level;
      }
    };

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

            await maybeNotifyIntensity({
              recordDate: metrics.recordDate,
              tapsCount: metrics.tapsCount,
              scrollEvents: metrics.scrollEvents,
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
