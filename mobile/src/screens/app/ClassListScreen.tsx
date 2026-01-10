import { useState, useCallback } from 'react';
import { View, Text, Button, TextInput, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchMyClasses, joinClassByCode } from '../../lib/classes';

type ClassRow = {
  id: string;
  name: string;
  code: string;
};

export function ClassListScreen() {
  const navigation = useNavigation<any>();

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setError(null);
    try {
      const data = await fetchMyClasses();
      setClasses(data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load classes');
    }
  }

  async function join() {
    if (!code.trim()) return;

    setError(null);
    setLoading(true);

    try {
      await joinClassByCode(code.trim());
      setCode('');
      await load();
    } catch (e: any) {
      setError(e.message ?? 'Failed to join class');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Your Classes</Text>

      {classes.length === 0 && (
        <Text style={{ marginBottom: 12 }}>
          You have not joined any classes.
        </Text>
      )}

      {classes.map((c) => (
        <Pressable
          key={c.id}
          onPress={() =>
            navigation.navigate('ClassDetail', {
              classId: c.id,
              className: c.name,
              classCode: c.code,
            })
          }
        >
          <Text style={{ marginBottom: 6, color: 'blue' }}>
            {c.name}
          </Text>
        </Pressable>
      ))}

      {error && (
        <Text style={{ color: 'red', marginTop: 8 }}>
          {error}
        </Text>
      )}

      <TextInput
        placeholder="Class code (e.g. CS101)"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginTop: 16,
          marginBottom: 8,
        }}
      />

      <Button
        title={loading ? 'Joining…' : 'Join Class'}
        onPress={join}
        disabled={loading}
      />
    </View>
  );
}
