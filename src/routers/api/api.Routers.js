import { Router } from "express";
import { productsRouter } from "./products.Router.js";
import { cartsRouter } from "./carts.Router.js";
import { ussersRouter } from "./ussers.Router.js";
import { chatRouter } from "./chat.Router.js";
export const apiRouter = new Router();

//Se agregan las apis de productos y Carts

apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);
apiRouter.use("/sessions", ussersRouter);
apiRouter.use("/messages", chatRouter);
