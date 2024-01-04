import multer from "multer";
import fs from "fs";
import { send } from "process";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export async function changeNameAndId(req, res) {
  try {
    console.log("FILE EN CHANG:");
    console.log(req.file);
    const newPatch = `./public/${req.file.originalname}`;
    fs.renameSync(req.file.path, newPatch);
    res.send("se agrego");
  } catch (error) {
    console.log(error.message);
  }
}

export const upload = multer({ storage });
