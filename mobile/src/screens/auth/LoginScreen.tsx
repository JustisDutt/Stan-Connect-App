import { useState } from 'react';
import { View, Text, TextInput, Button, Pressable } from 'react-native';
import { supabase } from '../../lib/supabaseClient';
import { useNavigation } from '@react-navigation/native';

export function LoginScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);

    if (!email.endsWith('@csustan.edu')) {
      setError('Only @csustan.edu emails are allowed.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        title={loading ? 'Logging in…' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />

      <Pressable onPress={() => navigation.navigate('Signup')}>
        <Text style={{ marginTop: 16 }}>
          Don’t have an account? Sign up
        </Text>
      </Pressable>
    </View>
  );
}
