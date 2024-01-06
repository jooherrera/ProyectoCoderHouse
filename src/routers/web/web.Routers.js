import { Router } from "express";
import passport from "passport";
import {
  realTimeProductsWeb,
  logginUsser,
  chatHandlebars,
  mostrarProducto,
  mostrarLogin,
  verPerfil,
  mostrarProductosCarrito,
  ventanaRegister,
  restartPassword,
  homeWeb,
} from "../../controllers/ControllersWeb/web.Constrollers.js";

export const webRouter = new Router();

//Renderiza la pagina de RealTimeHandlebars
webRouter.get("/realTimeProducts", realTimeProductsWeb);

//Renreriza la ventana de chatHandlebars
webRouter.get("/chatHandlebars", chatHandlebars);

//Muestra ventana de registro.handlebars
webRouter.get("/register", ventanaRegister);

//Logearse con GitHub
webRouter.get("/githublogin", passport.authenticate("loginGithub"));

webRouter.get(
  "/githubcallback",
  passport.authenticate("loginGithub", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
//////Muestra ventana de Login.handlebars
webRouter.get("/login", mostrarLogin);

//////Muestra ventana de Login.handlebars
webRouter.get("/perfil", verPerfil);

//Chequea que el usser y el password enviados en el boddy esten en la base de datos de mongo
webRouter.get("/logginUsser", logginUsser);

webRouter.get("/restartpassword", restartPassword);

//Muestra los productos con paginate con Handlebars

webRouter.get("/", homeWeb);

//Muestra Productos con Paginate con HandleBars
webRouter.get("/products", homeWeb);

//descripcion del producto
webRouter.get("/:pid", mostrarProducto);

// visualizar solo un carrito especifico
webRouter.get("/carts/:cid", mostrarProductosCarrito);
