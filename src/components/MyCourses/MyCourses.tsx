import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/dbConfig';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import userModel from '@/models/userModel';
import courseModel from '@/models/courseModel';
import UserCourse from '@/models/userCourseModel';
import type { ISection } from '@/interfaces/course';
import type { ILesson } from '@/interfaces/courseModel';
import type { INextLesson } from '@/interfaces/next-lessons';
import type { ObjectId } from 'mongoose';
import { redirect } from 'next/navigation';
import { ClientCertificateButton } from '@/components/ClientCertificateBtn/ClientCertificateButton';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { Progress } from '@/components/ui/progress';
import { Separator } from '../ui/separator';

interface IUserWithCourses {
  _id: string;
  email: string;
  enrolledCourses: ObjectId[];
}

async function getCoursesData() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user: IUserWithCourses = await userModel.findOne({ email: session.user.email }).populate({
    path: 'enrolledCourses',
    select: 'thumbnail title subtitle',
    model: courseModel,
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Obtener progreso del usuario en los cursos
  const userCoursesProgress = await UserCourse.find({
    userId: user._id,
    courseId: {
      $in: user.enrolledCourses.map((course: any) => course._id),
    },
  }).lean();

  const coursesWithProgress = await Promise.all(
    user.enrolledCourses.map(async (course: any) => {
      const userCourse = userCoursesProgress.find(
        (uc: any) => String(uc.courseId) === String(course._id)
      );

      if (!userCourse) {
        // If there's no progress, return basic course info
        return {
          courseId: course._id,
          title: course.title,
          subtitle: course.subtitle,
          thumbnail: course.thumbnail,
          totalLessons: 0,
          lessonsCompleted: 0,
          nextLesson: null,
        };
      }

      // Calcular total de lecciones y lecciones completadas
      const totalLessons = userCourse.progress.reduce(
        (total: number, section: ISection) => total + section.lessons.length,
        0
      );

      const lessonsCompleted = userCourse.progress.reduce(
        (completed: number, section: any) =>
          completed + section.lessons.filter((lesson: any) => lesson.isViewed.status).length,
        0
      );

      // Obtener la primera lección no vista o la última lección si todas están vistas
      let nextLesson: INextLesson | null = null;
      const lastLesson: INextLesson | null = null;

      for (const section of userCourse.progress) {
        const lesson = section.lessons.find((lesson: ILesson) => !lesson.isViewed.status);
        if (lesson) {
          // Recuperar datos de la lección desde el modelo courseModel
          const courseData: any = await courseModel.findById(course._id).lean();
          const sectionData = courseData?.sections.find(
            (sec: any) => String(sec._id) === String(section.sectionId)
          );
          const lessonData = sectionData?.lessons.find(
            (les: any) => String(les._id) === String(lesson.lessonId)
          );

          if (lessonData) {
            nextLesson = {
              sectionId: section.sectionId,
              ...lessonData,
            };
            break;
          }
        }
      }

      // Si todas las lecciones están vistas, usar la última lección
      if (!nextLesson) {
        nextLesson = lastLesson;
      }

      // Recuperar datos de la lección desde el modelo courseModel
      if (nextLesson) {
        const courseData: any = await courseModel.findById(course._id).lean();
        const sectionData = courseData?.sections.find(
          (sec: any) => String(sec._id) === String(nextLesson?.sectionId)
        );
        const lessonData = sectionData?.lessons.find(
          (les: any) => String(les._id) === String(nextLesson?.lessonId)
        );

        if (lessonData) {
          nextLesson = {
            sectionId: nextLesson.sectionId,
            ...lessonData,
          };
        }
      }

      return {
        courseId: course._id,
        title: course.title,
        subtitle: course.subtitle,
        thumbnail: course.thumbnail,
        totalLessons,
        lessonsCompleted,
        nextLesson,
      };
    })
  );
  // Filtrar los cursos nulos
  return coursesWithProgress.filter(course => course !== null);
}

export default async function MyCourses() {
  const session = await getServerSession(authOptions);
  const myEnrolledCourses = await getCoursesData();

  if (!myEnrolledCourses || myEnrolledCourses.length === 0) {
    return null;
  }

  return (
    <div className="mb-9 dark:bg-background rounded-lg">
      <div className="overflow-hidden h-full">
        <MediumTitle title="Cursos de acceso permanente" className="mb-3 md:mt-7 text-[22px] md:text-[26px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-9 sm:gap-9">
          {myEnrolledCourses && myEnrolledCourses.length > 0
            ? myEnrolledCourses.map(course => (

              <Card
                key={course.courseId}
                className="w-full max-w-md flex flex-col flex-shrink-0 overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg snap-start bg-white dark:bg-card"
              >
                <CardHeader className="relative p-0">
                  <div className="relative w-full aspect-video">
                    {course.lessonsCompleted === course.totalLessons && (
                      <div className="absolute inset-0 z-10 rounded-t-xl bg-black/50" />
                    )}

                    <Image
                      src={course.thumbnail.url || 'imagen de curso finanflix'}
                      alt="Curso"
                      fill
                      priority
                      className="object-cover object-center rounded-t-xl "
                    />
                  </div>

                  {course.lessonsCompleted === course.totalLessons && (
                    <div className="absolute inset-x-4 top-4 z-20">
                      <ClientCertificateButton courseId={course.courseId.toString()} />
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex flex-col justify-center flex-grow p-3 space-y-2 h-full">
                  <h3 className="text-base md:text-xl  truncate text-black dark:text-white">
                    {course.title}
                  </h3>
                </CardContent>

                <Progress
                  value={Math.round((course.lessonsCompleted / course.totalLessons) * 100)}
                  className="h-2 w-[95%] mx-auto bg-[#D9D9D9] dark:bg-[#474666]"
                />

                <CardFooter className="p-3 pt-3">
                  <div className="w-full text-black dark:text-white pt-3">
                    <div className="flex items-center justify-between gap-8">
                      <p className="text-xs md:text-sm font-poppins relative bottom-2">
                        {course.lessonsCompleted} de {course.totalLessons} lecciones completadas
                      </p>
                      <p className="text-xs md:text-sm font-poppins relative bottom-2">
                        {course.totalLessons > 0
                          ? ((course.lessonsCompleted / course.totalLessons) * 100).toFixed(2)
                          : 0}
                        % Completado
                      </p>
                    </div>

                    <Separator />

                    <div className="pt-2">
                      <Link
                        href={`/curso/${course.courseId}`}
                        className="flex items-center justify-center w-fit rounded-full bg-[#4A90E2] px-5 py-2 text-xs text-white hover:text-white dark:text-white dark:hover:bg-[#3f7abe]"
                      >
                        Ver Curso
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
            : null}
        </div>
      </div>
    </div>
  );
}
