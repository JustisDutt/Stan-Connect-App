import { AuthProvider } from './src/auth/AuthContext';
import { NavigationRoot } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationRoot />
    </AuthProvider>
  );
}
