import { useWhatsappConnector } from "../../hooks";
import { QrCode } from "../";

export const WhatsappConnector = () => {
  const { socket, qrData } = useWhatsappConnector();

  return (
    <div>
      {socket ? (
        <QrCode qr={qrData.qr} message={qrData.message} />
      ) : (
        <p>Error al conectar con el servidor</p>
      )}
    </div>
  );
};
