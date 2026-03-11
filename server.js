// server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const roomRoute = require("./src/routes/room.route.js");
const chatSocket = require("./src/socket/socket.js");
const connectToDb = require("./src/db/db.js");

const app = express();

/* ===============================
   1️⃣ FRONTEND URL
================================ */


/* ===============================
   2️⃣ CORS MIDDLEWARE (CRASH-FREE)
================================ */
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);



// IMPORTANT: handle preflight properly




/* ===============================
   3️⃣ BODY PARSER
================================ */
app.use(express.json());

/* ===============================
   4️⃣ DATABASE CONNECTION
================================ */
const PORT = process.env.PORT || 3000;

// const startServer = async () => {
//   try {
//     await connectToDb();

//     expServer.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });

//   } catch (error) {
//     console.error("DB connection failed:", error);
//   }
// };

// startServer();

connectToDb()
/* ===============================
   5️⃣ ROUTES
================================ */

app.use("/room", roomRoute);
app.get("/create", (req, res) => {
  res.send("Backend is running 🚀");
});
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});



/* ===============================
   6️⃣ SOCKET SERVER
================================ */
const expServer = createServer(app);


const io = new Server(expServer, {
  cors: {
    origin: [FRONTEND_URL],
    methods: ["GET", "POST"],
  },
});

chatSocket(io);

/* ===============================
   7️⃣ START SERVER
================================ */

/* ===============================
   7️⃣ START SERVER
================================ */

expServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});