import {
  useMultiFileAuthState,
  default as makeWASocket,
  ConnectionState,
  DisconnectReason,
  WAMessage,
  MessageUpsertType,
  makeInMemoryStore,
  Contact,
  downloadMediaMessage,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

import { Server } from "socket.io";
import QRCode from "qrcode";

import { ProductService } from "./product.service";
import { ShopifyService } from "./shopify.service";

import { envVariables } from "../config/envVariables";
import { ProductImage, ProductToShopify, Record } from "../interfaces";

import {
  bufferToBase64,
  extractProductInfo,
  generateRecord,
  isProductMessage,
} from "../utils";

const AUTH_PATH = "./persistent_volume/auth";

export class WhatsappService {
  public socket: any;
  public store: any;
  private io: Server | undefined;
  private isAuthenticated: boolean = false;
  public qrCodeDataURL: string | undefined;
  private productCreationLines: string[] = [];
  private productComposition: Array<{ info: any; media: Buffer }> = [];
  private shopifyService: ShopifyService;
  private productService: ProductService;

  constructor() {
    this.shopifyService = new ShopifyService();
    this.productService = new ProductService();
    this.productCreationLines = [
      envVariables.LINE_1_TO_PRODUCT_CREATION,
      envVariables.LINE_2_TO_PRODUCT_CREATION,
    ];
  }

  setIo(io: Server) {
    this.io = io;
  }

  async connect() {
    if (!this.io) throw new Error("Socket.IO no configurado");
    // Lógica de conexión
    this.handleStore();
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_PATH);

    // Inicia el socket
    this.socket = makeWASocket({
      auth: state, // Tu configuración de autenticación
      printQRInTerminal: false, // Si deseas mostrar el QR en consola para escanear
    });

    this.store.bind(this.socket.ev);

    this.socket.ev.on("creds.update", saveCreds);
    this.socket.ev.on(
      "connection.update",
      this.handleConnectionUpdate.bind(this)
    );
    this.socket.ev.on("messages.upsert", this.handleMessagesUpsert.bind(this));

    this.socket.ev.on("contacts.upsert", this.handleContactsUpsert);
  }

  public isConnected() {
    return this.socket.user ? true : false;
  }

  public getConnectionStatus(): boolean {
    return this.isAuthenticated;
  }

  private handleStore() {
    const STORE_PATH = `${AUTH_PATH}/baileys_store.json`;
    this.store = makeInMemoryStore({});
    this.store.readFromFile(STORE_PATH);
    setInterval(() => {
      this.store.writeToFile(STORE_PATH);
    }, 10000);
  }

  private async handleConnectionUpdate(update: Partial<ConnectionState>) {
    if (!this.io) throw new Error("Socket.IO no configurado");

    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        //Generate the QR as Data URL and send it to the frontend
        this.qrCodeDataURL = await QRCode.toDataURL(qr);
        this.io.emit("qr", {
          qr: this.qrCodeDataURL,
          message: "Escanea el código QR con tu teléfono",
        });
        console.log("QR emitido al frontend");
      } catch (error) {
        throw new Error("Error al enviar el código QR al front");
      }
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );

      this.isAuthenticated = false;
      this.qrCodeDataURL = undefined;
      this.io.emit("disconnected", "Desconectado de whatsapp");

      // reconnect if not logged out
      if (shouldReconnect) {
        this.connect();
      }
    } else if (connection === "open") {
      this.isAuthenticated = true;
      this.io.emit("authenticated", "Autenticado en Whatsapp");
      console.log("Conexión a WhatsApp abierta");
    } else if (connection === "connecting") {
      this.io.emit("connecting", "Realizando conexión");
      console.log("Conectando con whatsapp");
    }
  }

  private async handleMessagesUpsert({
    messages,
    type,
  }: {
    messages: WAMessage[];
    type: MessageUpsertType;
  }) {
    if (type !== "notify") {
      return;
    }

    for (let msg of messages) {
      if (msg.key.remoteJid !== envVariables.GROUP_ID) {
        continue;
      }

      console.log("Mensaje en grupo de interés");

      const senderNumber = msg.key.participant
        ?.split("@")[0]
        .replace(/\D/g, "");

      if (
        !this.productCreationLines.some(
          (authorizedNumber) => senderNumber === authorizedNumber
        )
      ) {
        console.log("Mensaje no es de la persona de interés");
        continue;
      }

      if (msg.message?.imageMessage) {
        await this.handleImageMessage(msg);
      } else {
        await this.handleTextMessage(msg);
      }
    }
  }

  private async handleImageMessage(msg: WAMessage) {
    console.log("Procesando mensaje de tipo imagen");
    try {
      const media = await downloadMediaMessage(msg, "buffer", {});
      if (!media) {
        console.log("No hay datos de la imagen");
        return;
      }
      this.productComposition.push({ info: msg.message?.imageMessage, media });
      console.log("Imagen procesada con éxito");
    } catch (error) {
      console.log("Sucedió un error al intentar recuperar la imagen: ", error);
    }
  }

  private async handleTextMessage(msg: WAMessage) {
    console.log("Procesando mensaje de tipo texto");
    const messageConversation = msg.message?.conversation;
    if (!messageConversation) {
      console.log("No hay conversación en este mensaje");
      this.productComposition = [];
      return;
    }

    if (!isProductMessage(messageConversation)) {
      console.log("Mensaje no contiene la estructura de un producto");
      this.productComposition = [];
      return;
    }

    const productInfo = await extractProductInfo(messageConversation);
    if (!productInfo) {
      console.log(
        "Ha ocurrido un error extrayendo la información del producto"
      );
      return;
    }

    //Validar que el sku aún no exista en la BD
    try {
      const productSearched = await this.productService.getBySku(
        productInfo.sku
      );
      if (productSearched)
        throw new Error(
          `Producto con SKU: ${productInfo.sku} ya existe en la base de datos`
        );
    } catch (error) {
      if (error instanceof Error) {
        this.productComposition = [];
        console.log(
          `Ha ocurrido un error consultando el SKU en la base de datos, error: ${error}`
        );
        return;
      }
    }

    const images: ProductImage[] = this.productComposition.map(({ media }) => ({
      attachment: bufferToBase64(media),
    }));

    const productData: ProductToShopify = { ...productInfo, images };
    const productCreated = await this.shopifyService.createProduct(productData);

    let record: Record = {};
    if (!productCreated) {
      record.error = true;
      record.data = "Error al crear el producto en Shopify";
    } else {
      try {
        const productSaved = await this.productService.create({
          shopifyId: productCreated.id.toString(),
          name: productCreated.title,
          sku: productInfo.sku,
        });
        console.log(`Producto guardado en la base de datos: ${productSaved}`);
        record.data = JSON.stringify(productSaved);
      } catch (error) {
        if (error instanceof Error) {
          console.log(
            `Error al crear el producto [${productInfo.title}] en la base de datos`
          );
          record.error = true;
          record.data = `${error.message} - ${error.stack}`;
        }
      }
    }

    generateRecord(record);
    this.productComposition = [];
    console.log("Texto procesado con éxito");
  }

  handleContactsUpsert() {
    console.log(
      "Contactos iniciales recibidos, ya puedes acceder a sock.store.contacts"
    );
    const contacts = this.socket?.store?.contacts;

    if (!contacts) {
      return;
    }

    const contactList: Contact[] = Object.values(contacts);
    const userContacts = contactList.filter(
      (contact) =>
        contact.id &&
        !contact.id.includes("@g.us") &&
        !contact.id.includes("@s.whatsapp.net")
    );

    userContacts.forEach((contact) => {
      console.log(
        "Nombre:",
        contact.name || contact.verifiedName || "Sin nombre"
      );
      console.log("Número:", contact.id.split("@")[0]);
      console.log("--------------------");
    });
  }
}
