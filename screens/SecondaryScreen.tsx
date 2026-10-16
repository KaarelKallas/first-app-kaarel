// screens/SecondaryScreen.tsx — sama struktuur, erinev tekst
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // lisatud


export default function SecondaryScreen() {
   const { theme } = useTheme(); // lisatud
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Teine vaade</Text>
      <Text style={{ color: theme.colors.text }}>Siin on teine vahekaart.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
});
