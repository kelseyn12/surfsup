import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from './src/constants';
import webSocketService, { WebSocketMessageType, ConnectionStatusMessage } from './src/services/websocket';
import AppNavigator from './src/navigation';
import { View, Text, StyleSheet } from 'react-native';

// Error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [webSocketError, setWebSocketError] = useState<string | null>(null);

  // Initialize the WebSocket connection at app startup
  useEffect(() => {
    // Subscribe to connection status changes
    const unsubscribe = webSocketService.subscribe<ConnectionStatusMessage>(
      WebSocketMessageType.CONNECTION_STATUS,
      (message) => {
        setIsWebSocketConnected(message.payload.connected);
        setWebSocketError(message.payload.error || null);
      }
    );

    // Connect to the WebSocket server
    webSocketService.connect()
      .then(connected => {
        console.log(`WebSocket connection ${connected ? 'established' : 'failed'}`);
      })
      .catch(error => {
        console.error('Error connecting to WebSocket:', error);
        setWebSocketError(error.message);
      });
    
    // Clean up on app exit
    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" backgroundColor={COLORS.background} />
        {!isWebSocketConnected && webSocketError && (
          <View style={styles.connectionError}>
            <Text style={styles.connectionErrorText}>
              Connection error: {webSocketError}
            </Text>
          </View>
        )}
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
  },
  connectionError: {
    backgroundColor: COLORS.error,
    padding: 10,
  },
  connectionErrorText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 14,
  },
});
