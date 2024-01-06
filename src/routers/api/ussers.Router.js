import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  sesionActual,
  cambiarPass,
} from "../../controllers/ControllersApi/ussers.Constrollers.js";
import { soloLoguedosApi } from "../../controllers/ControllersApi/autorizaciones.Controllers.js";
export const ussersRouter = new Router();

ussersRouter.use((req, res, next) => {
  next();
});
ussersRouter.get("/current", soloLoguedosApi, sesionActual);
ussersRouter.post("/register", register);
ussersRouter.post("/login", login);
ussersRouter.post(
  "/loginPassport",
  passport.authenticate("loginLocal", {
    failWithError: true,
  }),
  async (req, res, next) => {
    res.status(201).json({ status: "success", payload: req.user });
  },
  (error, req, res, next) => {
    res.status(401).json({ status: "error", message: error.message });
  }
);

ussersRouter.delete("/", logout);
ussersRouter.put("/cambiarPassword", cambiarPass);
