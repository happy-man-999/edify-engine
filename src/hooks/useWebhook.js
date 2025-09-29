import { useEffect, useRef, useState } from 'react';

export const useWebhook = (userId, enabled = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !userId) return;

    const connectWebhook = () => {
      try {
        // Close existing connection if any
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // Create new EventSource connection
        // Note: EventSource doesn't support custom headers, so we'll use a different approach
        // For now, we'll use the URL to pass the token as a query parameter
        const token = localStorage.getItem('token') || 'development-token';
        const eventSource = new EventSource(`/api/webhooks/webhook-stream/${userId}?token=${token}`);

        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('Webhook connection opened');
          setIsConnected(true);
          setError(null);
          setConnectionAttempts(0);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Webhook event received:', data);
            setLastEvent(data);
            
            // Handle different event types
            if (data.type === 'connected') {
              console.log('Webhook stream connected successfully');
            } else if (data.type === 'ping') {
              // Keep alive ping, no action needed
            } else if (data.type === 'new-world-created') {
              console.log('New world created successfully:', data.data);
            } else if (data.type === 'new-world-creation-failed') {
              console.error('New world creation failed:', data.data);
            } else if (data.type === 'custom-domain-setup-completed') {
              console.log('Custom domain setup completed successfully:', data.data);
            } else if (data.type === 'custom-domain-setup-failed') {
              console.error('Custom domain setup failed:', data.data);
            }
          } catch (parseError) {
            console.error('Error parsing webhook event:', parseError);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Webhook connection error:', error);
          setIsConnected(false);
          setError('Webhook connection failed');
          
          // Increment connection attempts
          setConnectionAttempts(prev => prev + 1);
          
          // Attempt to reconnect after 5 seconds, but limit attempts
          if (connectionAttempts < 5) {
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(`Attempting to reconnect webhook (attempt ${connectionAttempts + 1})...`);
              connectWebhook();
            }, 5000);
          } else {
            console.error('Max webhook reconnection attempts reached');
            setError('Webhook connection failed after multiple attempts');
          }
        };

        eventSource.addEventListener('error', (event) => {
          console.error('Webhook event error:', event);
        });

      } catch (error) {
        console.error('Error setting up webhook connection:', error);
        setError(error.message);
        
        // Attempt to reconnect after 10 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect webhook after error...');
          connectWebhook();
        }, 10000);
      }
    };

    connectWebhook();

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [userId, enabled, connectionAttempts]);

  // Function to manually reconnect
  const reconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setConnectionAttempts(0);
    connectWebhook();
  };

  // Function to close connection
  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
    setConnectionAttempts(0);
  };

  return {
    isConnected,
    lastEvent,
    error,
    connectionAttempts,
    reconnect,
    disconnect
  };
};
