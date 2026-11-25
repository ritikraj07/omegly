
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

const allowedOrigins = [
    config.clientUrl,
    "https://omegly.vercel.app",
].filter(Boolean);

// Security middleware
app.use(helmet());

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(express.json({ limit: "10kb" }));

app.use("/api", apiLimiter);

app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "Omegly API",
        status: "running",
    });
});

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
    maxHttpBufferSize: 100000,
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socketRateLimit(socket);
    chatSocket(io, socket);
    matchingSocket(io, socket);

    socket.on("disconnect", (reason) => {
        console.log("User disconnected:", socket.id, reason);
    });
});

server.listen(config.port, "0.0.0.0", () => {
    console.log(`Omegly running on port ${config.port}`);
});
