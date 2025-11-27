import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');

type Step = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  cta: string;
};

const STEPS: Step[] = [
  {
    key: 'welcome',
    icon: 'speedometer',
    title: 'Bienvenido a EcuDiesel',
    subtitle: 'Monitorea consumo y rendimiento de diésel.',
    cta: 'Empezar',
  },
  {
    key: 'fast',
    icon: 'stats-chart',
    title: 'Rápido y confiable',
    subtitle: 'Estadísticas y alertas en tiempo real.',
    cta: 'Continuar',
  },
  {
    key: 'saving',
    icon: 'cash',
    title: 'Ahorra combustible',
    subtitle: 'Optimiza rutas y carga eficiente.',
    cta: 'Entrar',
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Step>>(null);

  const next = () => {
    if (index < STEPS.length - 1) {
      const i = index + 1;
      setIndex(i);
      listRef.current?.scrollToIndex({ index: i, animated: true });
    } else {
      router.replace('/(drawer)/stats');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={listRef}
        data={STEPS}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          const i = Math.round(ev.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={120} color="#0a7ea4" />
            </View>
            <ThemedText type="title" style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
            <View style={styles.dots}>
              {STEPS.map((_, i) => (
                <View key={i} style={[styles.dot, i === index ? styles.dotActive : undefined]} />
              ))}
            </View>
            <Button mode="contained" onPress={next} style={styles.button}>
              {item.cta}
            </Button>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9D1D9',
  },
  dotActive: {
    backgroundColor: '#0a7ea4',
  },
  button: {
    alignSelf: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});