import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import './ChatStyle.css'; 
import { motion } from 'framer-motion';

const WebSocketComponent: React.FC = () => {
    const user = useSelector((state: any) => state?.user?.user);
    const [messages, setMessages] = useState<{ user: string, message: string, time: string }[]>([]);
    const [input, setInput] = useState<string>('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000'); 
        setWs(socket);
    
        socket.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    const message = reader.result as string;
                    try {
                        const parsedMessage = JSON.parse(message);
                        if (parsedMessage.userId !== user?.username) {
                            const timestamp = new Date().toLocaleTimeString();
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                { user: parsedMessage.userId, message: parsedMessage.message, time: timestamp },
                            ]);
                        }
                    } catch (error) {
                        console.error('Failed to parse Blob as JSON', error);
                    }
                };
                reader.readAsText(event.data);
            } else {
                try {
                    const receivedMessage = JSON.parse(event.data);
                    if (receivedMessage.userId !== user?.username) {
                        const timestamp = new Date().toLocaleTimeString();
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { user: receivedMessage.userId, message: receivedMessage.message, time: timestamp },
                        ]);
                    }
                } catch (error) {
                    console.error('Failed to parse message as JSON', error);
                }
            }
        };
    
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    
        return () => {
            socket.close();
        };
    }, [user?.username]);
    
    const sendMessage = () => {
        if (ws && input) {
            const timestamp = new Date().toLocaleTimeString();
            ws.send(JSON.stringify({ userId: user?.username, message: input }));
            setMessages((prevMessages) => [
                ...prevMessages,
                { user: 'You', message: input, time: timestamp },
            ]);
            setInput('');
        }
    };
    
    return (

        <motion.div
        initial={{ opacity: 0, y: -300, scale: 0.4 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, x: -300 }} 
        transition={{ duration: 1.5, type: 'spring' }} 
        className="max-h-screen bg-gray-900 text-white p-8 w-full"
      >
        <div className="chat-container w-full">
            <h1 className="text-3xl font-bold mb-6 w-full">Chat</h1>
            <div className="chat-window bg-gray-800 p-6 rounded-lg shadow-lg h-96 overflow-y-auto mb-4 w-full" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.user === 'You' ? 'sent' : 'received'}`}>
                        <div className="message-user">
                            {msg.user === 'You' ? 'You' : `User ${msg.user}`}
                        </div>
                        <div className="message-text">{msg.message}</div>
                        <div className="message-time">{msg.time}</div>
                    </div>
                ))}
            </div>
            <div className="chat-input flex">
                <input
                    type="text"
                    value={input}
                    className='text-black'
                    placeholder="Type a message..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
        </motion.div>
    );
    
};

export default WebSocketComponent;
