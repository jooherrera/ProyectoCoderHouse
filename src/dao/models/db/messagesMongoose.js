import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MessageSchema = new Schema(
  {
    usser: { type: String },
    message: { type: String },
  },
  { collection: "messages" },
  {
    strict: "throw",
    versionKey: false,
    methods: {},
  }
);

export const MessagesManagerMongoose = model("messages", MessageSchema);
