import { StyleSheet } from 'react-native';
import { Card, List } from 'react-native-paper';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useData } from '@/hooks/use-data';

type DieselStats = {
  totalLiters: number;
  avgPerDay: number;
  lastFillUps: { date: string; liters: number }[];
};

export default function StatsScreen() {
  const { data, isLoading, error } = useData<DieselStats>('/diesel/stats');

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !data) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Error al cargar estadísticas</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Card>
        <Card.Title title="Consumo de diésel" subtitle="Resumen" />
        <Card.Content>
          <List.Item title={`Total litros`} description={`${data.totalLiters}`} left={(p) => <List.Icon {...p} icon="gas-station" />} />
          <List.Item title={`Promedio diario`} description={`${data.avgPerDay}`} left={(p) => <List.Icon {...p} icon="chart-line" />} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Últimos cargues" />
        <Card.Content>
          {data.lastFillUps.map((f, idx) => (
            <List.Item
              key={`${f.date}-${idx}`}
              title={new Date(f.date).toLocaleDateString()}
              description={`${f.liters} L`}
              left={(p) => <List.Icon {...p} icon="calendar" />}
            />
          ))}
        </Card.Content>
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 8,
  },
});