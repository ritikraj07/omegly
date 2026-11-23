
import crypto from "node:crypto";

import {
    clearPartner,
} from "../services/matching.service.js";


const getPublicProfile = (profile) => ({
    gender: profile?.gender || "unknown",
    age: profile?.age ?? null,
    country: profile?.country || "Unknown",
    tags: Array.isArray(profile?.tags)
        ? profile.tags
        : [],
});

const chatSocket = (io, socket) => {

    // SEND MESSAGE
    socket.on("chat:message", ({ message } = {}) => {
        try {
            if (
                typeof message !== "string" ||
                !message.trim() ||
                message.length > 2000
            ) {
                return socket.emit("chat:error", {
                    message: "Invalid message.",
                });
            }

            const partnerId = socket.data.partnerId;

            if (!partnerId) {
                return socket.emit("chat:error", {
                    message: "You are not connected to anyone.",
                });
            }

            const partnerSocket = io.sockets.sockets.get(partnerId);

            // Ensure both users are still connected to each other
            if (
                !partnerSocket ||
                partnerSocket.data.partnerId !== socket.id
            ) {
                clearPartner(io, socket);

                return socket.emit("chat:error", {
                    message: "Your chat connection has ended.",
                });
            }

            const messageData = {
                id: crypto.randomUUID(),
                message: message.trim(),
                senderId: socket.id,
                receiverId: partnerId,
                timestamp: new Date().toISOString(),
            };

            // Send to both users
            socket.emit("chat:message", messageData);
            partnerSocket.emit("chat:message", messageData);

        } catch (error) {
            console.error("Chat message error:", error);
        }
    });


    // TYPING INDICATOR
    socket.on("chat:typing", (isTyping) => {
        const partnerId = socket.data.partnerId;

        if (!partnerId) return;

        const partnerSocket = io.sockets.sockets.get(partnerId);

        if (!partnerSocket || partnerSocket.data.partnerId !== socket.id) {
            return clearPartner(io, socket);
        }

        partnerSocket.emit("chat:typing", Boolean(isTyping));
    });


    // STOP CHAT
    socket.on("chat:stop", () => {
        clearPartner(io, socket, "Stranger has ended the chat.");

        socket.emit("chat:stopped", {
            message: "Chat ended.",
        });
    });

    // GET STRANGER PROFILE
socket.on("chat:get-partner-info", () => {
    const partnerId = socket.data.partnerId;

    if (!partnerId) {
        return socket.emit("chat:error", {
            message: "You are not connected to anyone.",
        });
    }

    const partnerSocket = io.sockets.sockets.get(partnerId);

    if (
        !partnerSocket ||
        partnerSocket.data.partnerId !== socket.id
    ) {
        clearPartner(io, socket);

        return socket.emit("chat:error", {
            message: "Your chat connection has ended.",
        });
    }

    socket.emit("chat:partner-info", {
        profile: getPublicProfile(partnerSocket.data.profile),
    });
});

};

export default chatSocket;
