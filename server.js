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

// // ===========================
// // Allowed frontend URLs
// // ===========================
// const ALLOWED_ORIGINS = [
//   "http://localhost:5173", // local dev
//   process.env.FRONTEND_URL   // live frontend
// ];

// // ===========================
// // CORS middleware for Express
// // ===========================
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
//       else callback(new Error("CORS blocked by Express"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );
// const ALLOWED_ORIGINS = [
//   "http://localhost:5173",
//   process.env.FRONTEND_URL
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
//     else callback(new Error("CORS blocked by Express"));
//   },
//   credentials: true
// }));
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // local dev
  process.env.FRONTEND_URL  // live frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("Origin:", origin);
    if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true);
    else callback(new Error("CORS blocked by Express"));
  },
  credentials: true,
}));
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

app.get("/", (req, res) => res.send("🚀 Server is running"));

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