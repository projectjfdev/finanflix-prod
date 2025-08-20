import { IUserCourse } from '@/interfaces/courseModel';
import mongoose, { Schema } from 'mongoose';

const userCourseSchema = new Schema<IUserCourse>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    index: true,
  }, // índice para búsquedas eficientes
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Courses',
    required: true,
    index: true,
  }, // índice
  progress: [
    {
      sectionId: { type: Schema.Types.ObjectId, required: true }, // Referencia a la sección específica del curso
      lessons: [
        {
          lessonId: { type: Schema.Types.ObjectId, required: true }, // Referencia a la clase dentro de la sección
          isViewed: {
            status: { type: Boolean, default: false }, // Estado de visualización de la clase
            viewedAt: { type: Date }, // Fecha de visualización
          },
        },
      ],
    },
  ],
  enrollmentDate: { type: Date, default: Date.now }, // Fecha de inscripción al curso
});

// Esto crea un único índice que indexa la combinación de ambos campos, en ese orden.
// userCourseSchema.index({ userId: 1, courseId: 1 })

const UserCourse = mongoose.models.UserCourse || mongoose.model('UserCourse', userCourseSchema);

export default UserCourse;
