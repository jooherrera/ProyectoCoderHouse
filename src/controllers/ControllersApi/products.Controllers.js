import { managerProducts } from "../../dao/models/fs/productManager.js";
import { productsMongoose } from "../../dao/services/index.js";
import { conectar, desconectar } from "../../dao/services/index.js";
import { changeNameAndId } from "../../middlewares/multer.Middlewares.js";

// funciones GET constrollers de los productos

//getProductsController Devuelve la lista de los productos almacenados en la base de datos, si existe un limite en req.query.limit, devolvera solo los promeros limits del arreglo
export async function getProductsController(req, res) {
  try {
    const cantidad = parseInt(req.query.limit);
    // FORMA DE OBTENER LOS PRODUCTOS CON FILE SYSTEM:
    //const array = await managerProducts.getProducts();

    //FORMA CON MONGOOSE:
    await conectar();
    const array = await productsMongoose.find().lean();
    /* const limitar = await productsMongoose.aggregate[
      {
        $limit: { cantidad },
      }
    ];
*/
    await desconectar();
    if (!cantidad) {
      return res.status(200).json({ status: "success", products: array });
    } else {
      return res
        .status(200)
        .json({ statuss: "sucess", products: array.slice(0, cantidad) });
    }
    throw new error("Error , PRODUCTO NO ENCONTRADO ");
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}

// Devuelve el producto con el ID especifico, en caso de no existir deuelve False
export async function getProductsByIdController(req, res) {
  try {
    const _id = req.params.pid;
    // const productID = await managerProducts.getProductById(id);
    await conectar();
    const productID = await productsMongoose.findById(_id).lean();
    await desconectar();
    return res.status(200).json({ status: "success", products: productID });
  } catch (error) {
    await desconectar();
    return res.status(400).json({
      status: "error",
      message: "error en mostrar el producto por ID ",
    });
  }
}
//Se envia la funcion agregada en res["sendProducts"]() del socket para actualizar los productos
export async function postAgregarProductController(req, res) {
  try {
    res["sendProducts"]();
    return res.status(201).json(res["productBody"]);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}

//Se envia por un body los campos y los valores a actualizar en el producto, ademas de volver a enviar los productos con el socket
export async function actualizarProductoIdController(req, res) {
  const objects = req.body;
  const campos = Object.keys(objects);
  const valores = Object.values(objects);
  const id = req.params.pid;
  try {
    for (let index = 0; index < campos.length; index++) {
      await managerProducts.updateProduct(id, campos[index], valores[index]);
    }

    res["sendProducts"]();
    return res.status(201).json(await managerProducts.getProductById(id));
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: " Error al Actualizando producto",
    });
  }
}

//Se elimina el producto de la base de datos y se envia los productos por el socket
export async function eliminarProductoIdController(req, res) {
  const id = req.params.pid;

  try {
    await managerProducts.deleteProductByID(id);
    res["sendProducts"]();
    return res
      .status(201)
      .json({ status: "success", messagge: `${id} ya no esta en la lista` });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "error Eliminando producto",
    });
  }
}

//se crea un producto nuevo en la base de datos

export async function postAgregarProductMongoDBController(req, res) {
  try {
    // changeNameAndId(req);
    await conectar();
    const nuevoProduct = await productsMongoose.create(req.body);
    await desconectar();
    return res.status(201).json(nuevoProduct.toObject());
  } catch (error) {
    await desconectar();
    return res.status(400).json({ status: "error", message: error.message });
  }
}

export async function actualizarProductoIdMongoController(req, res) {
  try {
    await conectar();
    const _id = req.params.pid;
    const productUpdate = await productsMongoose.findByIdAndUpdate(
      _id,
      { $set: req.body },
      {
        new: true,
      }
    );
    await desconectar();
    if (!productUpdate) {
      return res
        .status(400)
        .json({ status: "error", message: "id no encontrado" });
    } else {
      return res.status(200).json(productUpdate);
    }
  } catch (error) {
    await desconectar();
    return res.status(400).json({ status: "error", message: error.message });
  }
}

export async function deleteProductMongoose(req, res) {
  try {
    await conectar();
    const _id = req.params.pId;
    const productoEliminado = await productsMongoose
      .findByIdAndDelete(_id)
      .lean();

    await desconectar();
    if (!productoEliminado) {
      return res.status(400).json({
        status: "error",
        message: "Id Invalido para eliminar el producto",
      });
    }
    return res.status(200).json(productoEliminado);
  } catch (error) {
    await desconectar();
    return res.status(400).json({ status: "error", message: error.message });
  }
}

export async function agregarImg(req, res) {}
