import mongoose from 'mongoose';

export interface ILessons {
  _id: mongoose.Types.ObjectId;
  title: string; // Titulo de la clase
  type: string; // Tipo PDF o Video
  videoUrl?: string; // URL de video (opcional)
  textContent?: string; // PDF (opcional)
  downloadableFile?: string; // Archivo descargable (opcional)
  isFree?: boolean; // Si es gratis o no (opcional)
}

export interface ISection {
  title: string; // Titulo de la sección
  lessons: ILessons[]; // Array de clases dentro de la sección
  // _id: mongoose.Types.ObjectId;
}

export interface ICourse {
  _id: mongoose.Types.ObjectId;
  price: number;
  title: string; // Titulo
  subtitle?: string; // Subtitulo (opcional)
  category?: string; // Categoria (opcional)
  level?: string; // Nivel del curso (select, opcional)
  thumbnail: {
    public_id: string; // ID público de la miniatura
    url: string; // URL de la miniatura
  }; // Miniatura (opcional)
  outOfSale?: boolean; // Si el curso está activo o no (opcional)
  isOnlyForSubscribers?: boolean; // Si el curso está habilitado unicamente para suscriptores
  trailer?: string; // Trailer (opcional)
  description?: string; // Descripcion (opcional)
  isVisibleToSubscribers?: string[];
  orderIndex?: number;
  sections?: ISection[]; // Secciones del curso (opcional)
  welcomeMessage?: string; // Mensaje de bienvenida (opcional)
  completedMessage?: string; // Mensaje de curso terminado (opcional)
  createdAt?: Date; // Fecha de creación (opcional, manejado por Mongoose)
  updatedAt?: Date; // Fecha de actualización (opcional, manejado por Mongoose)
}
