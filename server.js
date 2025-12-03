import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from './routes/userRoutes.js';

import logger from './config/logger.js';
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------------------
//  CORS SETUP
// ------------------------------
app.use(cors({
 origin: ["https://frontend-production-ff46.up.railway.app"], 
 // Updated frontend URL
  // origin: "http://localhost:5173", // old localhost URL (commented)
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Logs folder
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ------------------------------
//  SOCKET.IO SETUP
// ------------------------------
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket.js";

const server = http.createServer(app);

const io = initSocket(
  new Server(server, {
    cors: {
    origin: ["https://frontend-production-ff46.up.railway.app"], 
 // Updated frontend URL
     //origin: "http://localhost:5173", // old localhost URL (commented)
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  })
);

// connection event
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ------------------------------
//  ROUTES
// ------------------------------
app.use('/api/users', userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

// ------------------------------
//  DATABASE + SERVER START
// ------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGO_URI:", process.env.MONGO_URI);
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`))
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`⚠️ Port ${PORT} in use, trying 5001...`);
        server.listen(5001, () => logger.info('🚀 Server running on port 5001'));
      } else logger.error(`❌ Server error: ${err.message}`);
    });
};

connectDB();
startServer();

// ===================================================================
// ------------------------------
//   GRACEFUL SHUTDOWN
// ===================================================================
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ Received ${signal} — starting graceful shutdown...`);

  try {
    server.close(() => {
      console.log("🛑 HTTP server closed.");
    });

    io.close(() => {
      console.log("🔌 Socket.IO connections closed.");
    });

    await mongoose.connection.close(false);
    console.log("📦 MongoDB connection closed.");

    console.log("✅ Graceful shutdown completed.");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));   // CTRL + C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // PM2 / Render / Docker
