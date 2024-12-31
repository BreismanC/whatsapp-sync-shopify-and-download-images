import { Router } from "express";
import { ContactController } from "../controllers";

export class ContactRoutes {
  private router = Router();
  private controller = new ContactController();

  setStore(store: any) {
    this.controller.setStore(store);
  }

  get routes(): Router {
    this.router.get("/", this.controller.get.bind(this.controller));

    this.router.get(
      "/:id/chat",
      this.controller.getChatImagesById.bind(this.controller)
    );

    return this.router;
  }
}
