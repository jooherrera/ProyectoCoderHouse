import express from "express";
import handlebars from "express-handlebars";
import { webRouter } from "./routers/web/web.Routers.js";
import { apiRouter } from "./routers//api/api.Routers.js";
import { Server } from "socket.io";
import {
  onConnection,
  inyectarSocketServer,
  socketMessage,
} from "./socket/socket.Controllers.js";
import { PORT } from "./dao/services/config.js";
import cookieParser from "cookie-parser";
import session from "./middlewares/sesions.js";
import {
  passportInitialize,
  passportSession,
} from "./controllers/ControllersApi/autenticaciones.Controllers.js";
const app = express();

//Motor de plantillas : Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./views");

//Middlewares necesarias
app.use(express.json()); //Poder leer los JSON en las peticiones
app.use(express.urlencoded({ extended: true })); //Poder leer formularios
app.use(express.static("./public")); //Indicar las carpetas donde estan las vistas y las imagenes guardadas
app.use(express.static("./views"));
app.use("/static", express.static("./static"));
app.use(session("palabraSecreta")); // agrega el middleware session para usar express -session
app.use(cookieParser()); //para usar cookies luego de instalar npm install express cookie-parser
app.use(passportInitialize, passportSession); //cargo los middlewares de passport
//Se pone a escuchar en el puerto
const server = app.listen(PORT, () => {
  //Se levanta el servidor y se pone a escuchar en el puerto PORT
  console.log("Conectado al puerto 8080");
});

//Se crea el webSocketServer se le hace un new del server que se esta escuchando, ademas se le agrega el onConnection que esta modularizado en el archivo socket.Controller.js en la carpeta socket
export const webSocketServer = new Server(server);
webSocketServer.on("connection", onConnection(webSocketServer)); //Cuando alguien se conecta, se envia la funcion onConnection en socket.Controllers

//Carga de Routers Api,Web y la funcion del socket para devolver los productos
app.use(inyectarSocketServer(webSocketServer));
app.use(socketMessage(webSocketServer));
//Se agregan las apis a las rutas
app.use("/api", apiRouter);
app.use("/", webRouter);
