import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const role = sessionStorage.getItem('role'); // 'doctor' or 'nurse'
  const sender = role;
  const receiver = role === 'doctor' ? 'nurse' : 'doctor';

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chat/messages?user1=${receiver}&user2=${sender}`);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [sender, receiver]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await axios.post('http://localhost:5000/chat/send', {
          sender,
          receiver,
          message: newMessage,
        });

        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender,
            receiver,
            message: newMessage,
            timestamp: new Date().toISOString(),
            id: Date.now(),
          },
        ]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-white border rounded-lg shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white rounded-t-lg shadow-md bg-gradient-to-r from-teal-600 to-cyan-800">
        <h3 className="text-xl font-bold tracking-wide">
          Chat with {receiver.charAt(0).toUpperCase() + receiver.slice(1)}
        </h3>
      </div>

      {/* Chat body */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-cyan-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === sender ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm 
              ${msg.sender === sender 
                ? 'bg-cyan-600 text-white rounded-br-none' 
                : 'bg-teal-600 text-white rounded-bl-none'}`}>
              <p className="whitespace-pre-line">{msg.message}</p>
              <div className="mt-1 text-xs text-right text-gray-300">
                {new Date(msg.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex items-center p-4 bg-gray-100 border-t rounded-b-lg">
        <textarea
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 bg-white border border-gray-300 shadow-sm resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Type your message here... (Press Enter to send)"
        />
        <button
          onClick={handleSendMessage}
          className="px-5 py-2 ml-4 font-medium text-white transition-all duration-200 shadow-md bg-cyan-600 rounded-xl hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
