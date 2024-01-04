import { Router } from "express";
import { upload } from "../../middlewares/multer.Middlewares.js";
import {
  getProductsController,
  getProductsByIdController,
  eliminarProductoIdController,
  agregarImg,
  actualizarProductoIdController,
  postAgregarProductController,
  postAgregarProductMongoDBController,
  actualizarProductoIdMongoController,
  deleteProductMongoose,
} from "../../controllers/ControllersApi/products.Controllers.js";
import { validarCamposMiddleware } from "../../middlewares/products.Middlewares.js";

export const productsRouter = new Router();

//Se agregan todos los Controllers de productos al router productsRouter
//Los gets simplemente comente los getProducts del Filesystem y use el find() de mongoose y funciono perfectamente
productsRouter.get("/", getProductsController);
productsRouter.get("/:pid", getProductsByIdController);
//Para Agregar con fileSistem:
//productsRouter.post('/',  validarCamposMiddleware , postAgregarProductController)
//Agregar producto con Mongoose:
productsRouter.post("/addImg", upload.single("imagenProductos"));
productsRouter.post("/", postAgregarProductMongoDBController);
//Actualizar por FileSystem:
//productsRouter.put("/:pid", actualizarProductoIdController);
//Actualizar por Mongoose:
productsRouter.put("/:pid", actualizarProductoIdMongoController);
//Eliminar producto en FileSystem
//productsRouter.delete("/:pid", eliminarProductoIdController);
//Eliminar por Mongoose:
productsRouter.delete("/:pId", deleteProductMongoose);
