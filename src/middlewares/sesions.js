import session from "express-session";
import { store } from "./FileStore.js";
export default function (palabraSecreta) {
  return session({
    //  store,
    secret: "palabraSecreta",
    resave: true, //Se mantiene activa en caso que se mantenga inactiva, si se deja en false,la sesion morira en caso que tenga un tiempo de inactividad
    saveUninitialized: true, //permite cuardar cualquier sesion aun cuando el objeto de sesion no tenga nada, si se deja en false, la sesion no se guardara al final de la consulta
  });
}
