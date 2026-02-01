import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { colors } from "@/constants/theme/colors";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

const { width } = Dimensions.get("window");

type Step = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  cta: string;
};

const STEPS: Step[] = [
  {
    key: "welcome",
    icon: "hourglass-outline",
    title: "Bienestar Digital",
    subtitle: "Recupera el control de tu tiempo y atención.",
    cta: "Empezar",
  },
  {
    key: "focus",
    icon: "leaf-outline",
    title: "Desconecta para conectar",
    subtitle: "Reduce el estrés y mejora tu presencia en el mundo real.",
    cta: "Continuar",
  },
  {
    key: "stats",
    icon: "bar-chart-outline",
    title: "Visualiza tu progreso",
    subtitle: "Estadísticas claras para entender tus hábitos digitales.",
    cta: "Entrar",
  },
];

export default function Onboarding() {
  const { isSignedIn } = useAuth();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Step>>(null);

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  const next = () => {
    if (index < STEPS.length - 1) {
      const i = index + 1;
      setIndex(i);
      listRef.current?.scrollToIndex({ index: i, animated: true });
    } else {
      router.replace("/auth/sign-in");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={listRef}
        data={STEPS}
        horizontal
        pagingEnabled
        style={{ flex: 1 }}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          const i = Math.round(ev.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <View style={styles.iconWrap}>
              <LinearGradient
                colors={["#E0EBFF", "#F5F9FF"]}
                style={styles.iconBackground}
              >
                <Ionicons name={item.icon} size={80} color={colors.primary} />
              </LinearGradient>
            </View>
            <ThemedText type="title" style={styles.title}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
            <View style={styles.dots}>
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === index ? styles.dotActive : undefined,
                  ]}
                />
              ))}
            </View>
            <Button
              mode="contained"
              onPress={next}
              style={styles.button}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 16, fontWeight: "600" }}
              buttonColor={colors.primary}
            >
              {item.cta}
            </Button>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  iconWrap: {
    marginBottom: 40,
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 16,
    color: colors.textPrimary,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 48,
    lineHeight: 24,
  },
  dots: {
    flexDirection: "row",
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E5EA",
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  button: {
    width: "100%",
    borderRadius: 16,
  },
});
