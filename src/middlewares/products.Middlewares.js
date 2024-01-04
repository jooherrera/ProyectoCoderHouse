import { managerProducts } from "../dao/models/fs/productManager.js";

//Valida los campos de los productos enviados desde el body para luego enviarlos al controlador y agregarlos
export async function validarCamposMiddleware(req, res, next) {
  try {
    const productoBody = req.body;
    const esValido = await managerProducts.addProduct(productoBody);
    if (!esValido) {
      throw error("Campos Invalidos");
    } else {
      res["productBody"] = productoBody;
      next();
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", message: "error al agregar el producto" });
  }
}
