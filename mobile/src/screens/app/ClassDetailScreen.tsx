import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type ClassDetailParams = {
  ClassDetail: {
    classId: string;
    className: string;
    classCode: string;
  };
};

export function ClassDetailScreen() {
  const route = useRoute<RouteProp<ClassDetailParams, 'ClassDetail'>>();
  const { className, classCode } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 8 }}>
        {className}
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Class Code: {classCode}
      </Text>

      <Text style={{ marginBottom: 8 }}>Chat (coming soon)</Text>
      <Text style={{ marginBottom: 8 }}>Resources (coming soon)</Text>
      <Text>Reminders (coming soon)</Text>
    </View>
  );
}

