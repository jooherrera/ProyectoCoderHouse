import { cartsManager } from "../../dao/models/fs/cartsManager.js";
import { managerProducts } from "../../dao/models/fs/productManager.js";
import { productsMongoose } from "../../dao/services/index.js";
import {
  cartsMongoose,
  conectar,
  desconectar,
} from "../../dao/services/index.js";
//Constrollers de los Carts que se agregaran al Carts Router

//Crea un nuevo carrito vacio
export async function crearNuevoCarts(req, res) {
  try {
    await conectar();
    const cartN = await cartsMongoose.create({});
    await desconectar();
    res.status(201).json(cartN);
  } catch (error) {
    res.status(400).json({
      status: "ERROR",
      mensaje: "Error en la solicitud de creacion de un nuevo carro",
    });
  }
}

// Agrega el producto (pID) al carrito, verifica si existe, si es asi lo agrega al carrito o lo suma, si no existe el id del carrito o producto lo informa
export async function agregarProductosArregloCartsByCId(req, res) {
  try {
    /* Forma De Agregar con FS 
    const validarProducto = await managerProducts.getProductById(pId);
    if (validarProducto) {
      await cartsManager.addProductsCartsByCId(cId, pId);
      res.status(200).json({
        status: "success",
        mensaje: `El Producto ${pId} se agrego al carrito con id ${cId}`,
      });
    } else {
      res.status(400).json({
        status: "error",
        mensaje: "Error al agregar el producto , ID invalido",
        
      });  
    }  */

    const cId = req.params.cid;
    const pId = req.params.pid;
    // Buscar el objeto por ID

    await conectar();
    const buscarProduct = await productsMongoose.findOne({ _id: pId });
    const buscarCart = await cartsMongoose.findOne({ _id: cId });
    if (buscarProduct) {
      if (buscarCart) {
        // Verificar si el producto ya existe en el arreglo
        const productoExistente = buscarCart.products.find(
          (p) => p._id === pId
        );

        if (productoExistente) {
          // Si el producto existe, incrementa quantity

          productoExistente.quantity += 1;
        } else {
          // Si el producto no existe, lo agrega al arreglo ,con quantity default en 1
          buscarCart.products.push({ _id: pId });
        }
      } else {
        return res
          .status(404)
          .json({ status: "error", message: "id del carro invalido" });
      }
      // Guardar el objeto actualizado
      await buscarCart.save();
      await desconectar();

      return res.status(201).json(buscarCart);
    } else {
      return res
        .status(404)
        .json({ status: "ERROR", message: "id del producto no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ status: "ERROR", mensaje: error.message });
  }
}

// Devuelve el arreglo de productos del carrito enviado, en caos que no lo encuentre lo devuelve
export async function mostrarListaDeProductosByCId(req, res) {
  try {
    await conectar();
    const cart = await cartsMongoose.findById(req.params.cid).lean();
    await desconectar();
    if (cart) {
      return res.status(200).json(cart.products);
    } else {
      return res
        .status(404)
        .json({ status: "ERROR", message: "Id del carrito no encontrado" });
    }
  } catch (error) {
    await desconectar();
    return res
      .status(404)
      .json({ status: "ERROR", mensaje: "Error en mostrar la lista " });
  }
}

// Envia todos los carritos que esten guardados en la base de datos.
export async function mostrarListaDeCarts(req, res) {
  try {
    await conectar();
    const listaCarrito = await cartsMongoose.find().lean();
    await desconectar();
    res.status(200).json(listaCarrito);
  } catch (error) {
    await desconectar();
    res.status(400).json({ status: "ERROR", message: "Error en la peticion" });
  }
}

//Se borra del arreglo del carrito el producto(pid) enviado
export async function borrarProductoDelCarrito(req, res) {
  try {
    const pid = req.params.pid;
    const cid = req.params.cId;

    await conectar();
    const carritoEncontrar = await cartsMongoose
      .findByIdAndUpdate(
        cid,
        { $pull: { products: { _id: pid } } },
        { new: true }
      )
      .lean();

    await desconectar();
    if (carritoEncontrar) {
      return res.status(200).json(carritoEncontrar);
    } else {
      await desconectar();
      return res
        .status(400)
        .json({ status: "ERROR", message: "error al borrar el producto" });
    }
  } catch (error) {
    await desconectar();
    return res.status(400).json({ status: "ERROR", message: message.error });
  }
}

//Se aumenta el numero de quantity del producto(pid) en el carrito (cid) enviado
export async function actualizarProductoEnElCarrito(req, res) {
  // pensado de la forma que el se envia desde el req.body un json { "quantity" : cantidad a agregar}
  try {
    const cantidad = req.body;
    const pid = req.params.pid;
    const cid = req.params.cId;

    await conectar();
    const carritoActualizar = await cartsMongoose.findById(cid);
    if (carritoActualizar) {
      var element;
      for (let index = 0; index < carritoActualizar.products.length; index++) {
        element = carritoActualizar.products[index];
        if (element._id == pid) {
          element.quantity = element.quantity + cantidad.quantity;
          break;
        }
      }
      if (element._id == pid) {
        await carritoActualizar.save();
        await desconectar();
        return res.status(200).json(carritoActualizar);
      } else {
        await desconectar();
        return res
          .status(400)
          .json({ status: "ERROR", message: "ID producto invalido" });
      }
    } else {
      await desconectar();
      return res
        .status(400)
        .json({ status: "ERROR", message: "ID carts invalido" });
    }
  } catch (error) {
    await desconectar();
    return res.status(400).json({ status: "ERROR", message: error.message });
  }
}

//Se envia un arreglo, y se reemplaza por el actual en el carrito
export async function actualizarCarrito(req, res) {
  try {
    const nuevoArreglo = req.body.docs;
    const cid = req.params.cId;
    await conectar();
    const carrito = await cartsMongoose.findOneAndReplace(
      { _id: cid },
      { products: nuevoArreglo },
      { new: true }
    );
    await desconectar();
    if (carrito) {
      return res.status(200).json(carrito);
    } else {
      return res
        .status(400)
        .json({ status: "ERROR", message: "ID del carrito invalido" });
    }
  } catch (error) {
    await desconectar();
    return res.status(400).json({ status: "ERROR", message: error.message });
  }
}
//Se reemplaza el arreglo de productos en el carrito(cid) indicado por un arreglo vacio
export async function eliminarTodosLosProductosDelCarrito(req, res) {
  try {
    const cid = req.params.cId;
    await conectar();
    const carrito = await cartsMongoose.findOneAndReplace(
      { _id: cid },
      { products: [] },
      { new: true }
    );
    await desconectar();
    if (carrito) {
      return res.status(200).json(carrito);
    } else {
      return res
        .status(400)
        .json({ status: "ERROR", message: "ID del carrito invalido" });
    }
  } catch (error) {
    await desconectar();
    return res.status(400).json({ status: "ERROR", message: error.message });
  }
}
