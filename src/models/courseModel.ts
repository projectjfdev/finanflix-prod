import { ICourse } from '@/interfaces/course';
import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema<ICourse>(
  {
    // Page1: Información básica
    title: { type: String }, // Titulo
    subtitle: { type: String }, // Subtitulo
    // category: { type: Schema.Types.ObjectId, ref: "Categories" }, // Categoria
    category: { type: String, index: true }, // Categoria
    level: { type: String }, // Nivel del curso (select)
    // Page2: Info avanzada
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    }, // Miniatura
    trailer: { type: String }, // Trailer
    description: { type: String }, // Descripcion
    // Page3: Crear secciones y clases
    sections: [
      {
        title: { type: String, required: true }, // Titulo de la sección
        lessons: [
          {
            _id: { type: Schema.Types.ObjectId, auto: true },
            title: { type: String, required: true }, // Titulo de la clase
            type: { type: String },
            videoUrl: { type: String }, // URL de video
            textContent: { type: String }, // URL de pdf
            downloadableFile: { type: String }, // para que venga desde google drive
            isFree: { type: Boolean }, // Si es gratis o no
          },
        ],
      },
    ],
    isVisibleToSubscribers: [{ type: String }],
    orderIndex: { type: Number },
    // Page4: Publicar curso
    outOfSale: { type: Boolean, default: false }, // Si el curso está activo o no
    isOnlyForSubscribers: { type: Boolean, default: false }, // Si el curso está habilitado unicamente para suscriptores
    price: { type: Number },
    welcomeMessage: { type: String }, // Mensaje de bienvenida
    completedMessage: { type: String }, // Mensaje de curso terminado
  },
  { timestamps: true }
);

export default mongoose.models?.Course || mongoose.model('Course', courseSchema);
