import { IPreferences } from '@/interfaces/preferences';
import mongoose, { Schema } from 'mongoose';

const PreferencesSchema = new Schema<IPreferences>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    specializationArea: [{ type: String, default: '' }],
    weeklyAvailability: { type: String, default: '' },
    cryptoStartDate: { type: String },
    futureGoalInTwoYears: { type: String },
    goalInFiveYears: { type: String },
    availableCapital: { type: String },
    howDidYouDo: { type: String },
    principalObjective: { type: String },
    studyTime: { type: String },
    experienceInOtherMarkets: { type: String },
    connectedToDiscord: { type: Boolean },
  },
  { timestamps: true }
);

const Preferences = mongoose.models.Preferences || mongoose.model('Preferences', PreferencesSchema);

export default Preferences;
