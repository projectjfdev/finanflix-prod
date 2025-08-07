import mongoose, { Document } from "mongoose";

export interface IExchangeRate extends Document {
  _id: mongoose.Types.ObjectId;
  rate: number;
  updatedAt: Date;
}
