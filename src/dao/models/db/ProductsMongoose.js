import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import mongoosePaginate from "mongoose-paginate-v2";

const productoSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    code: { type: Number, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    thumbnail: { type: String },
    title: { type: String, default: "Sin Titulo" },
  },
  { collection: "products" },
  {
    strict: "throw",
    versionKey: false,
    methods: {
      addProductMongoose: function (newProduct) {
        if (!this.productos.includes(pID)) {
          this.productos.push(pID);
        }
      },
    },
  }
);
productoSchema.plugin(mongoosePaginate);
export const productsManagerMongoose = model("products", productoSchema);
