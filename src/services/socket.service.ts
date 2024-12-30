import { io } from "socket.io-client";

const HOST = (import.meta.env.VITE_HOST as string) || "http://localhost:3000";

export const socketService = io(HOST, { transports: ["websocket", "polling"] });
