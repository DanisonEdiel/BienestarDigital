import { StyleSheet } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useState } from 'react';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ThemedView style={styles.container}>
      <List.Section>
        <List.Subheader>Ajustes</List.Subheader>
        <List.Item
          title="Notificaciones"
          right={() => (
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          )}
        />
      </List.Section>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});