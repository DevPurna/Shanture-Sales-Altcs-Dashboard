// backend/server.js
require("dotenv").config(); 
const express = require("express"); // Express framework
const http = require("http"); // HTTP server
const morgan = require("morgan"); // Logger middleware
const cors = require("cors"); // CORS middleware
const connectDB = require("./config/db"); 
const analyticsRoutes = require("./routes/analytics"); 

const app = express();
const server = http.createServer(app);

// Socket.io (Realtime support)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Make io accessible in routes/controllers
app.set("io", io);

// Middlewares 
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes 
app.use("/api/analytics", analyticsRoutes);

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

const Sale = require("./models/Sales");

Sale.watch().on("change", (change) => { 
  if (change.operationType === "insert") {
    const io = app.get("io");
    io.emit("newSale", change.fullDocument);
    console.log("📢 New sale broadcasted:", change.fullDocument);
  }
});
