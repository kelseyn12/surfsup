import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import { COLORS } from './src/constants';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" backgroundColor={COLORS.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
