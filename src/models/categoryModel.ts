import { ICategory } from "@/interfaces/category";
import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Categories ||
  mongoose.model<ICategory>("Categories", categorySchema);
