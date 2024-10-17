// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messageHandler, setMessageHandler] = useState(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (socket) {
      socket.close();
    }

    const ws = new WebSocket('wss://x93f2f8a41.execute-api.ap-southeast-2.amazonaws.com/production/');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
      if (messageHandler) {
        messageHandler(event.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };

    setSocket(ws);
  }, [messageHandler]);

  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      socket.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
  }, [socket]);

  const setOnMessageHandler = useCallback((handler) => {
    setMessageHandler(() => handler);
  }, []);

  return (
    <WebSocketContext.Provider value={{
      socket,
      isConnected,
      connectWebSocket,
      disconnectWebSocket,
      setOnMessageHandler
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
