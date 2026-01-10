import { View, Text, Pressable } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

type ClassDetailParams = {
  ClassDetail: {
    classId: string;
    className: string;
    classCode: string;
  };
};

export function ClassDetailScreen() {
  const route = useRoute<RouteProp<ClassDetailParams, 'ClassDetail'>>();
  const navigation = useNavigation<any>();

  const { classId, className, classCode } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 8 }}>
        {className}
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Class Code: {classCode}
      </Text>

      <Pressable
        onPress={() =>
          navigation.navigate('ClassChat', {
            classId,
          })
        }
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: '#007AFF',
          borderRadius: 6,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          Open Chat
        </Text>
      </Pressable>

      <Text style={{ marginBottom: 8 }}>Resources (coming soon)</Text>
      <Text>Reminders (coming soon)</Text>
    </View>
  );
}
