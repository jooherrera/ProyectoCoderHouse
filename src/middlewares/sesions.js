//import session from "express-session";
//import { store } from "./FileStore.js";

import createFileStoreClass from "session-file-store";
import session from "express-session";
const FileStore = createFileStoreClass(session);

export const store = new FileStore({
  path: "./sesiones",
  // ttl: 3600 , tiempo de vida que va a estar en SEGUNDOS por default se queda en una horano
  // retries 5  ,  en caso que no pueda escribir, cuantas veces va a intentar
});

export default function (palabraSecreta) {
  return session({
    store, // toma el valor por defecto ,
    secret: "palabraSecreta",
    resave: true, //Se mantiene activa en caso que se mantenga inactiva, si se deja en false,la sesion morira en caso que tenga un tiempo de inactividad
    saveUninitialized: true, //permite cuardar cualquier sesion aun cuando el objeto de sesion no tenga nada, si se deja en false, la sesion no se guardara al final de la consulta
  });
}
