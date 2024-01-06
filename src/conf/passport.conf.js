import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";


import { ussersModel, loginMongoose } from '../dao/models/db/ussersMongoose.js'; 
import {
  GITHUB_CLIENT_SECRET,
  GITHUB_URL_CALLBACK,
  GITHUB_CLIENT_ID,
} from "./config.js";


export const initializePassport = (app) =>{
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
        let usuario = await ussersModel.findOne({ email: profile.username });
        if (!usuario) {
          usuario = await ussersModel.create({
            first_name: profile.username,
            email: profile.username,
          });
        }
        done(null, usuario.toObject());
      }
    )
  );
  
  passport.serializeUser((user, next) => {
    next(null, user);
  });
  
  passport.deserializeUser((user, next) => {
    next(null, user);
  });

  app.use(passport.initialize())
  app.use(passport.session())
  
}


