import express from "express";
import { webRouter } from "./routers/web/web.Routers.js";
import { apiRouter } from "./routers//api/api.Routers.js";
import { Server } from "socket.io";
import {
  onConnection,
  inyectarSocketServer,
  socketMessage,
} from "./socket/socket.Controllers.js";
import { PORT, URL_MONGO } from "./conf/config.js";
import cookieParser from "cookie-parser";
import { sessionConf } from './conf/session.conf.js';
import { mongoConf } from './conf/mongodb.conf.js';
import { initializePassport } from './conf/passport.conf.js';
import { handlebarsConf } from './conf/handlebars.conf.js';


const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(express.static("./public")); 
app.use(express.static("./views"));
app.use("/static", express.static("./static"));


handlebarsConf(app)//Motor de plantillas : Handlebars
app.use(cookieParser()); //para usar cookies luego de instalar npm install express cookie-parser
mongoConf(URL_MONGO) // conexion a base de datos
sessionConf(app,URL_MONGO)//Se cambia por mongo-session
initializePassport(app) //cargo los middlewares de passport

const server = app.listen(PORT, () => {
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
