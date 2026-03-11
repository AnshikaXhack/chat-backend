// server.js
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectToDb from "./src/db/db.js";
import roomRoute from "./src/routes/room.route.js";
import chatSocket from "./src/socket/socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Allowed frontend URLs
// ===========================
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // dev
  "https://group-room-chat-ncjfvswfz-anshikaxhacks-projects.vercel.app" // live
];

// ===========================
// CORS middleware
// ===========================
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman or curl)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
      else callback(new Error("CORS blocked by Express"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ===========================
// Body parser
// ===========================
app.use(express.json());

// ===========================
// Database connection
// ===========================
connectToDb()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// ===========================
// Routes
// ===========================
app.use("/room", roomRoute);

// ===========================
// Root route for testing
// ===========================
app.get("/", (req, res) => res.send("🚀 Backend is running!"));

// ===========================
// Socket.IO server
// ===========================
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
      else callback(new Error("CORS blocked by Socket.IO"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

chatSocket(io); // register all socket events

// ===========================
// Start server
// ===========================
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});