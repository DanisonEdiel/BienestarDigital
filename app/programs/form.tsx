import { CreateProgramDto, useCreateProgram, usePrograms, useUpdateProgram } from '@/hooks/usePrograms';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text, TextInput, useTheme } from 'react-native-paper';
import { measure } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const ICONS = ['hourglass-outline', 'book-outline', 'restaurant-outline', 'bed-outline', 'fitness-outline', 'game-controller-outline'];

export default function ProgramFormScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  
  const { data: programs } = usePrograms();
  const { mutate: createProgram, isPending: isCreating } = useCreateProgram();
  const { mutate: updateProgram, isPending: isUpdating } = useUpdateProgram();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d;
  });
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Lun-Vie default
  const [selectedIcon, setSelectedIcon] = useState('hourglass-outline');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (isEditing && programs) {
      const program = programs.find(p => p.id === params.id);
      if (program) {
        setTitle(program.title);
        setDescription(program.description || '');
        
        const [startH, startM] = program.start_time.split(':').map(Number);
        const s = new Date();
        s.setHours(startH, startM, 0, 0);
        setStartTime(s);

        const [endH, endM] = program.end_time.split(':').map(Number);
        const e = new Date();
        e.setHours(endH, endM, 0, 0);
        setEndTime(e);

        setSelectedDays(
          program.days_of_week
            .map(d => {
              const val = Number(d);
              return val === 7 ? 0 : val;
            }) // Ensure number and map 7->0
            .filter(d => !isNaN(d) && d >= 0 && d <= 6) // Ensure valid range
        );
        setSelectedIcon(program.icon || 'hourglass-outline');
      }
    }
  }, [isEditing, programs, params.id]);

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index].sort((a, b) => a - b));
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    let processedDays = selectedDays.map(d => (d === 7 ? 0 : d));
    
    processedDays = processedDays.filter(d => Number.isInteger(d) && d >= 0 && d <= 6);

    const uniqueDaysSet = new Set(processedDays);
    const sanitizedDays = Array.from(uniqueDaysSet).sort((a, b) => a - b);

    if (sanitizedDays.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un día');
      return;
    }

    const data: CreateProgramDto = {
      title,
      description,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      daysOfWeek: sanitizedDays,
      icon: selectedIcon,
      isActive: true,
    };

    if (isEditing) {
      updateProgram(
        { id: params.id as string, data },
        {
          onSuccess: () => router.back(),
          onError: (err: any) => {
            const message = err.response?.data?.message;
            const errorMsg = typeof message === 'string' ? message : 'Error al actualizar';
            Alert.alert('Error', errorMsg);
          },
        }
      );
    } else {
      createProgram(data, {
        onSuccess: () => router.back(),
        onError: (err: any) => {
          const message = err.response?.data?.message;
          const errorMsg = typeof message === 'string' ? message : 'Error al crear';
          Alert.alert('Error', errorMsg);
        },
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          {isEditing ? 'Editar Programa' : 'Nuevo Programa'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={[styles.saveText, { color: theme.colors.primary }]}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Información Básica</Text>
          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
          />
          <TextInput
            label="Descripción (opcional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Horario</Text>
          <View style={styles.timeRow}>
            <TouchableOpacity 
              style={[styles.timeBox, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Inicio</Text>
              <Text style={[styles.timeText, { color: theme.colors.onSurface }]}>{formatTime(startTime)}</Text>
            </TouchableOpacity>
            
            <Ionicons name="arrow-forward" size={20} color={theme.colors.onSurfaceVariant} />

            <TouchableOpacity 
              style={[styles.timeBox, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Fin</Text>
              <Text style={[styles.timeText, { color: theme.colors.onSurface }]}>{formatTime(endTime)}</Text>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(Platform.OS === 'ios');
                if (selectedDate) setStartTime(selectedDate);
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(Platform.OS === 'ios');
                if (selectedDate) setEndTime(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Días Activos</Text>
          <View style={styles.daysGrid}>
            {DAY_LABELS.map((day, index) => {
              const isSelected = selectedDays.includes(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayOption,
                    { 
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
                    }
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={{ color: isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Icono</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  { 
                    backgroundColor: selectedIcon === icon ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                    borderColor: selectedIcon === icon ? theme.colors.primary : 'transparent',
                  }
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Ionicons 
                  name={icon as any} 
                  size={24} 
                  color={selectedIcon === icon ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  timeText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  iconScroll: {
    flexDirection: 'row',
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
});
