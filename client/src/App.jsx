import AppRoutes from "./routes/AppRoutes";
import { ChatProvider } from "./context/ChatContext";

export default function App() {
  return (
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  );
}
