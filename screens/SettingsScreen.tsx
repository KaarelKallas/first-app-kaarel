import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.row}>
        <Text style={{ color: theme.colors.text, fontSize: 16 }}>Tume teema</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor={theme.colors.primary}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
});
