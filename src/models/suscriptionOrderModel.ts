import mongoose, { Schema } from 'mongoose';

const suscriptionOrderSchema = new Schema<any>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    suscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      // required: false,
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
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
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
      id: { type: String }, // id de la orden de mercado pago
      type: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SuscriptionOrders ||
  mongoose.model('SuscriptionOrders', suscriptionOrderSchema);
