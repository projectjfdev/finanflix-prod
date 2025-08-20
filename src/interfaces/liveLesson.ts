import mongoose from "mongoose";

export interface ILiveLesson {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  lessonDate?: Date;
  thumbnail: {
    public_id: string;
    url: string;
  };
  description: string;
  videoUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
