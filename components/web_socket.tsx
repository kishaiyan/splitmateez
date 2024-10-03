import { useEffect, useRef, useState } from 'react';

const useWebSocket = (
  onMessage = (data: any) => {},
  onError = (error: any) => {},
  onClose = (event: any) => {}
) => {
  const [isWebSocketConnected, setWebSocketConnected] = useState(false);

  const ws = useRef(null);
  const reconnectIntervalRef = useRef(1000);

  const url = 'wss://x93f2f8a41.execute-api.ap-southeast-2.amazonaws.com'; // replace it with your URL

  const connectWebSocket = () => {
    try {
      // Create a WebSocket connection
      ws.current = new WebSocket(url);

      // WebSocket event listeners
      ws.current.onopen = () => {
        setWebSocketConnected(true);
        reconnectIntervalRef.current = 1000; // Reset reconnection interval on successful connection
      };

      ws.current.onmessage = (event) => {
        onMessage(event.data);
      };

      ws.current.onerror = (error) => {
        onError(error);
      };

      ws.current.onclose = (event) => {
        setWebSocketConnected(false);
        onClose(event);
        // Attempt to reconnect
        setTimeout(() => {
          reconnectIntervalRef.current = Math.min(
            reconnectIntervalRef.current * 2,
            30000
          ); // Exponential backoff, max 30 seconds
          connectWebSocket();
        }, reconnectIntervalRef.current);
      };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectWebSocket();
    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return isWebSocketConnected;
};

export default useWebSocket;
