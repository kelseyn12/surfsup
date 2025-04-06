import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from './src/constants';
import webSocketService from './src/services/websocket';
import AppNavigator from './src/navigation';

export default function App() {
  // Initialize the WebSocket connection at app startup
  useEffect(() => {
    // Connect to the WebSocket server
    webSocketService.connect()
      .then(connected => {
        console.log(`WebSocket connection ${connected ? 'established' : 'failed'}`);
      })
      .catch(error => {
        console.error('Error connecting to WebSocket:', error);
      });
    
    // Clean up on app exit
    return () => {
      webSocketService.disconnect();
    };
  }, []);
  
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" backgroundColor={COLORS.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
