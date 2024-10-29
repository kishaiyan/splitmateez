// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageHandlerRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (socket) {
      socket.close();
    }

    const ws = new WebSocket('wss://x93f2f8a41.execute-api.ap-southeast-2.amazonaws.com/production/');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current(event.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);

    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };

    setSocket(ws);
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      socket.close();
    }

    setSocket(null);
    setIsConnected(false);
  }, [socket]);

  const setOnMessageHandler = useCallback((handler) => {
    messageHandlerRef.current = handler;
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
