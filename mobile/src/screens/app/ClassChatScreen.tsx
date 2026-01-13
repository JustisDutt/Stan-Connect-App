import { RouteProp, useRoute } from '@react-navigation/native';
import ClassChatView from './ClassChatView';

type ChatParams = {
  ClassChat: {
    classId: string;
  };
};

export default function ClassChatScreen() {
  const route = useRoute<RouteProp<ChatParams, 'ClassChat'>>();
  const { classId } = route.params;

  return <ClassChatView classId={classId} />;
}
