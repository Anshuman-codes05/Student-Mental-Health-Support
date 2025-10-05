// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import fetch from "node-fetch";
import { Server } from "socket.io";
import { createServer } from "http";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 5000; // Changed from 5001 to 5000

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Updated to match Vite frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Hugging Face API endpoint & token
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const openai = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: HUGGINGFACE_API_KEY,
});

// Mock responses as a fallback
const mockResponses = [
  "Hello! How can I help you today?",
  "Sorry, I didn't understand that.",
  "That's interesting!",
  "Can you tell me more?",
  "I'm just a test bot, but I try my best!",
];

// app.post("/chat", async (req, res) => {
//   const { message } = req.body;
//   if (!message) return res.status(400).json({ reply: "No message provided." });

//   try {
//     // Call Hugging Face Inference API
//     const response = await fetch(HUGGINGFACE_API_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ inputs: message }),
//     });

//     const data = await response.json();

//     // Hugging Face sometimes returns an error object instead of array
//     if (data.error) {
//       console.warn("HF API error:", data.error);
//       throw new Error(data.error);
//     }

//     const reply = data?.[0]?.generated_text || "Sorry, I couldn't generate a reply.";
//     console.log("Emitting chat message (success):", reply); // Add this line
//     io.emit("chat message", reply); // Emit the reply via WebSocket
//   } catch (error) {
//     console.error("Error calling Hugging Face API:", error);

//     // Fallback to mock response if HF fails
//     const randomIndex = Math.floor(Math.random() * mockResponses.length);
//     const fallbackReply = mockResponses[randomIndex];
//     console.log("Emitting chat message (fallback):", fallbackReply); // Add this line
//     io.emit("chat message", fallbackReply); // Emit fallback reply via WebSocket
//   }
// });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", async (message) => {
    try {
      // Call Hugging Face Inference API with OpenAI client
      const completion = await openai.chat.completions.create({
        model: "deepseek-ai/DeepSeek-R1:together",
        messages: [{
          role: "user",
          content: message,
        }],
      });

      const reply = completion.choices[0].message.content;
      console.log("Emitting chat message (success):", reply);
      io.emit("chat message", reply); // Emit the reply via WebSocket
    } catch (error) {
      console.error("Error calling DeepSeek-R1 API:", error);

      const randomIndex = Math.floor(Math.random() * mockResponses.length);
      const fallbackReply = mockResponses[randomIndex];
      console.log("Emitting chat message (fallback):", fallbackReply);
      io.emit("chat message", fallbackReply); // Emit fallback reply via WebSocket
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Hugging Face backend server running on port ${PORT}`);
});
