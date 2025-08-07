import { IBillingDetails } from '@/interfaces/billingDetails';
import mongoose, { Schema } from 'mongoose';

const billingDetailsSchema = new Schema<IBillingDetails>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, match: /\S+@\S+\.\S+/ },
    phone: {
      countryCode: { type: String, required: true, match: /^\+\d{1,4}$/ }, // Ej: +54
      number: { type: String, required: true, match: /^\d{6,15}$/ }, // Ej: 123456789
    },
    country: { type: String },
    address: { type: String },
    postalCode: { type: String, match: /^\d{4,10}$/ },
    dni: { type: String, match: /^\d{6,12}$/ },
  },
  { timestamps: true }
);

export default mongoose.models.BillingDetails ||
  mongoose.model<IBillingDetails>('BillingDetails', billingDetailsSchema);
