import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DrawerStack from './navigation/DrawerStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
// VIGA OLI (väike): siin olid kasutamata importid createNativeStackNavigator ja
// HomeScreen — vanast Stack-navigaatori versioonist järele jäänud. Eemaldatud.

function RootNavigation() {
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Laadin...</Text>
      </View>
    );
  }
  if (!user) {
    // VIGA OLI: SignUpScreen.tsx oli LoginScreen'i koopia — tema prop'ide tüüp oli
    // LoginScreenProps ({ onNavigateToSignUp }), aga siin antakse talle onNavigateToLogin.
    // TypeScript andis vea: "Property 'onNavigateToLogin' does not exist on type
    // 'LoginScreenProps'". Parandus tehti SignUpScreen.tsx-is, mitte siin — siinne
    // väljakutse oli õige, vale oli komponent ise.
    return showSignUp ? (
      <SignUpScreen onNavigateToLogin={() => setShowSignUp(false)} />
    ) : (
      <LoginScreen onNavigateToSignUp={() => setShowSignUp(true)} />
    );
  }

  return (
    <NavigationContainer>
      <DrawerStack />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    // SafeAreaProvider hoiab sisu eemal seadme "sälkudest" (notch, home-indicator)
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* VIGA OLI: AuthProvider oli küll imporditud, aga seda ei kasutatud — puudus siit.
          RootNavigation kutsub useAuth()-i, mis ilma AuthProvider'ita viskab vea
          "useAuth tuleb kasutada AuthProvider seest" ja äpp jookseb kokku.
          Provider peab olema puus KÕRGEMAL kui iga komponent, mis tema hook'i kasutab. */}
      <AuthProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <StatusBar style="dark" />
            <RootNavigation />
          </SafeAreaProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
});
