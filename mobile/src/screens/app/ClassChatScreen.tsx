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
import { fetchMessages, sendMessage, MessageRow } from '../../lib/messages';
import { supabase } from '../../lib/supabaseClient';

type ChatParams = {
  ClassChat: {
    classId: string;
  };
};

export function ClassChatScreen() {
  const route = useRoute<RouteProp<ChatParams, 'ClassChat'>>();
  const { classId } = route.params;

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await fetchMessages(classId);
      setMessages(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function send() {
    if (!text.trim() || !currentUserId) return;

    const optimistic: MessageRow = {
      id: `temp-${Date.now()}`,
      content: text.trim(),
      created_at: new Date().toISOString(),
      user_id: currentUserId,
      profiles: [{ email: 'You' }],
    };

    setMessages((prev) => [...prev, optimistic]);
    setText('');

    try {
      await sendMessage(classId, optimistic.content);
    } catch (e: any) {
      setError(e.message);
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimistic.id)
      );
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });

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
          renderItem={({ item }) => {
            const isMe = item.user_id === currentUserId;
            const email = item.profiles[0]?.email ?? 'Unknown';

            return (
              <View
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  backgroundColor: isMe ? '#007AFF' : '#E5E5EA',
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 8,
                  maxWidth: '75%',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: isMe ? 'white' : '#555',
                    marginBottom: 4,
                  }}
                >
                  {isMe ? 'You' : email}
                </Text>

                <Text
                  style={{
                    color: isMe ? 'white' : 'black',
                  }}
                >
                  {item.content}
                </Text>
              </View>
            );
          }}
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
