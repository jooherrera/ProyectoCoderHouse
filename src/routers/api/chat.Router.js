import { Router } from "express";
import { saveAndSend } from "../../controllers/ControllersApi/chats.Controllers.js";
export const chatRouter = new Router();

chatRouter.post("/", saveAndSend);
