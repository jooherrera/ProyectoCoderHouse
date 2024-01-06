import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { conectar, ussersMongoose } from "../../dao/services/index.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import {
  GITHUB_CLIENT_SECRET,
  GITHUB_URL_CALLBACK,
  GITHUB_CLIENT_ID,
} from "../../dao/services/config.js";
import { hasheadasSonIguales } from "../../dao/services/crypt.js";
import { loginMongoose } from "../../dao/models/db/ussersMongoose.js";

passport.use(
  "loginLocal",
  new LocalStrategy(
    {
      usernameField: "email",
    }, //cambia el ussernameField por email
    async function verificarUsuario(username, password, done) {
      //por defecto busca el email y passport del req.body
      try {
        const usserLogin = await loginMongoose(username, password);
        done(null, usserLogin);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "loginGithub",
  new GitHubStrategy(
    {
      //Informacion sacada de Github al momento de
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_URL_CALLBACK,
    },
    async (__, ___, profile, done) => {
      await conectar();
      let usuario = await ussersMongoose.findOne({ email: profile.username });
      if (!usuario) {
        usuario = await ussersMongoose.create({
          first_name: profile.username,
          email: profile.username,
        });
      }
      done(null, usuario.toObject());
    }
  )
);

//estrategia que va a usar passport en loginlocal que voy a usar en los middlewares con passport.authenticate
passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((user, next) => {
  next(null, user);
});

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
