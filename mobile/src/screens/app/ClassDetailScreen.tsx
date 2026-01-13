import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ClassChatView from './ClassChatView';
import ClassResourcesScreen from './ClassResourcesScreen';

type Props = {
  route: {
    params: {
      classId: string;
      className: string;
    };
  };
};

type Tab = 'chat' | 'resources';

export default function ClassDetailScreen({ route }: Props) {
  const { classId, className } = route.params;
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.className}>{className}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'chat' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'chat' && styles.activeTabText,
            ]}
          >
            Chat
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            activeTab === 'resources' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('resources')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'resources' && styles.activeTabText,
            ]}
          >
            Resources
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'chat' ? (
          <ClassChatView classId={classId} />
        ) : (
          <ClassResourcesScreen classId={classId} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
