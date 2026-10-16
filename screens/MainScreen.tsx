// screens/MainScreen.tsx
import { View, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useState } from 'react'; // lisatud
import { useTheme } from '../context/ThemeContext'; // lisatud

const salvestaAndmed = () => new Promise((resolve) => setTimeout(resolve, 2000));

export default function MainScreen() {
const [loading, setLoading] = useState(false); // lisatud
 const { theme } = useTheme(); // lisatud


  const handleSave = async () => {
    setLoading(true); // nupp näitab spinnerit ja on vajutamatu
    try {
      await salvestaAndmed();
    } finally {
      setLoading(false); // spinner kaob nii õnnestumise kui vea korral
    }
  };



  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomButton title="Salvesta" onPress={handleSave} loading={loading} />
      <CustomButton variant="secondary" title="Salvesta" onPress={handleSave} loading={loading} />
      <CustomButton variant="danger" title="Kustuta" onPress={() => console.log('Kustutan...')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
});
