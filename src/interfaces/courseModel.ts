import mongoose from "mongoose";

export interface IUserCourse {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Referencia al ID de usuario
  courseId: mongoose.Types.ObjectId; // Referencia al ID del curso
  progress: IProgress[]; // Progreso en el curso
  enrollmentDate?: Date; // Fecha de inscripción (opcional porque tiene un valor predeterminado)
}

interface IProgress {
  sectionId: string; // Referencia a la sección específica del curso
  lessons: ILesson[]; // Lista de clases dentro de la sección
}

export interface ILesson {
  lessonId: string; // Referencia a la clase dentro de la sección
  isViewed: IViewedStatus; // Estado de visualización de la clase
}

interface IViewedStatus {
  status: boolean; // Estado de visualización (true o false)
  viewedAt?: Date; // Fecha de visualización (opcional)
}
