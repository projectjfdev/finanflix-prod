import { IOrder } from '@/interfaces/order';
import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Courses',
      // required: true,
      index: true,
    },
    // DATOS DE LA ORDEN
    price: { type: Number },
    currency: { type: String },
    orderTitle: { type: String },
    status: {
      type: String,
      enum: {
        values: ['Pendiente', 'Cancelado', 'Pagado'],
        message: '{VALUE} no es un status valido',
      },
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    // DATOS DEL COMPRADOR
    termsAndConditions: { type: Boolean },
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
    username: { type: String },
    // DATA EXTRA
    paymentMethod: {
      type: String,
      enum: {
        values: ['Offline', 'Service', 'By Admin'],
        message: '{VALUE} no es un status valido',
      },
    },
    serviceDetail: {
      id: { type: String },
      type: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Orders || mongoose.model('Orders', orderSchema);
