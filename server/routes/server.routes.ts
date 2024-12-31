import { Response, Router } from "express";
import { ProductRoutes } from "./products.routes";

import { ContactRoutes } from "./contacts.routes";

export class AppRoutes {
  private contactRoutes = new ContactRoutes();

  setStore(store: any) {
    this.contactRoutes.setStore(store);
  }

  get routes(): Router {
    const router = Router();

    router.get("/", (_, res: Response) => {
      res.sendFile("index.html", { root: "dist" });
    });

    router.use("/products", ProductRoutes.routes);

    router.use("/contacts", this.contactRoutes.routes);

    return router;
  }
}
