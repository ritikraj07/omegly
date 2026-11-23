
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import socket from "../services/socket";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setError("");
    };

    const onDisconnect = () => {
      setConnected(false);
      setStatus("idle");
      setPartner(null);
    };

    const onConnectError = (err) => {
      setConnected(false);
      setError(err.message || "Unable to connect to server");
    };

    const onSearching = () => {
      setStatus("searching");
      setMessages([]);
      setPartner(null);
      setError("");
    };

    const onMatched = (data) => {
      setStatus("connected");
      setPartner(data?.partner || data || null);
      setMessages([]);
      setError("");
    };

    const onMessage = (data) => {
      const incoming =
        typeof data === "string" ? { message: data } : data;

      if (!incoming?.message) return;

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: incoming.message,
          sender:
            incoming.senderId === socket.id ? "you" : "stranger",
          createdAt: incoming.createdAt || new Date().toISOString(),
        },
      ]);
    };

    const onMatchingError = (data) => {
      setStatus("idle");
      setError(data?.message || "Matching failed. Please try again.");
    };

    const onChatError = (data) => {
      setError(data?.message || "Unable to send message.");
    };

    const onPartnerDisconnected = (data) => {
      setStatus("idle");
      setPartner(null);
      setError(data?.message || "Stranger disconnected.");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("matching:searching", onSearching);
    socket.on("matching:found", onMatched);
    socket.on("chat:message", onMessage);
    socket.on("matching:error", onMatchingError);
    socket.on("chat:error", onChatError);
    socket.on("chat:partner-disconnected", onPartnerDisconnected);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("matching:searching", onSearching);
      socket.off("matching:found", onMatched);
      socket.off("chat:message", onMessage);
      socket.off("matching:error", onMatchingError);
      socket.off("chat:error", onChatError);
      socket.off("chat:partner-disconnected", onPartnerDisconnected);
    };
  }, []);

  const findStranger = useCallback((payload) => {
    if (!socket.connected) {
      setError("Server connection unavailable.");
      return;
    }

    if (payload.filters.minAge > payload.filters.maxAge) {
      setError("Minimum age cannot exceed maximum age.");
      return;
    }

    setError("");
    setMessages([]);
    setPartner(null);
    setStatus("searching");

    socket.emit("matching:find", payload);
  }, []);

  const sendMessage = useCallback((message) => {
    const trimmed = message.trim();

    if (!trimmed || !socket.connected || status !== "connected") {
      return;
    }

    socket.emit("chat:message", { message: trimmed });
  }, [status]);

  const nextStranger = useCallback((payload) => {
    if (!socket.connected) return;

    if (status === "connected") {
      socket.emit("chat:stop");
    } else if (status === "searching") {
      socket.emit("matching:cancel");
    }

    setMessages([]);
    setPartner(null);
    setError("");
    setStatus("searching");

    socket.emit("matching:find", payload);
  }, [status]);

  const stopChat = useCallback(() => {
    if (socket.connected) {
      if (status === "connected") {
        socket.emit("chat:stop");
      } else if (status === "searching") {
        socket.emit("matching:cancel");
      }
    }

    setStatus("idle");
    setMessages([]);
    setPartner(null);
    setError("");
  }, [status]);

  const value = {
    connected,
    status,
    messages,
    partner,
    error,
    findStranger,
    sendMessage,
    nextStranger,
    stopChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used inside ChatProvider");
  }

  return context;
}
