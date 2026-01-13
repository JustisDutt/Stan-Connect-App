import { View, Text, StyleSheet } from 'react-native';

type Props = {
  classId: string;
};

export default function ClassResourcesScreen({ classId }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Resources</Text>
      <Text style={styles.subtitle}>
        Files shared in this class will appear here.
      </Text>

      {/* Step 4B will replace this with a real list */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
