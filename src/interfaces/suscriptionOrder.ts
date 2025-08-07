import { Document, Types } from 'mongoose';

interface ImageData {
  public_id?: string;
  url?: string;
}

interface ServiceDetail {
  id?: string; // ID de la orden de Mercado Pago
  type?: string;
}

export interface SuscriptionOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // id del comprador
  suscriptionId: Types.ObjectId; // id de la suscripcion
  // Datos de la orden
  price?: number;
  currency?: 'USD' | 'AR';
  orderTitle?: string;
  status?: 'Pendiente' | 'Cancelado' | 'Pagado';
  image?: ImageData;
  // Datos del comprador
  termsAndConditions?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  tel?: string;
  username?: string;
  // Data extra
  paymentMethod?: 'Offline' | 'Service' | 'By Admin';
  serviceDetail?: ServiceDetail;
  // Propiedades generadas automáticamente por Mongoose
  createdAt?: Date;
  updatedAt?: Date;
}
