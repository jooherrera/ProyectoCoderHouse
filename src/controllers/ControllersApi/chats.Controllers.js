import {
  conectar,
  desconectar,
  messageMongoose,
} from "../../dao/services/index.js";

export async function saveAndSend(req, res) {
  try {
    await conectar();
    const mensaje = await messageMongoose.create(req.body);
    await desconectar();
    res["sendMessage"]();
    res.status(200);
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
}
