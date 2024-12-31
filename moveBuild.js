import fs from "fs-extra";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Obtener el directorio actual en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function moveBuildFolder() {
  const source = resolve(__dirname, "dist");
  const destination = resolve(__dirname, "server", "public");

  try {
    // Elimina la carpeta destino si ya existe
    await fs.remove(destination);
    console.log(`Eliminado: ${destination}`);

    // Copia la carpeta source al destino
    await fs.copy(source, destination);
    await fs.remove(source);
    console.log(`Carpeta movida de ${source} a ${destination}`);
  } catch (error) {
    console.error(`Error al mover la carpeta: ${error.message}`);
    process.exit(1);
  }
}

moveBuildFolder();
