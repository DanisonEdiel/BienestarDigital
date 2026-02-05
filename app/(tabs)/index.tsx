import { DaySelector } from "@/components/Home/DaySelector";
import { ProgramCard } from "@/components/Home/ProgramCard";
import { StatCard } from "@/components/Home/StatCard";
import { ThemedView } from "@/components/themed-view";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { spacing } from "@/constants/theme/spacing";
import { typography } from "@/constants/theme/typography";
import { useDigitalWellbeing } from "@/hooks/useDigitalWellbeing";
import {
  ScreenTimeSummary,
  useBlockingRisk,
  useEmotionSummary,
  useScreenTimeSummary,
} from "@/hooks/useMetrics";
import { usePrograms } from "@/hooks/usePrograms";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Configure notifications to show alerts even when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoaded } = useUser();
  const {
    hasPermission,
    hasAccessibility,
    requestPermission,
    requestAccessibility,
    refresh: refreshWellbeing,
  } = useDigitalWellbeing();
  const {
    data: screenSummary,
    refetch: refetchScreen,
    isLoading: isScreenLoading,
    isFetching: isScreenFetching,
  } = useScreenTimeSummary();
  const {
    data: emotionSummary,
    refetch: refetchEmotion,
    isLoading: isEmotionLoading,
    isFetching: isEmotionFetching,
  } = useEmotionSummary();
  const {
    data: blockingRisk,
    isLoading: isRiskLoading,
    isFetching: isRiskFetching,
    refetch: refetchRisk,
  } = useBlockingRisk();
  const {
    data: programs,
    isLoading: isProgramsLoading,
    refetch: refetchPrograms,
  } = usePrograms(true);

  // Helper para semaforización de estrés
  const getStressColor = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("bajo") || l.includes("relajado") || l.includes("feliz") || l.includes("bien")) return "#4CAF50"; // Verde
    if (l.includes("medio") || l.includes("normal") || l.includes("neutral")) return "#FF9800"; // Naranja
    return theme.colors.error; // Rojo
  };

  // Helper para semaforización de tiempo de uso
  const getScreenTimeColor = (percent: number) => {
    if (percent < 75) return "#4CAF50";
    if (percent < 90) return "#FF9800";
    return theme.colors.error;
  };

  // Helper para semaforización de riesgo de bloqueo
  const getRiskColor = (percent: number) => {
    if (percent < 40) return "#4CAF50"; // Bajo riesgo
    if (percent < 75) return "#FF9800"; // Riesgo medio
    return theme.colors.error; // Alto riesgo
  };

  const stressLabel = emotionSummary?.label ?? "Alto";
  const stressColor = getStressColor(stressLabel);

  const usagePercent = screenSummary?.usedPercent ?? 0;
  const usageColor = getScreenTimeColor(usagePercent);

  const riskPercent = blockingRisk?.percent ?? 0;
  const riskColor = getRiskColor(riskPercent);

  // Construye los próximos 5 días a partir de hoy, marcando hoy como activo
  const days = React.useMemo(() => {
    const today = new Date();
    const result: { label: string; number: string; active?: boolean }[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push({
        label: DAY_LABELS[d.getDay()],
        number: String(d.getDate()),
        active: i === 0,
      });
    }
    return result;
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchScreen(),
        refetchEmotion(),
        refetchRisk(),
        refetchPrograms(),
        Promise.resolve(refreshWellbeing()),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchScreen, refetchEmotion, refetchRisk, refreshWellbeing]);

  // Sincronizar notificaciones/alarmas para programas activos
  React.useEffect(() => {
    if (isProgramsLoading || !programs) return;

    const syncNotifications = async () => {
      try {
        // 1. Obtener notificaciones programadas
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        
        // 2. Cancelar notificaciones de programas (identificadas por prefijo 'program-')
        const programNotifications = scheduled.filter(n => n.identifier.startsWith('program-'));
        await Promise.all(programNotifications.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));

        for (const program of programs) {
          if (!program.is_active) continue;

          const [hourStr, minuteStr] = program.start_time.split(':');
          const hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);

          if (isNaN(hour) || isNaN(minute)) {
            console.warn(`Invalid time for program ${program.id}: ${program.start_time}`);
            continue;
          }
          
          for (const day of program.days_of_week) {
            // Mapeo: JS 0 (Dom) -> Expo 1 (Dom)
            // JS 0-6 => Expo 1-7
            const weekday = Number(day) + 1;
            const identifier = `program-${program.id}-${day}`;
            
            try {
              // En Android, el tipo 'calendar' a veces falla o requiere 'daily'/'weekly'.
              // La documentación sugiere usar SchedulableTriggerInputTypes.WEEKLY para días específicos en Android si calendar falla.
              // Sin embargo, lo más compatible multiplataforma para "repetir semanalmente" es usar trigger de día + hora.
              // PERO, Expo en Android tiene limitaciones con 'calendar'.
              // Solución: Usar 'weekly' si está disponible o fallback a 'daily' si es necesario, 
              // pero la API unificada es 'calendar' (que falló).
              // Intentaremos usar la interfaz simplificada que Expo recomienda para repeticiones:
              // { hour, minute, repeats: true } es diario.
              // Para semanal, necesitamos calcular el tiempo hasta el próximo día deseado o usar 'weekday' si el trigger lo soporta.
              
              // REVISIÓN: El error dice explícitamente "Trigger of type: calendar is not supported on Android".
              // Esto significa que debemos usar 'daily' (diario) o 'weekly' (semanal).
              // Expo Notifications en Android soporta 'daily' y 'weekly'.
              
              await Notifications.scheduleNotificationAsync({
                identifier,
                content: {
                  title: `⏰ Recordatorio: ${program.title}`,
                  body: `Es hora de tu programa "${program.title}". ¡Tómate un descanso!`,
                  sound: true,
                  priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                  weekday, // 1-7
                  hour,
                  minute,
                },
              });
              console.log(`Scheduled notification for ${program.title} on weekday ${weekday} at ${hour}:${minute}`);
            } catch (err) {
              console.error(`Failed to schedule notification for ${program.title}:`, err);
            }
          }
        }
      } catch (error) {
        console.error("Error syncing program notifications:", error);
      }
    };

    syncNotifications();
  }, [programs, isProgramsLoading]);

  if (!isLoaded) {
    return (
      <ThemedView
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ThemedView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isScreenFetching || isEmotionFetching}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.onSurface }]}>
              Hola, {user?.firstName || "Usuario"}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Desconecta para conectar
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={32}
                color={theme.colors.onSurface}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Selector de días / Riesgo de bloqueo */}
        <DaySelector 
          days={days} 
          progressPercent={blockingRisk?.percent ?? 0} 
          barColor={riskColor} 
          riskDetails={blockingRisk}
        />
        
        {/* Desglose de Riesgo (Deep Dive) */}
        {/* <RiskBreakdown riskData={blockingRisk} isLoading={isRiskLoading || isRiskFetching} /> */}

        {isRiskLoading || isRiskFetching ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={{ marginTop: spacing.xs }}
          />
        ) : null}

        {/* Permisos Warning: Uso de Apps */}
        {Platform.OS === "android" && !hasPermission && (
          <View
            style={[
              styles.permissionAlert,
              {
                backgroundColor: theme.colors.errorContainer,
                borderColor: theme.colors.error,
              },
            ]}
          >
            <Text
              style={[
                styles.permissionText,
                { color: theme.colors.onErrorContainer },
              ]}
            >
              ⚠️ Se requiere permiso de Uso de Apps para medir el tiempo.
            </Text>
            <Button
              mode="contained"
              onPress={requestPermission}
              style={styles.permissionBtn}
              buttonColor={theme.colors.error}
            >
              Activar Permiso de Uso
            </Button>
          </View>
        )}

        {/* Permisos Warning: Accesibilidad */}
        {Platform.OS === "android" && !hasAccessibility && (
          <View
            style={[
              styles.permissionAlert,
              {
                backgroundColor: theme.colors.errorContainer,
                borderColor: theme.colors.error,
              },
            ]}
          >
            <Text
              style={[
                styles.permissionText,
                { color: theme.colors.onErrorContainer },
              ]}
            >
              ⚠️ Activa el Servicio de Accesibilidad para contar taps y scrolls.
            </Text>
            <Button
              mode="contained"
              onPress={requestAccessibility}
              style={styles.permissionBtn}
              buttonColor={theme.colors.error}
            >
              Activar Accesibilidad
            </Button>
          </View>
        )}

        {/* Estadísticas Dummy (Originales) */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Análisis de Bienestar
        </Text>
        <View style={styles.statsRow}>
          <StatCard
            title="Estrés"
            subtitle="Últimas 24 horas"
            icon="pulse-outline"
            accentColor={stressColor}
            status={
              isEmotionLoading
                ? "Cargando..."
                : stressLabel
            }
          >
            {isEmotionLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <View style={styles.chartPlaceholder}>
                {[40, 60, 30, 80, 50, 70, 40].map((h, i) => (
                  <View
                    key={i}
                    style={[
                      styles.bar,
                      {
                        height: h,
                        backgroundColor:
                          i % 2 === 0
                            ? theme.colors.secondaryContainer
                            : stressColor,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </StatCard>

          <ScreenTimeCard
            key={screenSummary?.dailyLimitSeconds ?? 'no-limit'}
            screenSummary={screenSummary}
            isLoading={isScreenLoading}
            theme={theme}
          />
        </View>

        {/* Programas */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Programas
          </Text>
          <TouchableOpacity onPress={() => router.push("/programs")}>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Ver más
            </Text>
          </TouchableOpacity>
        </View>

        {isProgramsLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : programs && programs.length > 0 ? (
          programs
            .slice(0, 5)
            .map((program) => (
              <ProgramCard
                key={program.id}
                id={program.id}
                title={program.title}
                time={`${program.start_time} - ${program.end_time}`}
                icon={program.icon}
              />
            ))
        ) : (
          <Text
            style={{
              color: theme.colors.onSurfaceVariant,
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            No hay programas activos.
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/assistant")}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color={theme.colors.onPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.title,
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  notificationBtn: {
    padding: spacing.xs,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  chartPlaceholder: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
    width: "100%",
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  circleChart: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontWeight: "700",
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  linkText: {
    fontWeight: "600",
  },
  metricText: {
    fontSize: 12,
    marginBottom: 4,
  },
  permissionAlert: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  permissionText: {
    fontSize: 12,
    marginBottom: 5,
  },
  permissionBtn: {
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

const ScreenTimeCard = ({
  screenSummary,
  isLoading,
  theme,
}: {
  screenSummary: ScreenTimeSummary | undefined;
  isLoading: boolean;
  theme: any;
}) => {
  // We bundle endTime and dailyLimit together to ensure they are always consistent
  // and prevent race conditions where one updates before the other.
  const [timerState, setTimerState] = React.useState<{ endTime: number | null; limit: number }>({
    endTime: null,
    limit: 0
  });
  
  const [hasNotified80, setHasNotified80] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(screenSummary?.remainingSeconds ?? 0);

  // Initialize/Update timer target when data fetches
  React.useEffect(() => {
    if (screenSummary && screenSummary.dailyLimitSeconds > 0) {
      // Calculate projected end time based on remaining seconds
      const remaining = screenSummary.remainingSeconds;
      const end = Date.now() + remaining * 1000;
      
      setTimerState({
        endTime: end,
        limit: screenSummary.dailyLimitSeconds
      });
      
      setTimeLeft(remaining);
      
      // Reset notification flag if limit changed significantly or we are starting over
      setHasNotified80(false);
    }
  }, [screenSummary?.dailyLimitSeconds, screenSummary?.remainingSeconds]);

  // Timer tick - updates timeLeft based on endTime
  React.useEffect(() => {
    if (!timerState.endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((timerState.endTime! - now) / 1000));
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.endTime]);

  const dailyLimit = screenSummary?.dailyLimitSeconds ?? 0;
  const usedFromSummary = screenSummary?.usedSeconds ?? 0;
  
  // Calculate percentage based on current timeLeft or actual usage
  // used = limit - remaining (for countdown)
  const localUsed = Math.max(0, dailyLimit - timeLeft);
  
  // If limit is reached (timeLeft == 0), show the actual total usage from summary
  // to prevent capping at 100% visually if the user has exceeded it.
  const displayUsed = timeLeft === 0 ? Math.max(localUsed, usedFromSummary) : localUsed;
  
  const percent =
    dailyLimit > 0 ? Math.round((displayUsed / dailyLimit) * 100) : 0;

  const getScreenTimeColor = (p: number) => {
    if (p < 75) return "#4CAF50";
    if (p < 90) return "#FF9800";
    return theme.colors.error;
  };

  const usageColor = getScreenTimeColor(percent);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`; 
  };

  // Notification Logic - Predictive Scheduling
  React.useEffect(() => {
    let notificationId: string | null = null;
    const { endTime, limit } = timerState;

    async function schedulePrediction() {
      if (limit <= 0 || !endTime) {
        return;
      }

      // Calculate when we hit 80% usage
      // 80% usage means 20% remaining time left
      const remainingSecondsAt80 = limit * 0.2;
      const timeAt80 = endTime - (remainingSecondsAt80 * 1000);
      const now = Date.now();
      
      console.log(`[NotificationDebug] Limit: ${limit}, EndTime: ${new Date(endTime).toISOString()}, Now: ${new Date(now).toISOString()}`);
      console.log(`[NotificationDebug] TimeAt80: ${new Date(timeAt80).toISOString()}, RemainingSecondsAt80: ${remainingSecondsAt80}`);
      
      // If we are already past the 80% mark
      if (now >= timeAt80) {
        if (!hasNotified80) {
          console.log("[NotificationDebug] Already past 80%, notifying immediately");
          
          // Safety check: ensure we really have used > 75%
          const calculatedUsedPercent = limit > 0 ? ((limit - (endTime - now)/1000) / limit) * 100 : 0;
          if (calculatedUsedPercent < 75) {
             console.log(`[NotificationDebug] Aborting immediate notification - calculated percent ${calculatedUsedPercent}% is too low.`);
             return;
          }

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Límite de pantalla",
              body: `Has alcanzado el 80% de tu límite diario. Quedan ${formatTime(Math.max(0, (endTime - now)/1000))}.`,
              sound: true,
            },
            trigger: null, // Immediate
          });
          setHasNotified80(true);
        }
        return;
      }

      // Schedule for the future
      try {
        // Calculate delay in seconds
        const secondsUntil80 = (timeAt80 - now) / 1000;
        
        console.log(`[NotificationDebug] Scheduling 80% notification in ${secondsUntil80} seconds`);
        
        // Ensure delay is positive and reasonable (e.g. > 1 second)
        if (secondsUntil80 > 1) {
          notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Límite de pantalla",
              body: `Has alcanzado el 80% de tu límite diario.`,
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: Math.floor(secondsUntil80),
              repeats: false,
            },
          });
        }
      } catch (err) {
        console.error("Failed to schedule notification:", err);
      }
    }

    schedulePrediction();

    return () => {
      if (notificationId) {
        Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    };
  }, [timerState]); // Depends only on the bundled state

  // Need a separate effect to update hasNotified80 if we cross the threshold locally
  // But since we scheduled it, the OS handles it. 
  // However, if the user keeps the app open, we want to flag it as "done" so we don't reschedule.
  React.useEffect(() => {
     if (dailyLimit > 0 && percent >= 80 && !hasNotified80) {
        setHasNotified80(true);
     } else if (percent < 80 && hasNotified80) {
        setHasNotified80(false);
     }
  }, [percent, dailyLimit]);


  return (
    <StatCard
      title="Tiempo uso"
      subtitle="Hoy"
      icon="time-outline"
      accentColor={usageColor}
      value={
        screenSummary && dailyLimit > 0 ? (
          isLoading ? (
            "Cargando..."
          ) : timeLeft === 0 && percent >= 100 ? (
            <Text style={{ color: theme.colors.error, fontWeight: 'bold', textAlign: 'right' }}>
              Límite alcanzado{'\n'}
              <Text style={{ fontWeight: 'normal', fontSize: 11 }}>
                {formatTime(displayUsed)} uso total
              </Text>
            </Text>
          ) : (
            <Text style={{ color: theme.colors.onSurface }}>
              {formatTime(timeLeft)} restantes
            </Text>
          )
        ) : (
          "Sin límite configurado"
        )
      }
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <CircularProgress
          size={80}
          strokeWidth={8}
          percent={dailyLimit > 0 ? Math.min(percent, 100) : 0}
          trackColor={theme.colors.surfaceVariant}
          progressColor={usageColor}
        >
          <Text style={[styles.circleText, { color: theme.colors.onSurface }]}>
            {dailyLimit > 0 ? `${percent}%` : "--"}
          </Text>
        </CircularProgress>
      )}
    </StatCard>
  );
};
