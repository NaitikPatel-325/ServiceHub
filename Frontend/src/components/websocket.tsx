import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const WebSocketComponent: React.FC = () => {
    const user = useSelector((state: any) => state?.user?.user);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000'); 
        setWs(socket);

        socket.onmessage = (event) => {
            if (event.data instanceof Blob) {
                console.log('Received Blob:', event.data);
                const reader = new FileReader();
                reader.onload = () => {
                    setMessages((prevMessages) => [...prevMessages, reader.result as string]);
                };
                reader.readAsText(event.data);
            } else {
                setMessages((prevMessages) => [...prevMessages, event.data]);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws && input) {
            ws.send(JSON.stringify({ userId: user?._id, message: input }));
            setInput('');
        }
    };

    return (
        <div>
            <h1>WebSocket Chat</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                className='text-black'
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default WebSocketComponent;
