import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  price: number;
  image: {
    public_id: string;
    url: string;
  };
  currency?: 'USD' | 'AR';
  orderTitle?: string;
  status: 'Pendiente' | 'Cancelado' | 'Pagado';
  termsAndConditions: boolean;
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
  username: string;
  paymentMethod: 'Offline' | 'Service' | 'By Admin';
  serviceDetail: { id: string; type: string };
  createdAt: Date;
  updatedAt: Date;
}
