
import {
    findMatch,
    removeFromQueue,
    getPublicProfile,
    clearPartner,
} from "../services/matching.service.js";

import { config } from "../config/config.js";

const validGenders = ["male", "female", "other"];

const validateUser = (profile, filters, consent) => {
    if (!profile || !filters || !consent) return false;

    // Consent validation
    if (
        consent.adultConfirmed !== true ||
        consent.respectConfirmed !== true ||
        consent.safetyConfirmed !== true
    ) {
        return false;
    }

    // Profile validation
    const age = Number(profile.age);

    if (
        !Number.isInteger(age) ||
        age < config.minAge ||
        age > config.maxAge
    ) {
        return false;
    }

    if (!validGenders.includes(profile.gender)) return false;

    if (
        typeof profile.country !== "string" ||
        !profile.country.trim() ||
        profile.country.length > 80
    ) {
        return false;
    }

    // Filter validation
    const gender = filters.gender || "any";
    const country = filters.country || "any";

    const minAge = Number(filters.minAge ?? config.minAge);
    const maxAge = Number(filters.maxAge ?? config.maxAge);

    if (!["any", ...validGenders].includes(gender)) return false;

    if (
        typeof country !== "string" ||
        country.length > 80
    ) {
        return false;
    }

    if (
        !Number.isInteger(minAge) ||
        !Number.isInteger(maxAge) ||
        minAge < config.minAge ||
        maxAge > config.maxAge ||
        minAge > maxAge
    ) {
        return false;
    }

    // Tags are optional soft preferences
    if (
        !Array.isArray(profile.tags ?? []) ||
        (profile.tags ?? []).length > 10 ||
        !(profile.tags ?? []).every(
            tag => typeof tag === "string" && tag.length <= 30
        )
    ) {
        return false;
    }

    return true;
};

const matchingSocket = (io, socket) => {

    // FIND STRANGER / NEXT STRANGER
    socket.on("matching:find", (data = {}) => {
        try {
            // Remove old waiting entry
            removeFromQueue(socket.id);

            // End previous conversation
            clearPartner(io, socket, "Stranger has moved to the next chat.");

            const { profile, filters, consent } = data;

            if (!validateUser(profile, filters, consent)) {
                return socket.emit("matching:error", {
                    message: "Invalid profile, filters or consent.",
                });
            }

            const user = {
                socketId: socket.id,

                profile: {
                    gender: profile.gender,
                    age: Number(profile.age),
                    country: profile.country.trim(),
                    tags: (profile.tags || []).map(tag => tag.trim()),
                },

                preferences: {
                    gender: filters.gender || "any",
                    country: filters.country || "any",
                    minAge: Number(filters.minAge ?? config.minAge),
                    maxAge: Number(filters.maxAge ?? config.maxAge),
                },
            };

            socket.data.profile = user.profile;
            socket.data.profile = {
                gender: profile.gender,
                age: profile.age,
                country: profile.country,
                tags: profile.tags || [],
            };

            socket.emit("matching:searching", {
                message: "Looking for a stranger...",
            });

            const stranger = findMatch(
                user,
                (id) => io.sockets.sockets.has(id)
            );

            if (!stranger) return;

            const strangerSocket = io.sockets.sockets.get(stranger.socketId);

            // Safety check before connecting
            if (!strangerSocket || strangerSocket.data.partnerId) {
                removeFromQueue(stranger.socketId);

                // Put current user back into queue
                findMatch(user, (id) => io.sockets.sockets.has(id));

                return;
            }

            // Connect both users
            socket.data.partnerId = stranger.socketId;
            strangerSocket.data.partnerId = socket.id;

            strangerSocket.emit("matching:found", {
                message: "Stranger connected!",
                partner: getPublicProfile(user.profile),
            });

            socket.emit("matching:found", {
                message: "Stranger connected!",
                partner: getPublicProfile(stranger.profile),
            });

        } catch (error) {
            console.error("Matching error:", error);

            removeFromQueue(socket.id);

            socket.emit("matching:error", {
                message: "Unable to find a stranger. Please try again.",
            });
        }
    });


    // CANCEL SEARCH
    socket.on("matching:cancel", () => {
        removeFromQueue(socket.id);

        socket.emit("matching:cancelled", {
            message: "Search cancelled.",
        });
    });


    // DISCONNECT CLEANUP
    socket.on("disconnect", () => {
        removeFromQueue(socket.id);

        clearPartner(io, socket);
    });

};

export default matchingSocket;
