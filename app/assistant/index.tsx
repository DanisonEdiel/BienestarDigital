import { spacing } from '@/constants/theme/spacing';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const STORAGE_KEY = 'chat_history';

export default function AssistantScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
      // Scroll to bottom when messages change
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  const loadMessages = async () => {
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content:
              'Hola, soy tu asistente de bienestar. ¿Cómo te sientes hoy? Cuéntame con tus propias palabras.',
          },
        ]);
      }
    } catch (e) {
      console.error('Error loading chat history', e);
    }
  };

  const saveMessages = async (msgs: ChatMessage[]) => {
    try {
      // Limit history to avoid SecureStore size limits (approx 20 last messages)
      const recentMsgs = msgs.slice(-20);
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(recentMsgs));
    } catch (e) {
      console.error('Error saving chat history', e);
    }
  };

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
      // Use real OpenAI API
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API Key not found');
      }

      const apiMessages = nextMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      // Add system prompt for context
      const systemPrompt = {
        role: 'system',
        content: `Eres un asistente de bienestar digital empático y profesional. 
        Tu objetivo es ayudar al usuario a reflexionar sobre su bienestar emocional y digital.
        El usuario se llama ${user.firstName || 'Usuario'}.
        Responde de manera concisa, amable y en español.
        Si detectas estrés o ansiedad, ofrece consejos breves de respiración o desconexión.`
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [systemPrompt, ...apiMessages],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI Error:', errorData);
        throw new Error('Error en la respuesta de IA');
      }

      const data = await response.json();
      const aiContent = data.choices[0]?.message?.content || 'No pude generar una respuesta.';

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const fallback: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content:
          'Lo siento, tuve un problema para conectar con mi cerebro digital. Por favor, intenta de nuevo.',
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
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
          ref={flatListRef}
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

