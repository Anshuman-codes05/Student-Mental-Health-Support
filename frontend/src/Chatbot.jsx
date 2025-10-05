import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const socket = io("http://localhost:5000"); // Replace with your backend URL

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Indicates bot is typing/processing
  const messagesEndRef = useRef(null);
  const [feedback, setFeedback] = useState(null); // New state for user feedback
  const [isSending, setIsSending] = useState(false); // New state for message submission

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, from: "bot" }]);
      setLoading(false);
      setInput("");
      setIsSending(false); // Message received, so no longer sending
      setFeedback({ type: "success", message: "Reply received!" });
      setTimeout(() => setFeedback(null), 3000); // Clear feedback after 3 seconds
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setFeedback({ type: "error", message: "Could not connect to chatbot server." });
      setLoading(false);
      setIsSending(false);
    });

    return () => {
      socket.off("chat message");
      socket.off("connect_error");
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) {
      setFeedback({ type: "error", message: "Message cannot be empty." });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const userMsg = { text: input, from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true); // Indicate bot is thinking
    setIsSending(true); // Indicate message is being sent
    setFeedback(null); // Clear previous feedback

    try {
      socket.emit("chat message", input);
    } catch (error) {
      console.error("Error emitting message:", error);
      setFeedback({ type: "error", message: "Failed to send message. Please try again." });
      setLoading(false);
      setIsSending(false);
      setTimeout(() => setFeedback(null), 3000);
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !isSending) handleSend(); // Prevent sending while bot is loading or message is sending
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-large border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-8 text-primary tracking-tight">Chatbot 🤖</h2>

      {feedback && (
        <motion.div
          className={`mb-6 px-6 py-4 rounded-xl text-white font-medium shadow-soft ${feedback.type === 'success' ? 'bg-success-500' : 'bg-error-500'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
            <span>{feedback.message}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        className="border border-gray-200 rounded-xl p-4 h-96 overflow-y-auto mb-8 bg-background shadow-inner custom-scrollbar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {messages.length === 0 && !loading && !isSending && (
          <p className="text-gray-500 italic text-center p-4">Start a conversation with the bot!</p>
        )}
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`mb-4 p-4 rounded-xl shadow-soft max-w-[85%] ${msg.from === "user" ? "text-right bg-primary/10 ml-auto mr-0" : "text-left bg-accent/20 mr-auto ml-0"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <b className="font-semibold text-text text-base block mb-1">{msg.from === "user" ? "You" : "Bot"}:</b> <span className="text-gray-700 text-base leading-relaxed">{msg.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && <motion.div
                      className="text-primary font-medium text-left p-4 italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                    >Bot is typing...</motion.div>}
        <div ref={messagesEndRef} />
      </motion.div>
      <motion.div
        className="flex space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="input-field flex-1"
          disabled={loading || isSending}
        />
        <motion.button
          onClick={handleSend}
          className="btn-primary"
          disabled={loading || isSending}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSending ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            "Send"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
