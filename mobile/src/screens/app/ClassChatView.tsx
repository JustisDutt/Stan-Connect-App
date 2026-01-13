import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { fetchMessages, sendMessage, MessageRow } from '../../lib/messages';
import { supabase } from '../../lib/supabaseClient';

type Props = {
  classId: string;
};

export default function ClassChatView({ classId }: Props) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const keyboardOffset = useState(new Animated.Value(0))[0];

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
      .channel(`messages-${classId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `class_id=eq.${classId}`,
        },
        () => load()
      )
      .subscribe();

    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardOffset, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === 'ios' ? e.duration : 0,
          useNativeDriver: false,
        }).start();
      }
    );

    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      supabase.removeChannel(channel);
      show.remove();
      hide.remove();
    };
  }, [classId]);

  return (
    <View style={styles.container}>
      {/* Messages */}
      <FlatList
        style={styles.list}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMe = item.user_id === currentUserId;
          const email = item.profiles[0]?.email ?? 'Unknown';

          return (
            <View
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleOther,
              ]}
            >
              <Text style={[styles.sender, isMe && styles.senderMe]}>
                {isMe ? 'You' : email}
              </Text>
              <Text style={[styles.message, isMe && styles.messageMe]}>
                {item.content}
              </Text>
            </View>
          );
        }}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Input bar */}
      <Animated.View
        style={[
          styles.inputBar,
          { transform: [{ translateY: Animated.multiply(keyboardOffset, -1) }] },
        ]}
      >
        <TextInput
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Button title="Send" onPress={send} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  bubble: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    maxWidth: '75%',
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  sender: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  senderMe: {
    color: 'white',
  },
  message: {
    color: 'black',
  },
  messageMe: {
    color: 'white',
  },
  error: {
    color: 'red',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginRight: 8,
  },
});
