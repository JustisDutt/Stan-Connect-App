import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchMessages, sendMessage } from '../../lib/messages';
import { supabase } from '../../lib/supabaseClient';

type ChatParams = {
  ClassChat: {
    classId: string;
  };
};

type MessageRow = {
  id: string;
  content: string;
  created_at: string;
};

export function ClassChatScreen() {
  const route = useRoute<RouteProp<ChatParams, 'ClassChat'>>();
  const { classId } = route.params;

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await fetchMessages(classId);
      setMessages(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function send() {
    if (!text.trim()) return;

    const optimisticMessage: MessageRow = {
      id: `temp-${Date.now()}`,
      content: text.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setText('');

    try {
      await sendMessage(classId, optimisticMessage.content);
    } catch (e: any) {
      setError(e.message);
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticMessage.id)
      );
    }
  }

  useEffect(() => {
    load();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `class_id=eq.${classId}`,
        },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classId]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={120}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={{ marginBottom: 8 }}>
              {item.content}
            </Text>
          )}
        />

        {error && (
          <Text style={{ color: 'red', paddingHorizontal: 16 }}>
            {error}
          </Text>
        )}

        <View
          style={{
            padding: 12,
            borderTopWidth: 1,
            borderColor: '#eee',
            backgroundColor: 'white',
          }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              placeholder="Type a message"
              value={text}
              onChangeText={setText}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 6,
              }}
            />
            <Button title="Send" onPress={send} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
