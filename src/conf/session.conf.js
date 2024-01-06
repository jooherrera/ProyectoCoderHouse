import session from 'express-session'
import MongoStore from 'connect-mongo'

export const sessionConf = (app,uri) =>{
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: uri,
        mongoOptions: {},
        ttl : 15
      }),
      secret: 'secret',
      resave: false,
      saveUninitialized: false
    })
  )
}