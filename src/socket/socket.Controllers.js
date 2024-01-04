// import { managerProducts } from "../dao/services/productManager.js";

import {
  desconectar,
  conectar,
  productsMongoose,
} from "../dao/services/index.js";
import { messageMongoose } from "../dao/services/index.js";

export function onConnection(socketServer) {
  return async function (socket) {
    console.log("se conectó " + socket.id);
    socket.broadcast.emit("nuevoUsuario", socket.id);
    //forma con FileSystem:
    //   socket.emit("sendProducts", await managerProducts.getProducts());

    //Forma con Mongoose:
    //  socket.emit("sendProducts", await productsMongoose.find().lean());

    socket.on("disconnecting", () => {
      socket.broadcast.emit("usuarioDesconectado", socket.id);
    });
  };
}

export function inyectarSocketServer(socketServer) {
  return function (req, res, next) {
    res["sendProducts"] = async () => {
      // Forma con FileSystem:  socketServer.emit("sendProducts", await managerProducts.getProducts());
      await conectar();
      socketServer.emit("sendProducts", await productsMongoose.find().lean());
      await desconectar();
    };
    next();
  };
}

export function socketMessage(socketServer) {
  return function (req, res, next) {
    try {
      res["sendMessage"] = async () => {
        // Forma con FileSystem:  socketServer.emit("sendProducts", await managerProducts.getProducts());
        await conectar();
        const messages = await messageMongoose.find().lean();
        await desconectar();
        await socketServer.emit("sendMessage", messages);
      };
      next();
    } catch (error) {
      console.log(error.message);
    }
  };
}
