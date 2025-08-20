import mongoose from "mongoose";

export interface IBillingDetails extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    countryCode: string; // Código de país (Ej: +54)
    number: string; // Teléfono
  };
  country: string;
  address: string;
  postalCode: string;
  dni: string;
  createdAt: Date;
  updatedAt: Date;
}
