import { ObjectId } from 'mongoose';

export interface IPreferences {
  _id: ObjectId;
  userId: ObjectId;
  specializationArea: string[];
  weeklyAvailability: string;
  cryptoStartDate?: string;
  howDidYouDo?: string;
  principalObjective?: string;
  futureGoalInTwoYears?: string;
  goalInFiveYears?: string;
  availableCapital?: string;
  studyTime?: string;
  experienceInOtherMarkets?: string;
  connectedToDiscord?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
