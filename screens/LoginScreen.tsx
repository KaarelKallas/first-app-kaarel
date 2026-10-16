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

interface LoginScreenProps {
  // Funktsioon, mis vahetab vanemas (App.tsx-i RootNavigation) ekraani
  // Login pealt SignUp peale — vt App.tsx kokkupanekut allpool. LoginScreen ise
  // ei tea ega otsusta, KUIDAS see vahetus juhtub, ta lihtsalt kutsub prop'i.
  onNavigateToSignUp: () => void;
}

export default function LoginScreen({ onNavigateToSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // See "loading" on LOKAALNE, ainult sellel ekraanil, ja tähendab "nupp on
  // hetkel vajutatud, päring käib" — teine asi kui AuthContext'i "loading",
  // mis tähendab "kontrollime, kas keegi on juba varem sisse logitud".
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth(); // ainult signIn on siin vaja, ülejäänud AuthContext'i väljad (user, signUp, logout) pole sellel ekraanil olulised

  const handleLogin = async () => {
    // Lihtne valideerimine enne päringu saatmist — säästab kasutajat
    // asjatust ootamisest ja Firebase'ile asjatust päringust.
    if (!email || !password) {
      Alert.alert('Viga', 'Palun täida kõik väljad');
      return; // katkestab funktsiooni siin — signIn'i kunagi ei kutsuta
    }

    setLoading(true); // näita CustomButton'il laadimisindikaatorit
    try {
      await signIn(email, password);
      // Kui õnnestub, vahetab AuthProvider automaatselt user oleku —
      // eraldi navigeerimiskäsku pole vaja (vt App.tsx kokkupanekut allpool)
    } catch (error: any) {
      // Firebase tagastab vea koodina (nt "auth/wrong-password"), mitte
      // valmis eestikeelse tekstina — "teated" tõlgib tuntud koodid
      // arusaadavaks. `error.code` on Firebase'i enda omadus.
      // NB! Uutes Firebase'i projektides on vaikimisi sees "Email enumeration protection" —
      // siis tuleb vale e-maili/parooli korral alati 'auth/invalid-credential',
      // mitte 'auth/user-not-found' või 'auth/wrong-password' (ründaja ei saa teada,
      // kas selline konto üldse olemas on).
      const teated: Record<string, string> = {
        'auth/invalid-email': 'E-maili aadress on vigane',
        'auth/user-not-found': 'Kasutajat ei leitud',
        'auth/wrong-password': 'Vale parool',
        'auth/invalid-credential': 'Valed sisselogimisandmed',
      };
      // ?? 'Sisselogimine ebaõnnestus' — varuteade juhuks, kui Firebase
      // tagastab veakoodi, mida "teated" objektis pole kirjeldatud.
      Alert.alert('Viga', teated[error.code] ?? 'Sisselogimine ebaõnnestus');
    } finally {
      // finally käivitub nii õnnestumise KUI ka vea korral —
      // laadimisindikaator peab kaduma mõlemal juhul, mitte ainult veal.
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      // iOS-is "padding" tõstab kogu vaate klaviatuuri kõrguse võrra üles;
      // Androidil käitub "height" paremini (Android liigutab akent juba
      // suuresti automaatselt) — seepärast platvormipõhine valik.
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Logi sisse</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // e-maili-sõbralik klaviatuur (@ ja . lihtsasti käes)
        autoCapitalize="none" // e-mail ei tohi iial suure algustähega olla
      />

      <TextInput
        style={styles.input}
        placeholder="Parool"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // peidab sisestatud märgid täppidena
        autoCapitalize="none"
      />

      {/* CustomButton kuvab ise ActivityIndicator'i, kui loading=true — vt taaskasutatava komponendi ehitust */}
      <CustomButton title="Logi sisse" onPress={handleLogin} loading={loading} />

      {/* Text oma onPress'iga toimib siin lihtsa lingina — see EI ole päris
          navigatsioon (pole navigation.navigate'i), vaid App.tsx-i lihtsa
          useState-lüliti käivitamine (vt App.tsx kokkupanekut allpool) */}
      <Text style={styles.link} onPress={onNavigateToSignUp}>
        Pole kontot? Registreeru
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
