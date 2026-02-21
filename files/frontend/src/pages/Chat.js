import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FaArrowLeft, FaPaperPlane, FaLock } from 'react-icons/fa';
import { encryptMessage, decryptMessage } from '../utils/encryption';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [roomId] = useState('general');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('join-room', roomId);

    socketRef.current.on('receive-message', async (data) => {
      try {
        const decrypted = await decryptMessage(data.encryptedContent, data.nonce);
        setMessages(prev => [...prev, { ...data, content: decrypted }]);
      } catch (error) {
        console.error('Failed to decrypt message');
      }
    });

    return () => socketRef.current.disconnect();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      const { encrypted, nonce } = await encryptMessage(inputValue);
      const message = {
        roomId,
        content: inputValue,
        encryptedContent: encrypted,
        nonce,
        timestamp: new Date()
      };

      socketRef.current.emit('send-message', message);
      setMessages(prev => [...prev, { ...message, sender: 'You' }]);
      setInputValue('');
    } catch (error) {
      console.error('Failed to encrypt message');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-white">General Chat</h1>
        <FaLock className="text-green-400 ml-auto" title="End-to-End Encrypted" />
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl mb-4 p-4 overflow-y-auto border border-white border-opacity-10">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <span className="font-bold text-white">{msg.sender || 'User'}</span>
                  </p>
                  <p className="text-white bg-white bg-opacity-10 rounded-lg p-2 mt-1">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white bg-opacity-10 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-white border-opacity-20 focus:outline-none focus:border-white"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}