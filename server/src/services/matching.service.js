
import { config } from "../config/config.js";

const waitingQueue = new Map();

const normalize = (value) =>
    String(value ?? "").trim().toLowerCase();

const matchesPreferences = (preferences, profile) => {
    const gender = normalize(preferences.gender || "any");
    const country = normalize(preferences.country || "any");

    if (gender !== "any" && gender !== normalize(profile.gender)) {
        return false;
    }

    if (country !== "any" && country !== normalize(profile.country)) {
        return false;
    }

    const minAge = preferences.minAge ?? config.minAge;
    const maxAge = preferences.maxAge ?? config.maxAge;

    return profile.age >= minAge && profile.age <= maxAge;
};

const isMutualMatch = (userA, userB) => {
    return (
        matchesPreferences(userA.preferences, userB.profile) &&
        matchesPreferences(userB.preferences, userA.profile)
    );
};

// Find a compatible user or add current user to queue
export const findMatch = (user, isSocketAvailable) => {
    waitingQueue.delete(user.socketId);

    for (const [socketId, candidate] of waitingQueue.entries()) {
        // Remove disconnected users
        if (!isSocketAvailable(socketId)) {
            waitingQueue.delete(socketId);
            continue;
        }

        if (isMutualMatch(user, candidate)) {
            waitingQueue.delete(socketId);
            return candidate;
        }
    }

    waitingQueue.set(user.socketId, user);

    return null;
};

// Remove user from queue
export const removeFromQueue = (socketId) => {
    return waitingQueue.delete(socketId);
};

// Get waiting count
export const getWaitingCount = () => waitingQueue.size;

// Get safe public profile
export const getPublicProfile = (profile) => ({
    gender: profile.gender,
    age: profile.age,
    country: profile.country,
    tags: profile.tags || [],
});

// Disconnect both users safely
export const clearPartner = (io, socket, message = "Stranger disconnected.") => {
    const partnerId = socket.data.partnerId;

    if (!partnerId) return;

    const partnerSocket = io.sockets.sockets.get(partnerId);

    // Clear current user's connection
    socket.data.partnerId = null;

    if (partnerSocket && partnerSocket.data.partnerId === socket.id) {
        partnerSocket.data.partnerId = null;

        partnerSocket.emit("chat:partner-disconnected", {
            message,
        });
    }
};
