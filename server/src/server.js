
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { config } from "./config/config.js";
import { apiLimiter, socketRateLimit } from "./middleware/rateLimiter.js";

import chatSocket from "./sockets/chat.socket.js";
import matchingSocket from "./sockets/matching.socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());

app.use(cors({
    origin: config.clientUrl,
    methods: ["GET", "POST"],
}));

app.use(express.json({ limit: "10kb" }));

// Rate limit API routes
app.use("/api", apiLimiter);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "Omegly API",
        status: "running",
    });
});

// Socket.IO server
const io = new Server(server, {
    cors: {
        origin: config.clientUrl,
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 100000,
});

// Socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socketRateLimit(socket);

    chatSocket(io, socket);
    matchingSocket(io, socket);

    socket.on("disconnect", (reason) => {
        console.log("User disconnected:", socket.id, reason);
    });
});

// Start server
server.listen(config.port, () => {
    console.log(`🚀 Omegly running on port ${config.port}`);
});
