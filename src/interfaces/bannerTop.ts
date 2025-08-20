import mongoose, { Document } from "mongoose";

export interface IBannerTop extends Document {
  _id: mongoose.Types.ObjectId;
  title?: string;
  description?: string;
  redirect?: string;
  cta?: string;
  image: {
    public_id?: string;
    url?: string;
  };
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  clickeable: boolean; 
  createdAt: Date;
  updatedAt: Date;
}
