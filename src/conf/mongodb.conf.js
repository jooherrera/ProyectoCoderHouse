import mongoose from 'mongoose'

export const mongoConf = (uri) =>{
  mongoose.connect(uri)
  .then(()=> console.log("Conectado a MongoDB"))
  .catch(()=> console.log("Error al conectar: ", error))
}