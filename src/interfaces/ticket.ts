import { ObjectId } from "mongoose";

interface IMessage {
  senderId: ObjectId; // ID del remitente
  senderName: string; // Nombre del remitente
  message: string; // Contenido del mensaje
  timestamp: Date; // Fecha y hora del mensaje
}

export interface ITicket {
  _id: ObjectId;
  userId: ObjectId; // ID del usuario asociado al ticket
  title: string; // Título del ticket
  description: string; // Descripción del ticket
  category: string; // Categoría del ticket
  priority: number; // Prioridad del ticket
  progress: number; // Progreso (en porcentaje u otro criterio)
  status: "Pendiente" | "En revisión" | "Solucionado"; // Estado del ticket
  active: boolean; // Indica si el ticket está activo
  messages: IMessage[]; // Lista de mensajes relacionados con el ticket
  createdAt?: Date; // Fecha de creación (añadida automáticamente por Mongoose)
  updatedAt?: Date; // Fecha de última actualización (añadida automáticamente por Mongoose)
}
