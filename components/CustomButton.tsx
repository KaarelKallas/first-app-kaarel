import { Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';


type ButtonVariant = 'primary' | 'secondary' | 'danger';


interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false, // lisatud
  disabled = false, // lisatud
}: CustomButtonProps) {
  const isDisabled = disabled || loading; // lisatud
  return (
     <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        isDisabled && styles.buttonDisabled, // lisatud
        pressed && !isDisabled && styles.buttonPressed, // muudetud — lisatud !isDisabled kontroll
      ]}
      onPress={onPress}
      disabled={isDisabled} // lisatud
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', // lisatud
    minHeight: 48, // lisatud — nupp ei muuda kõrgust, kui tekst asendub spinneriga
  },
  buttonPrimary: { backgroundColor: '#007AFF' },
  buttonSecondary: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#007AFF' },
  buttonDanger: { backgroundColor: '#FF3B30' },
  buttonDisabled: { backgroundColor: '#ccc', borderColor: '#ccc' }, // lisatud
  buttonPressed: { opacity: 0.7 },
  text: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  textSecondary: { color: '#007AFF' },
  });
