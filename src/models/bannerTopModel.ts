import { IBannerTop } from "@/interfaces/bannerTop";
import mongoose, { Schema } from "mongoose";
// asda
const bannerTopSchema = new Schema<IBannerTop>(
  {
    title: { type: String },
    description: { type: String },
    redirect: { type: String },
    cta: { type: String },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean },
    clickeable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.BannerTop ||
  mongoose.model("BannerTop", bannerTopSchema);
