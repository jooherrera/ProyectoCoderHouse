import mongoose from "mongoose";
import { URL_MONGO } from "./config.js";

export async function conectar() {
  await mongoose.connect(URL_MONGO);
}

export async function desconectar() {
  await mongoose.disconnect();
}

export { productsManagerMongoose as productsMongoose } from "../models/db/ProductsMongoose.js";
export { cartsManagerMongoose as cartsMongoose } from "../models/db/CartsMongoose.js";
export { MessagesManagerMongoose as messageMongoose } from "../models/db/messagesMongoose.js";
export { ussersModel as ussersMongoose } from "../models/db/ussersMongoose.js";
