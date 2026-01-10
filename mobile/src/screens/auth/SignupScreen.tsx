import { useState } from 'react';
import { View, Text, TextInput, Button, Pressable } from 'react-native';
import { supabase } from '../../lib/supabaseClient';
import { useNavigation } from '@react-navigation/native';

export function SignupScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError(null);
    setMessage(null);

    if (!email.endsWith('@csustan.edu')) {
      setError('Only @csustan.edu emails are allowed.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'stanconnect://auth/callback',
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email to verify your account.');
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign Up</Text>

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
      {message && <Text>{message}</Text>}

      <Button
        title={loading ? 'Signing up…' : 'Sign Up'}
        onPress={handleSignup}
        disabled={loading}
      />

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 16 }}>
          Already have an account? Log in
        </Text>
      </Pressable>
    </View>
  );
}
