import React, { createContext, useContext, useEffect, useState } from 'react';
import webSocketService, { WebSocketMessageType, ConnectionStatusMessage, WebSocketStatus } from './websocket';

const WebSocketStatusContext = createContext<WebSocketStatus>({ connected: false, error: null });

export const WebSocketStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<WebSocketStatus>({ connected: false, error: null });

  useEffect(() => {
    const unsubscribe = webSocketService.subscribe<ConnectionStatusMessage>(
      WebSocketMessageType.CONNECTION_STATUS,
      (message) => {
        setStatus({ connected: message.payload.connected, error: message.payload.error || null });
      }
    );
    // Connect on mount
    webSocketService.connect().catch((error) => {
      setStatus({ connected: false, error: error.message });
    });
    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, []);

  return (
    <WebSocketStatusContext.Provider value={status}>
      {children}
    </WebSocketStatusContext.Provider>
  );
};

export const useWebSocketStatus = () => useContext(WebSocketStatusContext); 