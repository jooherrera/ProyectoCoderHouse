import createFileStoreClass from "session-file-store";
import session from "express-session";
const FileStore = createFileStoreClass(session);

export const store = new FileStore({
  path: "./sesiones",
  // ttl: 3600 , tiempo de vida que va a estar en SEGUNDOS por default se queda en una horano
  // retries 5  ,  en caso que no pueda escribir, cuantas veces va a intentar
});
