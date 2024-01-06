import { strict } from "assert";
import mongoose, { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
import { hasheadasSonIguales } from "../../services/crypt.js";
import { conectar, ussersMongoose } from "../../services/index.js";
const UssersManager = new Schema(
  {
    _id: { type: String, default: randomUUID },
    email: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    age: { type: Number },
    password: { type: String, required: true, default: "(NO ES NECESARIO)" },
  },
  {
    strict: "throw",
    versionKey: false,
    static: {},
  }
);

export const ussersModel = mongoose.model("usuarios", UssersManager);

export async function loginMongoose(email, password) {
  let datosUsuario;

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    datosUsuario = {
      email: "admin",
      first_name: "admin",
      last_name: "admin",
      rol: "admin",
    };
  } else {
    await conectar();
    const usuario = await ussersMongoose.findOne({ email }).lean();

    if (!usuario) {
      throw new Error("login failed");
    }

    if (!hasheadasSonIguales(password, usuario["password"])) {
      throw new Error("login failed");
    }

    datosUsuario = {
      email: usuario["email"],
      first_name: usuario["first_name"],
      last_name: usuario["last_name"],
      rol: "usuario",
    };
  }
  return datosUsuario;
}
