import { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';

// VIGA OLI: see fail oli LoginScreen.tsx-i täpne koopia:
// - prop'ide tüüp oli LoginScreenProps ({ onNavigateToSignUp }), aga App.tsx annab
//   onNavigateToLogin'i → TypeScripti viga App.tsx-is
// - kutsuti signIn'i, mitte signUp'i → uut kontot polnud võimalik luua
// - pealkiri ja nupp olid "Logi sisse", link viis "Registreeru" peale ehk iseendale
// Allpool on kõik kolm parandatud.
interface SignUpScreenProps {
  // Peegelpilt LoginScreen'i onNavigateToSignUp'ist — vahetab App.tsx-i
  // RootNavigation'is ekraani SignUp pealt tagasi Login peale.
  onNavigateToLogin: () => void;
}

export default function SignUpScreen({ onNavigateToLogin }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Teine parooliväli — kaitseb kasutajat trükivea eest, sest peidetud
  // paroolis ei näe ta ise, mida sisestas.
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // VIGA OLI: siin oli `const { signIn } = useAuth()` — registreerimisekraan üritas
  // olemasolevat kasutajat sisse logida, selle asemel et uus konto luua.
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Viga', 'Palun täida kõik väljad');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Viga', 'Paroolid ei ühti');
      return;
    }
    // Firebase nõuab vaikimisi vähemalt 6-märgilist parooli — kontrollime
    // juba enne päringut, et kasutaja saaks kohe arusaadava teate.
    if (password.length < 6) {
      Alert.alert('Viga', 'Parool peab olema vähemalt 6 tähemärki');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      // Firebase logib uue kasutaja registreerimisel KOHE ka sisse —
      // AuthProvider'i onAuthStateChanged uuendab user oleku ja App.tsx
      // näitab automaatselt rakenduse sisu. Eraldi navigeerimist pole vaja.
    } catch (error: any) {
      const teated: Record<string, string> = {
        'auth/email-already-in-use': 'See e-mail on juba kasutusel',
        'auth/invalid-email': 'E-maili aadress on vigane',
        'auth/weak-password': 'Parool on liiga nõrk',
      };
      Alert.alert('Viga', teated[error.code] ?? 'Registreerimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Registreeru</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Parool"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Korda parooli"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <CustomButton title="Registreeru" onPress={handleSignUp} loading={loading} />

      <Text style={styles.link} onPress={onNavigateToLogin}>
        Konto juba olemas? Logi sisse
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, gap: 12 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  link: { textAlign: 'center', color: '#007AFF', marginTop: 16 },
});
