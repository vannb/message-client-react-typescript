import React, { useState, useCallback } from 'react';
import useWebSocket from '../hooks/useWebSocket';
const WS_URL = 'ws://localhost:3000'
const App: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    const handleMessage = useCallback((message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    }, []);

    const { sendMessage, isConnected } = useWebSocket(WS_URL, { onMessage: handleMessage });

    const handleSendMessage = useCallback(() => {
        if (message !== '') {
            sendMessage(message);
            setMessage('');
        }
    }, [message, sendMessage]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage} disabled={!isConnected}>Send</button>
                {isConnected || <div style={{ color: "red" }}>
                    Cannot connect to server at <strong>{WS_URL}</strong>. Please start server and refresh the page
                </div>}
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div >
    );
};

export default App;
