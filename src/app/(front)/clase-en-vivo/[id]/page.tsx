import { Card, CardContent } from '@/components/ui/card';
import { ILiveLesson } from '@/interfaces/liveLesson';
import liveLessonModel from '@/models/liveLessonModel';
import { formatDuration } from '@/utils/FormatDuration/FormatDuration';
import React from 'react';
import { BookCheckIcon, CalendarDays, Clock, GraduationCap, Info, MoreVertical, NotebookPen } from 'lucide-react';
import VimeoClaseVivo from '@/utils/VimeoPlayer/VimeoClaseVivo';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/dbConfig';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import UserCourse from '@/models/userCourseModel';
import moment from 'moment';

const accessToken = process.env.VIMEO_ACCESS_TOKEN;

export default async function ClaseEnVivo({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { videoUrl: string };
}) {
  await connectDB();
  const course: ILiveLesson | null = await liveLessonModel.findById(params.id);
  const session = await getServerSession(authOptions);

  if (!course) {
    return <div>No se encontraron datos para esta clase en vivo.</div>;
  }

  const videoId = Number(searchParams.videoUrl);

  // Realizar el fetch para obtener la duración del video
  const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error('Error al obtener la duración del video:', response.statusText);
    return <div>Error al cargar la duración del video.</div>;
  }

  const videoData = await response.json();

  const duration = videoData?.duration || 'Cargando...';

  if (
    session?.user?.suscription?.status !== 'active' ||
    new Date(session?.user?.suscription?.endDate!) < new Date()
  ) {
    // Redirige al inicio si no tiene suscripción
    redirect('/');
  }

  // Filtra los cursos en progreso que tengan al menos una lección vista y al menos una lección no vista
  const CourseInProgressCounter = await UserCourse.countDocuments({
    userId: session?.user?._id.toString(),
    'progress.lessons.isViewed.status': true, // al menos una lección vista
    $expr: {
      $gt: [
        {
          $size: {
            $filter: {
              input: '$progress.lessons',
              as: 'lesson',
              cond: { $eq: ['$$lesson.isViewed.status', false] }, // al menos una no vista
            },
          },
        },
        0,
      ],
    },
  });

  // validacion para typescript
  if (!session?.user?._id) {
    throw new Error('No user session found');
  }

  const completedCourses = await getCompletedCoursesCount(session?.user._id.toString());

  return (
    <div>
      <div className="h-auto">
        <nav className="hidden md:flex md:flex-col md:border-b md:h-full md:w-full ">
          <div className="flex items-center justify-between pb-4">
            <div className=" space-x-2 md:flex md:flex-row md:w-fit">
              <div className="flex flex-row items-center gap-2  dark:text-white text-black ">
                <NotebookPen className="h-5 w-5" />
                <h3 className="text-base leading-none tracking-wide dark:text-white text-black">
                  Categoría:{' '}
                </h3>
                <p className="text-sm dark:text-white/text-gray-600">{course.category}</p>
              </div>
              <p>|</p>
              <div className="space-x-2 w-fit flex ">
                <div className="flex flex-row items-center md:gap-2  dark:text-white text-black ">
                  <GraduationCap className="h-5 w-5" />
                  <h3 className="text-base leading-none tracking-wide dark:text-white text-black">
                    Formato :{' '}
                  </h3>
                  <p className="text-sm dark:text-white/text-gray-600">Clase en vivo</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 h-full">
              <div className="h-full hidden xl:flex items-center justify-center mr-1  ">
                <Link
                  className="text-white dark:bg-primary bg-primary dark:hover:bg-[#d03400] rounded-full py-2 px-4 text-base dark:hover:text-[#e9e9e9] dark:hover:bg-[rgba(240, 52, 0, 1)] "
                  href={'/clases-en-vivo'}
                >
                  Ir a clases en vivo
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="hidden md:flex  bg-transparent dark:bg-transparent hover:bg-none dark:hover:bg-none cursor-pointer "
                >
                  <div className="hover:bg-none dark:hover:bg-none bg-transparent dark:bg-transparent ">
                    <MoreVertical className="h-5 w-5 bg-none dark:bg-none dark:text-white text-black hover:bg-none dark:hover:bg-none " />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    {' '}
                    <Link
                      target="_blank"
                      href="https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0"
                    >
                      {/* <Link target="_blank" href="https://soporte-finanflix.vercel.app/"> */}
                      Soporte
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/editar-perfil">Ir al Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/programas">Ver Más Programas</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
        {/* <main className="max-w-7xl mx-auto   "></main> */}
        <main className="max-w-7xl mx-auto px-4 sm:px-0 ">
          <div className=" pb-4 md:py-6">
            <h1 className="text-xl md:text-2xl font-bold dark:text-white text-black">
              {course?.title || 'Curso Inicial de Análisis fundamental'}
            </h1>
          </div>

          <div className="grid 2xl:grid-cols-3 gap-8">
            <div className="2xl:col-span-2">
              <div className="relative w-full h-full bg-slate-900 overflow-hidden dark:rounded-[36px] rounded-[36px]">
                <VimeoClaseVivo videoId={videoId} />
              </div>
            </div>
            {/* right side grid column */}
            <div className="w-full self-start">
              <Card className="dark:bg-card bg-background  ">
                <CardContent className="p-6">
                  <div className="flex gap-3 items-center h-full mb-4">
                    <Info className="h-4 w-4" />
                    <h2 className="text-base sm:text-xl font-semibold  dark:text-white text-black font-poppins ">
                      Información de la clase
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 dark:text-[#A7A7A7] text-black font-poppins text-sm sm:text-base ">
                      <Clock className="text-slate-500 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      Duración del video:
                      <span className="text-white">
                        {' '}
                        {duration ? formatDuration(duration) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 dark:text-[#A7A7A7] text-black font-poppins text-sm sm:text-base ">
                      <BookCheckIcon className="text-slate-500 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      Categoria:<span className="text-white w-full"> {course.category}</span>
                    </div>
                    <div className="flex items-center gap-2  dark:text-[#A7A7A7] text-black font-poppins text-sm sm:text-base ">
                      <CalendarDays className="text-slate-500 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />

                      <span className="flex gap-2">
                        <p className="w-fit">Fecha de publicación:</p>
                        <span className="text-white">
                          {course?.lessonDate
                            ? moment(course.lessonDate).format('DD/MM/YYYY')
                            : 'Fecha no disponible'}
                        </span>
                      </span>
                    </div>

                  </div>
                </CardContent>
              </Card>
              {/* Cursos completados y desbloquea tabla de lideres Container */}
              <div>
                <div className="flex  mb-4 gap-3 py-6 w-[300px] ">
                  <div className="bg-[#702DFF] dark:text-white text-white rounded-2xl p-3 text-start flex items-center justify-center gap-2">
                    <span className="text-[68px] md:text-[74px] font-groteskSharpBold10">
                      {/* {completedCourses[0]?.completedCourses} */}
                      {completedCourses}
                    </span>
                    <span className="text-[26px] md:text-3xl leading-[1.7rem] md:leading-[2rem] font-groteskSharpBold10 font-[400] tracking-wide ">
                      {completedCourses === 1 ? 'CURSO COMPLETADO' : 'CURSOS COMPLETADOS'}
                    </span>
                  </div>
                  <div className="bg-[#E0EAF3] dark:text-[#702DFF] text-[#702DFF] rounded-2xl p-3 text-start flex items-center justify-center gap-2">
                    <span className="text-[68px] md:text-[74px] font-groteskSharpBold10">
                      {CourseInProgressCounter}
                    </span>
                    <span className="text-[26px] md:text-3xl leading-[1.7rem] md:leading-[2rem] font-groteskSharpBold10 tracking-wide font-[400]">
                      {CourseInProgressCounter === 1 ? 'CURSO EN PROGRESO' : 'CURSOS EN PROGRESO'}
                    </span>
                  </div>
                </div>
                {/* <div className="dark:bg-card bg-card rounded-2xl p-4 w-[300px] ">
                  <h3 className="font-medium mb-2">Desbloquea la tabla de líderes</h3>
                  <div className="flex items-center">
                    <div className=" rounded-full p-2 mr-3">
                      <Image
                        width={100}
                        height={120}
                        alt={'Candado'}
                        src={
                          'https://res.cloudinary.com/drlottfhm/image/upload/v1750702408/lock_o6rjyy.png'
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm">Completa las lecciones para empezar a competir</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
