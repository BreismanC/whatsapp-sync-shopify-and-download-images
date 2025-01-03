import cron from "node-cron";
import moment from "moment-timezone";

import { ProductService } from "./product.service";
import { ShopifyService } from "./shopify.service";
import { generateRecord, isDifferenceThreeDays } from "../utils";

import { Record } from "../interfaces";

export class CronjobService {
  private readonly productService: ProductService;
  private readonly shopifyService: ShopifyService;

  constructor() {
    this.productService = new ProductService();
    this.shopifyService = new ShopifyService();
  }

  /**
   * Tarea que se ejecuta todos los días a las 2 de la mañana
   */
  run() {
    cron.schedule(
      "0 2 * * *",
      async () => {
        const localTime = moment().tz("America/Bogota").format();
        console.log(`Ejecutando tarea programada a las ${localTime}`);

        //Definimos la fecha de comparación y el estado que tendrán los productos
        const comparisonTime = moment().tz("America/Bogota").format();
        const status = "draft";

        const record: Record = {
          error: false,
          data: null,
        };

        //Consultar los productos en la base de datos que estén activos
        const activeProducts = await this.productService.getByStatusActive();

        //Recorrer los productos y para cada uno se debe actualizar el producto en shopify cambiando el estado a "draft"

        for (const product of activeProducts) {
          const { id, shopifyId, createdAt } = product;

          if (!isDifferenceThreeDays(createdAt.toISOString(), comparisonTime))
            continue;

          try {
            const productUpdated = await this.shopifyService.updateProduct(
              shopifyId as unknown as number,
              status
            );

            //Una vez realizada la operación en shopify se actualiza el registro en la base de datos
            await this.productService.update(id!, {
              status: productUpdated.status,
              updatedAt: new Date(productUpdated.updated_at),
            });

            console.log(
              `Producto con shopifyId ${shopifyId} actualizado correctamente`
            );

            record.error = false;
            record.data = JSON.stringify({
              ...product,
              status,
              updatedAt: productUpdated.updated_at,
            });
          } catch (error) {
            if (error instanceof Error) {
              console.log(
                "Ha ocurrido un error al intentar actualizar el producto",
                error
              );
              record.error = true;
              record.data = error.message;
            } else {
              record.error = true;
            }
          } finally {
            //Se guarda registro de la operación en el archivo de logs
            await generateRecord(record);
          }
        }
      },
      {
        timezone: "America/Bogota",
      }
    );
  }
}
