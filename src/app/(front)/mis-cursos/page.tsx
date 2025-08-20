import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { TooltipAprender } from '@/components/TooltipAprender/TooltipAprender';
import BigTitle from '@/components/BigTitle/BigTitle';
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
import courseService from '@/utils/Services/courseService';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { Progress } from '@/components/ui/progress';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';
import dynamic from 'next/dynamic';

// Importamos el componente del modal con dynamic para que se renderice en el cliente
const DiscordConnectModalOnce = dynamic(
  () => import('@/components/DiscordConnectModal/DiscordConnectModalOnce'),
  {
    ssr: false,
  }
);

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

export default async function PageMisCursos({
  searchParams: { category = 'all', page = '1' },
}: {
  searchParams: {
    category: string;
    page: string;
  };
}) {
  const session = await getServerSession(authOptions);

  // const mySubs = session?.user?.suscription?.type;

  // const { courses, pages } = await courseService.getCoursesBySubscription({
  //   subscription: mySubs || '',
  //   page,
  // });

  // const getFilterUrlSubs = ({ pg }: { pg?: string }) => {
  //   const params = {
  //     page,
  //   };
  //   if (pg) params.page = pg;
  //   return `/mis-cursos?${new URLSearchParams(params).toString()}#filtros`;
  // };

  // const totalLessons = courseProgress?.progress?.reduce(
  //   (total: number, section: any) => total + (section.lessons?.length || 0),
  //   0
  // );

  // const viewedLessons = courseProgress?.progress?.reduce(
  //   (total: number, section: any) => {
  //     const viewedInSection =
  //       section.lessons?.filter((lesson: any) => lesson.isViewed?.status)
  //         .length || 0;
  //     return total + viewedInSection;
  //   },
  //   0
  // );

  // function calculateCompletionPercentage(
  //   totalLessons: number,
  //   viewedLessons: number
  // ): number {
  //   if (totalLessons === 0) return 0; // Evitar división por cero
  //   return Math.round((viewedLessons / totalLessons) * 100); // Redondear porcentaje
  // }

  // const completionPercentage = calculateCompletionPercentage(
  //   totalLessons || 0,
  //   viewedLessons || 0
  // );

  const myEnrolledCourses = await getCoursesData();

  return (
    <>
      {session && <DiscordConnectModalOnce />}

      <div className="min-h-screen dark:bg-background  rounded-lg">
        <div className="w-full rounded-lg bg-background">
          <BigTitle
            className="text-2xl md:text-4xl font-bold text-center  dark:text-white text-black"
            title="Mis cursos"
          />
        </div>

        <div className="container mx-auto pb-5 overflow-hidden h-full">
          <div className="pt-7 md:pt-9">
            <TooltipAprender
              showButtons={true}
              title="¡Mantente al día con tus aprendizajes!"
              text="Aprender un poco cada día suma. La investigación demuestra que los
          estudiantes que hacen del aprendizaje un hábito tienen más
          probabilidades de alcanzar sus objetivos. Dedica tiempo para aprender y
          mantente al tanto de todas las novedades, como nuevos cursos, clases en
          vivo y más, activando las notificaciones en tu programador de
          aprendizaje."
            />
          </div>

          <MediumTitle
            title="Cursos de acceso permanente"
            className="mt-7 text-2xl md:text-[26px] "
          />
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 2Pxl:grid-cols-3 pt-3 gap-7">
            {myEnrolledCourses && myEnrolledCourses.length > 0
              ? myEnrolledCourses.map(course => (
                <div key={course.courseId}>
                  <Link href={`/curso/${course.courseId}`}>
                    <Card className="flex flex-col w-full transition-transform duration-300 ease-in-out hover:scale-[1.009] hover:shadow-lg dark:border-gray-800 border-slate-200 border">
                      <CardHeader className="relative p-0">
                        <div className="relative w-full h-72">
                          {course.lessonsCompleted === course.totalLessons && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg z-10"></div>
                          )}
                          <Image
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src={course.thumbnail.url || 'imagen de curso finanflix'}
                            alt="Curso"
                            className="w-full rounded-t-lg"
                            priority
                          />
                        </div>
                        {course.lessonsCompleted === course.totalLessons && (
                          <div className="absolute top-4 right-4 left-4 z-20">
                            <ClientCertificateButton courseId={course.courseId.toString()} />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="flex-grow p-3 space-y-2">
                        <p className="text-[18px] text-[#71767F] font-poppins font-[500]">
                          Lecciónes completadas {course.lessonsCompleted}
                        </p>
                        <h3 className="text-xl font-semibold dark:text-white text-black truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm dark:text-white text-black">{course.subtitle}</p>
                      </CardContent>
                      <Progress
                        value={Math.round((course.lessonsCompleted / course.totalLessons) * 100)}
                        className="h-2 dark:bg-[#474666] bg-[#D9D9D9] w-[95%] mx-auto"
                      />
                      <CardFooter className="p-3 pt-3">
                        <div className="w-full dark:text-white text-black pt-3">
                          <div className="flex justify-between items-center gap-8">
                            <p className="text-[13.5px] font-poppins relative bottom-2">
                              {course.lessonsCompleted} de {course.totalLessons} lecciones
                              completadas
                            </p>
                            <p className="text-[13.5px] font-poppins relative bottom-2 2xl:w-full">
                              {course.totalLessons > 0
                                ? ((course.lessonsCompleted / course.totalLessons) * 100).toFixed(
                                  2
                                )
                                : 0}{' '}
                              % Completado
                            </p>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </div>
              ))
              : 'No tienes cursos en progreso'}
          </div>
        </div>
      </div>
      <FooterColorSetter color="bg-[#F3F4F6]" />
    </>
  );
}
