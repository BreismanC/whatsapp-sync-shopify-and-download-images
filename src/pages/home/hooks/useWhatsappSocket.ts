import { useEffect, useState } from "react";
import { type Socket } from "socket.io-client";
import { socketService } from "../../../services";

interface QRData {
  qr: string;
  message: string;
}

const initalQRData: QRData = {
  qr: "connecting",
  message: "Conectando...",
};

export const useWhatsappConnector = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [qrData, setQRData] = useState<QRData>(initalQRData);

  useEffect(() => {
    setSocket(socketService);

    socketService.on("connecting", () => {
      setQRData({ qr: "connecting", message: "Conectando..." });
    });

    socketService.on("authenticated", (message: string) => {
      setQRData({ qr: "authenticated", message });
    });

    socketService.on("qr", ({ qr, message }: QRData) => {
      setQRData({ qr, message });
    });

    socketService.on("disconnect", (message: string) => {
      setQRData({ qr: "disconnected", message: message || "Desconectado" });
    });

    return () => {
      socketService.disconnect(); // Desconectar el socket al desmontar el componente
    };
  }, []);

  return { socket, qrData };
};
