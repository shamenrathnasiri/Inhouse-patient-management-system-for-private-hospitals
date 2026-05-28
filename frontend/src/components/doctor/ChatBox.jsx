import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { FaComments, FaPaperPlane } from "react-icons/fa";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { markMessagesAsRead } = useAppContext();

  const role = sessionStorage.getItem("role"); // 'doctor' or 'nurse'
  const sender = role;
  const receiver = role === "doctor" ? "nurse" : "doctor";

  const messagesEndRef = useRef(null);

  // Mark messages as read when chat is opened
  useEffect(() => {
    markMessagesAsRead();
  }, [markMessagesAsRead]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/messages?user1=${receiver}&user2=${sender}`,
        );
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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await axios.post("http://localhost:5000/chat/send", {
          sender,
          receiver,
          message: newMessage,
        });

        // Format timestamp to match backend format: 'YYYY-MM-DD HH:MM:SS'
        const now = new Date();
        const formattedTimestamp =
          now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0") +
          " " +
          String(now.getHours()).padStart(2, "0") +
          ":" +
          String(now.getMinutes()).padStart(2, "0") +
          ":" +
          String(now.getSeconds()).padStart(2, "0");

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender,
            receiver,
            message: newMessage,
            timestamp: formattedTimestamp,
            id: Date.now(),
          },
        ]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 animate-fade-in">
        <svg
          className="w-8 h-8 text-primary-400 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span className="ml-3 text-dark-400">Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto glass-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 border-b border-dark-800/50"
        style={{
          background:
            "linear-gradient(135deg, rgba(20, 87, 225, 0.15), rgba(51, 140, 255, 0.08))",
        }}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <FaComments className="w-4 h-4 text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Chat with {receiver.charAt(0).toUpperCase() + receiver.slice(1)}
          </h3>
          <p className="text-xs text-dark-400">Real-time messaging</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse" />
          <span className="text-xs text-accent-400 font-medium">Online</span>
        </div>
      </div>

      {/* Chat body */}
      <div
        className="flex-1 p-4 space-y-3 overflow-y-auto"
        style={{ background: "rgba(19, 19, 31, 0.5)" }}
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FaComments className="w-12 h-12 mx-auto mb-3 text-dark-700" />
              <p className="text-dark-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === sender ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-xs px-4 py-2.5 rounded-2xl shadow-lg transition-all duration-200 
              ${
                msg.sender === sender
                  ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-md"
                  : "glass-card-light text-dark-100 rounded-bl-md border border-dark-700/30"
              }`}
            >
              <p className="whitespace-pre-line text-sm">{msg.message}</p>
              <div
                className={`mt-1 text-xs text-right ${msg.sender === sender ? "text-primary-200/60" : "text-dark-500"}`}
              >
                {(() => {
                  // Parse timestamp format 'YYYY-MM-DD HH:MM:SS' from backend
                  const timestamp = msg.timestamp.replace(" ", "T");
                  const date = new Date(timestamp);
                  return date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                })()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex items-center gap-3 p-4 border-t border-dark-800/50"
        style={{ background: "rgba(30, 30, 46, 0.8)" }}
      >
        <textarea
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field resize-none py-2.5 text-sm"
          placeholder="Type your message here... (Press Enter to send)"
        />
        <button
          onClick={handleSendMessage}
          className="btn-primary px-4 py-2.5 flex items-center gap-2"
          disabled={!newMessage.trim()}
        >
          <FaPaperPlane className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
