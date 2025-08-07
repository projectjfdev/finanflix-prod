import mongoose, { Document } from "mongoose";

interface SuscriptionType {
  basic: number;
  icon: number;
  diamond: number;
}

export interface ISubscriptionPlan extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // Ej: 'Mensual', 'Trimestral'
  price: SuscriptionType;
  frequencyType: "mensual" | "trimestral" | "semestral" | "anual"; // Frecuencia del plan
  frequency: number;
  features: string[]; // Lista de características
  offerMessage?: string;
  createdAt: string;
  updatedAt: string;
}
