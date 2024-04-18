import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketHandlers {
    onMessage: (message: string) => void;
}

const useWebSocket = (url: string, { onMessage }: WebSocketHandlers) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<WebSocket | null>(null);

    const connectWebSocket = useCallback(() => {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('Connected to server');
            setIsConnected(true);
        };

        socket.onmessage = async (event) => {
            try {
                const message = await event.data.text();
                console.log('Received message:', message);
                onMessage(message);
            } catch (error) {
                console.error('Error converting Blob to text:', error);
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [url, onMessage]);

    useEffect(() => {
        const cleanup = connectWebSocket();
        return cleanup;
    }, [connectWebSocket]);

    const sendMessage = useCallback((message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    }, []);

    return { sendMessage, isConnected };
};

export default useWebSocket;
