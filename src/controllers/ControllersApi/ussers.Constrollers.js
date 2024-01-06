import { ussersMongoose } from "../../dao/services/index.js";
import { hashear, hasheadasSonIguales } from "../../dao/services/crypt.js";
import { emailAdmin } from "../../conf/config.js";

//Se guarda en la base de datos el usuario enviado desde register.handlebars
export async function register(req, res) {
  try {
    req.body.password = hashear(req.body.password);
    const reg = await ussersMongoose.create(req.body);

    if (reg) {
      req.session["usser"] = {
        email: reg.email,
        first_name: reg.first_name,
        last_name: reg.last_name,
        //si Existe se guarda el nombre en req.session
      };
    }
    return res
      .status(204)
      .json({ status: "sucess", payload: req.session["usser"] });

    //con cookies
    /*res.cookie(
        "usserLogin", //nombre de la cookie
        req.session["usser"], //contenido de la cookie
        {
          signed: true, //firma digital, el mensaje no sera adulterado
          maxAge: 120_000, //tiempo que vivira la cookie
        }
      );*/ // se guarda en la cookie la informacion del usuario por 2 minutos
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
}
// si existe el nobmre y usuario enviado desde el formulario de login , se guarda en res.session y en req.cookie
export async function login(req, res) {
  try {
    const usserFind = await ussersMongoose.findOne(req.body).lean();

    if (!usserFind) {
      return res
        .status(400)
        .json({ status: "error", message: "Usuario No Encontrado" });
    }

    req.session["usser"] = {
      email: usserFind.email,
      first_name: usserFind.first_name,
      last_name: usserFind.last_name,
    };
    if (usserFind.email === emailAdmin) {
      //verifica si es admin
      req.session["usser"].isAdmin = true;
    } else {
      req.session["usser"].isAdmin = false;
    }

    return res.status(200).json({
      status: "success",
      payload: req.session["usser"],
    });
  } catch (error) {
    return res.status(200).json({ status: "error", message: error.message });
  }
}
//elimina la sesion y la cookie luego de darle al boton desconectar en perfil.handlebars
export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: "logout error", body: err });
    }
    res.status(204).json({ status: "success", message: "logout OK" });
  });
  /* FORMA CON SESIONES COOKIES 
 req.session.destroy((err) => {
    res.clearCookie("usserLogin");
    res.status(204).json({ status: "sucess" }); 
  });*/
}

export async function sesionActual(req, res) {
  try {
    res.json({ status: "success", payload: req.user });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
}

export async function cambiarPass(req, res) {
  try {
    req.body.password = hashear(req.body.password);
    const actualizado = await ussersMongoose.updateOne(
      { email: req.body.email },
      { $set: { password: req.body.password } },
      { new: true }
    );

    if (!actualizado) {
      return res
        .status(404)
        .json({ status: "error", message: "usuario no encontrado" });
    }
    res.json({ status: "success", payload: actualizado });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
}
