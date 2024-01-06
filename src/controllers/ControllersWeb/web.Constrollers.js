// import { managerProducts } from "../../dao/models/fs/productManager.js";

import { cartsMongoose } from "../../dao/services/index.js";
import {
  productsMongoose,
  ussersMongoose,
  messageMongoose,
} from "../../dao/services/index.js";

import { emailAdmin } from "../../conf/config.js";

export async function realTimeProductsWeb(req, res) {
  return res.status(200).render("realTimeProducts.handlebars", {
    titulo: " realTimeProductsWeb",
    usser: req.session["usser"],
  });
}
//Muestra la pagina principal con los productos paginados
export async function homeWeb(req, res) {
  try {
    const opcionesDePaginacion = {
      // Objeto con las opciones de paginacion enviados por query
      limit: req.query.limit || 10, //muestra un limite de productos paginados, si no se envia se pone en 10
      page: req.query.page || 1, //cantidad de paginas , se pone en 1 si no se envian paginas
      lean: true, // se muestran los objetos
    };
    const criterioBusqueda = {};

    if (req.query.sort) {
      //en el caso que se envie un query.sort se ordenaran los productos
      opcionesDePaginacion.sort = {
        price: req.query.sort === "desc" ? -1 : 1,
      };
    }
    if (req.query.query) {
    }
    const productos = await productsMongoose.paginate(
      //se agrega la paginacion con un criterio de busqueda  y opciones de paginacion
      criterioBusqueda,
      opcionesDePaginacion
    );

    return res.status(200).render("home.handlebars", {
      titulo: "Home",
      status: "sucess",
      payload: productos.docs, // productos enviados como arreglo
      totalPages: productos.totalPages, //total paginas
      prevPage: productos.prevPage, // link a la pagina siguiente
      nextPage: productos.nextPage, // link a la pagina anterior
      page: productos.page, //pagina actual
      hasPrevPage: productos.hasPrevPage, //si existe pagina anterior
      hasNextPage: productos.hasNextPage, //si existe pagina siguiente
      hayDocs: productos.docs > 0, //si docs es mayor a 0 los envia
      prevLink: productos.prevLink,
      usser: req.user, //envia el usser conectado con fist_name , last_name , y isAdmin
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}

// se conecta a base de datos de chats y y los muestra
export async function chatHandlebars(req, res) {
  try {
    const mensajes = await messageMongoose.find().lean(); //busca los chats y los convierte en objects con lean
    if (mensajes) {
      //si los encuentra , llama a la funcion del socket res["sendMessage"] para mostrar a todos los mensajes
      res["sendMessage"]();
      return res.status(200).render("chat.handlebars", {
        status: "success",
        payload: req.session["usser"],
      });
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Sin Mensajes para mostrar" });
    }
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
}

export async function logginUsser(req, res) {
  try {
    if (!req.session["usser"]) {
      const usser = req.query.usser;
      const pass = req.query.password;
      const isValid = await ussersMongoose
        .findOne({ email: usser, password: pass })
        .lean();
      console.log(isValid);
      if (!isValid) {
        return res
          .status(400)
          .json({ status: "error", message: "Usuario No Encontrado" });
      }
      req.session["usser"] = {
        first_name: isValid.first_name,
        last_name: isValid.last_name,
      };
      if (isValid.email === emailAdmin) {
        req.session["usser"].isAdmin = true;
      } else {
        req.session["usser"].isAdmin = false;
      }
      return res.status(200).json(isValid);
    } else {
      return res
        .status(200)
        .json({ status: "success", usser: req.session["usser"] });
    }
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
}

export async function mostrarProducto(req, res) {
  try {
    const pid = req.params.pid;

    const producto = await productsMongoose.findById(pid).lean();

    return res.status(200).render("product.handlebars", { producto });
  } catch (error) {
    return res.status(400).json({ status: "ERROR", message: error.message });
  }
}

export async function mostrarProductosCarrito(req, res) {
  try {
    const cid = req.params.cid;

    const carrito = await cartsMongoose.findById(cid).lean();

    if (carrito) {
      res
        .status(200)
        .render("carrito.handlebars", { products: carrito.products });
    } else
      res
        .status(400)
        .json({ status: "ERROR", message: "Id del carrito invalido" });
  } catch (error) {
    res.status(400).json({ status: "ERROR", message: error.message });
  }
}

export async function ventanaRegister(req, res) {
  try {
    res.status(200).render("register.handlebars", { status: "success" });
  } catch (error) {
    res.status(400).render("register.handlebars", { status: "error" });
  }
}

export async function mostrarLogin(req, res) {
  res.status(200).render("login.handlebars", { statuss: "sucess" });
}

export async function verPerfil(req, res) {
  if (req.user) {
    res.status(201).render("perfil.handlebars", {
      status: "success",
      payload: req.user,
    });
  } else {
    res.status(201).render("perfil.handlebars", {
      status: "error",
    });
  }
}

export async function restartPassword(req, res) {
  res.render("restartPassword.handlebars");
}
