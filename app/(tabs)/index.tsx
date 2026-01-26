import { DaySelector } from "@/components/Home/DaySelector";
import { ProgramCard } from "@/components/Home/ProgramCard";
import { StatCard } from "@/components/Home/StatCard";
import { ThemedView } from "@/components/themed-view";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { spacing } from "@/constants/theme/spacing";
import { typography } from "@/constants/theme/typography";
import { useDigitalWellbeing } from "@/hooks/useDigitalWellbeing";
import {
  useBlockingRisk,
  useEmotionSummary,
  useScreenTimeSummary,
} from "@/hooks/useMetrics";
import { usePrograms } from "@/hooks/usePrograms";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  } = usePrograms();

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
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Selector de días */}
        <DaySelector days={days} progressPercent={blockingRisk?.percent ?? 0} barColor={riskColor} />
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

          <StatCard
            title="Tiempo uso"
            subtitle="Hoy"
            icon="time-outline"
            accentColor={usageColor}
            value={
              screenSummary && screenSummary.dailyLimitSeconds > 0 ? (
                isScreenLoading ? (
                  "Cargando..."
                ) : (
                  <CountdownText
                    seconds={screenSummary.remainingSeconds}
                    color={theme.colors.onSurface}
                  />
                )
              ) : (
                "Sin límite configurado"
              )
            }
          >
            {isScreenLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <CircularProgress
                size={80}
                strokeWidth={8}
                percent={
                  screenSummary && screenSummary.dailyLimitSeconds > 0
                    ? screenSummary.usedPercent
                    : 0
                }
                trackColor={theme.colors.surfaceVariant}
                progressColor={usageColor}
              >
                <Text
                  style={[styles.circleText, { color: theme.colors.onSurface }]}
                >
                  {screenSummary && screenSummary.dailyLimitSeconds > 0
                    ? `${screenSummary.usedPercent}%`
                    : "--"}
                </Text>
              </CircularProgress>
            )}
          </StatCard>
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

const CountdownText = ({
  seconds,
  color,
}: {
  seconds: number;
  color?: string;
}) => {
  const [timeLeft, setTimeLeft] = React.useState(seconds);

  React.useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s restantes`;
  };

  return <Text style={{ color }}>{formatTime(timeLeft)}</Text>;
};
