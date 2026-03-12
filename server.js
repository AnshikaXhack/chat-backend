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
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

// handle preflight requests
app.options("*", cors());


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
app.get("/", (req, res) => res.send("🚀 Backend is running!"));
app.get("/", (req, res) => {
  res.send("🚀 Backend v2 running!");
});
app.get("/", (req, res) => {
  res.json({
    status: "API Running",
    project: "Location Based Group Chat",
    github: "https://github.com/AnshikaXhack/GroupRoom-chat"
  });
});
app.use("/room", roomRoute);

// ===========================
// Root route for testing
// ===========================

// ===========================
// Socket.IO server
// ===========================
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

chatSocket(io); // register all socket events

// ===========================
// Start server
// ===========================
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});