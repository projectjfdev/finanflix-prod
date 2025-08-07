// import { ISubscriptionPlan } from '@/interfaces/subscriptionPlan';
// import mongoose, { Schema } from 'mongoose';

// const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
//   {
//     name: { type: String, required: true }, // Ej: 'Mensual', 'Trimestral'
//     price: {
//       basic: { type: Number },
//       icon: { type: Number },
//       diamond: { type: Number },
//     },
//     frequencyType: {
//       type: String,
//       enum: ['mensual', 'trimestral', 'semestral', 'anual'],
//       required: true,
//     },
//     frequency: { type: Number }, // Se calculará automáticamente
//     features: [{ type: String }], // Lista de características
//     offerMessage: { type: String }, // Mensaje de oferta opcional tipo: ¡Paga un año al precio de 9 meses!
//   },
//   { timestamps: true }
// );

// // Middleware pre-save para calcular `frequency`
// subscriptionPlanSchema.pre('save', function (next) {
//   const frequencyMapping: { [key: string]: number } = {
//     mensual: 1,
//     trimestral: 3,
//     semestral: 6,
//     anual: 12,
//   };

//   // Asegurar que `frequencyType` tiene un valor válido
//   if (this.frequencyType) {
//     this.frequency = frequencyMapping[this.frequencyType];
//   }

//   next();
// });

// export default mongoose.models.SubscriptionPlan ||
//   mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

import { ISubscriptionPlan } from '@/interfaces/subscriptionPlan';
import mongoose, { Schema } from 'mongoose';

// Mapeo de frecuencia
const frequencyMapping: Record<string, number> = {
  mensual: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true },

    price: {
      basic: { type: Number, required: true },
      icon: { type: Number, required: true },
      diamond: { type: Number, required: true },
    },

    frequencyType: {
      type: String,
      enum: Object.keys(frequencyMapping), // Solo valores válidos
      required: true,
    },

    frequency: { type: Number }, // Se calculará automáticamente antes de guardar

    features: [{ type: String }],
    offerMessage: { type: String },
  },

  { timestamps: true }
);

// Middleware pre-save para calcular `frequency`
subscriptionPlanSchema.pre('save', function (next) {
  this.frequency = frequencyMapping[this.frequencyType] || 0;
  next();
});

export default mongoose.models.SubscriptionPlan ||
  mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
