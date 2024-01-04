import mongoose from "mongoose";
import { productsMongoose } from "./dao/services/index.js";

const p = await productsMongoose.find().lean();
console.log(p);
/*
await productsMongoose.create({
  title: "rock",
  description: "osososo",
  price: 1,
  thumbnail: "gg",
  code: 3,
  stock: 1,
});

console.log("QUIEBRE ");

const d = await productsMongoose.find().lean();
console.log(d);
*/
mongoose.disconnect();
