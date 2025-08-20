import { ILiveLesson } from '@/interfaces/liveLesson';
import mongoose, { Schema } from 'mongoose';

const liveLessonSchema = new Schema<ILiveLesson>(
  {
    title: { type: String },
    category: { type: String },
    lessonDate: { type: Date },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    description: { type: String },
    videoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.LiveLesson || mongoose.model('LiveLesson', liveLessonSchema);
