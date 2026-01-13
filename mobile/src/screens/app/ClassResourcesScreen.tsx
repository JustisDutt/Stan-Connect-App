import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { fetchClassResources, ClassResourceRow } from '../../lib/resources';

type Props = {
  classId: string;
};

export default function ClassResourcesScreen({ classId }: Props) {
  const [resources, setResources] = useState<ClassResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadResources() {
      try {
        const data = await fetchClassResources(classId);
        if (mounted) {
          setResources(data);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load resources');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadResources();

    return () => {
      mounted = false;
    };
  }, [classId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (resources.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>
          No resources have been shared yet.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={resources}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.fileName}>
            {item.original_filename}
          </Text>

          <Text style={styles.meta}>
            {item.file_type.toUpperCase()} • Uploaded by{' '}
            {item.profiles?.[0]?.email ?? 'Unknown'}
          </Text>

          <Text style={styles.meta}>
            {(item.file_size / 1024).toFixed(1)} KB
          </Text>

          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  empty: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    fontSize: 14,
    color: 'red',
  },
});
