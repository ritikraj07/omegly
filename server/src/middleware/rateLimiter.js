
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

export const socketRateLimit = (socket) => {
    const limits = {
        "chat:message": { max: 8, window: 10000 },
        "chat:typing": { max: 10, window: 5000 },
        "matching:find": { max: 5, window: 30000 },
        "matching:cancel": { max: 5, window: 30000 },
    };

    const history = new Map();

    socket.use(([event], next) => {
        const now = Date.now();

        const rule = limits[event] || {
            max: 60,
            window: 10000,
        };

        const timestamps = (history.get(event) || [])
            .filter(time => now - time < rule.window);

        if (timestamps.length >= rule.max) {
            socket.emit("socket:rate-limit", {
                message: "Too many requests. Please slow down.",
            });

            return next(new Error("Rate limit exceeded."));
        }

        timestamps.push(now);
        history.set(event, timestamps);

        next();
    });
};
