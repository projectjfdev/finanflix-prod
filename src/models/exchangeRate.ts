import { IExchangeRate } from "@/interfaces/exchangeRate";
import mongoose from "mongoose";

const exchangeRateSchema = new mongoose.Schema<IExchangeRate>({
  rate: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ExchangeRate ||
  mongoose.model("ExchangeRate", exchangeRateSchema);
