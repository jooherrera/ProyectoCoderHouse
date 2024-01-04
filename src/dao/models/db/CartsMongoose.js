import mongoose, { Schema, model } from "mongoose";
import { productsManagerMongoose } from "./ProductsMongoose.js";
import { v4 as uuidv4 } from "uuid";
import mongoosePaginate from "mongoose-paginate-v2";

const CartSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    products: {
      type: [
        {
          _id: { type: String, ref: "products" },
          quantity: { type: Number, min: 1, default: 1 },
        },
      ],
      default: [],
    },
  },
  { collection: "carts" },
  {
    strict: "throw",
    versionKey: false,
  }
);
CartSchema.plugin(mongoosePaginate);
export const cartsManagerMongoose = model("carts", CartSchema);
