import mongoose, { Document, ObjectId } from 'mongoose';

interface ProfileImage {
  public_id: string;
  url: string;
}

export interface Suscription {
  type: string;
  isActive: boolean;
  orderDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired' | 'unpaid';
}

interface PreferencesProps {
  cryptoStartDate: Date;
  // favoriteAssets: string;
  // portfolioSize: string;
  riskLevel: string;
  experienceInOtherMarkets: string;
  topicsOfInterest: string[];
}

// Se agregaron 3 propiedades nuevas fundamentales para la funcionalidad de Discord, discordId, discordConnected, discordConnectedAt

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: ProfileImage;
  tel?: string;
  coursesToClaim?: string[];
  suscriptionCourses?: string[];
  enrolledCourses?: ObjectId[];
  suscription: Suscription;
  preferences: PreferencesProps;
  status: 'Activo' | 'Inactivo' | 'Bloqueado';
  verified: boolean;
  createdAt?: Date;
  orders?: string[];
  discordId?: string;
  discordConnected?: boolean;
  discordConnectedAt?: Date;
}
