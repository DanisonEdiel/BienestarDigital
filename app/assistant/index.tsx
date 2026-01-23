import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { spacing } from '@/constants/theme/spacing';
import { api } from '@/lib/api';
import { useTheme } from 'react-native-paper';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export default function AssistantScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Hola, soy tu asistente de bienestar. ¿Cómo te sientes hoy? Cuéntame con tus propias palabras.',
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !user || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payloadMessages = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await api.post(
        '/ai/mood-checkin',
        { messages: payloadMessages },
        {
          params: { clerkId: user.id },
          headers,
        },
      );

      const data = response.data as {
        assistantMessage: string;
        emotion: string;
        stressLevel: 'low' | 'medium' | 'high';
        confidence: number;
      };

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.assistantMessage,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallback: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content:
          'Hubo un problema al analizar tu mensaje. Aun así, gracias por compartir cómo te sientes. Puedes intentarlo de nuevo en un momento.',
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>Asistente de bienestar</Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Cuenta cómo te sientes hoy</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === 'user' 
                  ? [styles.messageUser, { backgroundColor: theme.colors.primary }] 
                  : [styles.messageAssistant, { backgroundColor: theme.colors.surfaceVariant }],
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.role === 'user' 
                    ? [styles.messageTextUser, { color: theme.colors.onPrimary }] 
                    : [styles.messageTextAssistant, { color: theme.colors.onSurfaceVariant }],
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
        />

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.onSurface }]}
            placeholder="Escribe cómo te sientes..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }, sending && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={sending}
          >
            <Ionicons name="send" size={18} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  iconBtn: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  messagesContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  messageUser: {
    alignSelf: 'flex-end',
  },
  messageAssistant: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
  },
  messageTextAssistant: {
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});

