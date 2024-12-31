import { envVariables } from "./config";
import { Server } from "./server";
import { WhatsappService } from "./services";
import { AppRoutes } from "./routes/server.routes";
import { CronjobService } from "./services";

async function main() {
  const whatsappService = new WhatsappService();

  const appRoutes = new AppRoutes();

  const server = new Server({
    port: envVariables.PORT,
    router: appRoutes.routes,
  });

  whatsappService.setIo(server.io);

  await whatsappService.connect().catch((error: Error) => {
    console.log("Error en la conexión con whatsapp", error);
  });

  appRoutes.setStore(whatsappService.store);

  await server.start().catch((error: Error) => {
    console.log("Error al iniciar el servidor", error);
  });

  // Manejar conexiones de Socket.IO
  server.io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Emitir el estado actual al cliente que se conecta
    if (whatsappService.getConnectionStatus()) {
      socket.emit("authenticated", "Autenticado en WhatsApp");
    } else {
      socket.emit("qr", {
        qr: whatsappService.qrCodeDataURL,
        message: "Escanea el código QR con tu teléfono",
      });
    }
  });

  // Tarea programada con CronJob
  const cronjob = new CronjobService();
  cronjob.run();
}

main();
