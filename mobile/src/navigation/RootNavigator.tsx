import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ClassListScreen } from '../screens/app/ClassListScreen';
import { ClassDetailScreen } from '../screens/app/ClassDetailScreen';
import { ClassChatScreen } from '../screens/app/ClassChatScreen';

const Stack = createNativeStackNavigator();

function UnverifiedScreen({ email }: { email: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Please verify your email to continue.</Text>
      <Text>{email}</Text>
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Classes" component={ClassListScreen} />
      <Stack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={{ title: 'Class' }}
      />
      <Stack.Screen
        name="ClassChat"
        component={ClassChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { state } = useAuth();

  if (state.status === 'loading') {
    return <Text>Loading…</Text>;
  }

  if (state.status === 'unauthenticated') {
    return <AuthStack />;
  }

  const user = state.session.user;

  if (!user.email_confirmed_at) {
    return <UnverifiedScreen email={user.email ?? ''} />;
  }

  return <AppStack />;
}

export function NavigationRoot() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
