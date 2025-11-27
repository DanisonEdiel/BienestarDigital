import { StyleSheet, Pressable, FlatList } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useData } from '@/hooks/use-data';

type Post = { id: number; title: string };

export default function DataScreen() {
  const { data, isLoading, error, create } = useData<Post[], Partial<Post>>('/posts');

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Cargando webonazo...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>weso</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Data</ThemedText>
      <Pressable
        style={styles.button}
        onPress={async () => {
          await create({ title: 'New post' });
        }}
      >
        <ThemedText type="defaultSemiBold">Create</ThemedText>
      </Pressable>
      <FlatList
        data={(data ?? []).slice(0, 10)}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ThemedText style={styles.item}>{item.title}</ThemedText>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  item: {
    paddingVertical: 8,
  },
});