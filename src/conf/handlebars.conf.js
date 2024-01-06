import {engine} from "express-handlebars"

export const handlebarsConf = (app) =>{
  app.engine("handlebars", engine())
  app.set('view engine', 'handlebars')
  app.set('views', './src/views')
}