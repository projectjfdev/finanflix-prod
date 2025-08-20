import { GraduationCap, NotebookPen, Check, ChevronDown, MoreVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import courseService from '@/utils/Services/courseService';
// import VimeoPlayer from '@/utils/VimeoPlayer/VimeoPlayer';
import ButtonChangeLesson from '@/components/ButtonChangeLesson/ButtonChangeLesson';
import PdfViewer from '@/utils/PdfViewer/PdfViewer';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserCourse from '@/models/userCourseModel';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { calculateCompletionPercentage } from '@/utils/VIdeos/CourseProgress';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CourseProgressCircle from '@/components/CourseProgressCircle/CourseProgressCircle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import VimeoPlayerWithCustomControls from '@/utils/VimeoPlayer/VimeoPlayer';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import { isUserInGuild } from '@/lib/discord/discord';
import CurrentLessonTitle from '@/components/ButtonChangeLesson/CurrentLessonTitle';

// Importamos el componente del modal con dynamic para que se renderice en el cliente
const DiscordConnectBanner = dynamic(
  () => import('@/components/DiscordBannerReminder/DiscordBannerReminder'),
  {
    ssr: false,
  }
);

export default async function CursoPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { videoUrl?: number; textContent: string; lessonId: string };
}) {
  const decodeUrl = (encodedUrl: string) => {
    return Buffer.from(encodedUrl, 'base64').toString('utf-8');
  };
  const accessToken = process.env.VIMEO_ACCESS_TOKEN;
  const session = await getServerSession(authOptions);

  // Logica de discord para revisar si el usuario esta en el servidor
  const discordId = session?.user.discordId as string;
  const isUserInDiscord = await isUserInGuild(discordId);

  // console.log(isUserInDiscord);

  //Params
  const videoUrl = searchParams.videoUrl;
  const lessonId = searchParams.lessonId;
  const textContent = searchParams.textContent ? decodeUrl(searchParams.textContent) : undefined;

  const course = await courseService.getById(params.id);

  //console.log(course, "curso");


  const response = await fetch(`https://api.vimeo.com/videos/${videoUrl}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { duration } = await response.json();

  const courseProgress = await UserCourse.findOne({
    courseId: params.id,
    userId: session?.user?._id,
  });

  // Verificamos si la primera lección del curso es de tipo 'textContent'
  if (course?.sections?.[0]?.lessons?.[0]?.type === 'textContent') {
    // Aseguramos que courseProgress exista y tenga el esquema esperado
    if (courseProgress?.progress?.[0]?.lessons?.[0]) {
      courseProgress.progress[0].lessons[0].isViewed.status = true;

      await courseProgress.save(); // Guardamos el cambio
    }
  }
  // if (courseProgress.progress[0].lessons[0].isViewed === true)

  const totalLessons = course?.sections?.reduce((total, section) => {
    return total + (section.lessons?.length || 0);
  }, 0);

  const viewedLessons = courseProgress?.progress?.reduce((total: number, section: any) => {
    const viewedInSection =
      section.lessons?.filter((lesson: any) => lesson.isViewed?.status).length || 0;
    return total + viewedInSection;
  }, 0);

  const completionPercentage = calculateCompletionPercentage(totalLessons as number, viewedLessons);

  const getProgressColor = (progress: number) => {
    if (progress <= 25) return '#22C25D';
    if (progress <= 50) return '#22C25D'; // green-400
    if (progress <= 75) return '#22C25D';
    if ((progress = 100)) return '#22C25D'; // blue-500
    return '#4ade80'; // green-400
  };

  // Encuentra la lección actual y su sección
  let foundCurrentLesson = false;
  let nextLesson: {
    videoUrl?: string;
    lessonId?: string;
    textContent?: string;
  } | null = null;

  let currentChapterTitle: string | undefined = '';
  let currentChapterIndex = -1;
  let currentLessonTitle = '';

  for (let i = 0; i < course?.sections?.length!; i++) {
    const section = course?.sections![i];
    for (let j = 0; j < section?.lessons?.length!; j++) {
      const lesson = section?.lessons[j];
      if (lesson?._id.toString() === lessonId) {
        foundCurrentLesson = true;

        // Guardar información del capítulo y lección actual
        currentChapterTitle = section?.title;
        currentChapterIndex = i;
        currentLessonTitle = lesson.title;

        // Busca la siguiente lección en la misma sección
        if (j + 1 < section?.lessons.length!) {
          nextLesson = {
            videoUrl: section?.lessons[j + 1].videoUrl,
            lessonId: section?.lessons[j + 1]._id.toString(),
            textContent: section?.lessons[j + 1].textContent,
          };
          break;
        } else if (i + 1 < course?.sections?.length!) {
          // Si no hay más lecciones, pasa a la primera lección de la siguiente sección
          const nextSection = course?.sections![i + 1];
          nextLesson = {
            videoUrl: nextSection?.lessons[0]?.videoUrl,
            lessonId: nextSection?.lessons[0]?._id.toString(),
            textContent: nextSection?.lessons[0]?.textContent,
          };
          break;
        }
      }
    }

    if (nextLesson) break; // Sal del bucle si encontraste la siguiente lección
  }

  const myCourse = session?.user.enrolledCourses?.some((course: any) =>
    course.equals(new ObjectId(params.id))
  );

  const baseSubscriptionType = session?.user?.suscription?.type.split(' - ')[0]?.toLowerCase();

  // if (!baseSubscriptionType) return false;

  const userHasSubscription =
    (baseSubscriptionType !== undefined &&
      course?.isVisibleToSubscribers?.some(subscription =>
        subscription.toLowerCase().includes(baseSubscriptionType)
      )) ||
    false;

  const hasAccess = userHasSubscription || myCourse;

  if (!hasAccess) {
    redirect(`/checkout/${params.id}?step=billing`);
  }

  // Conteo de Cursos en progreso con lessons que tengan isviewed en true

  // const CourseInProgressCounter = await UserCourse.countDocuments({
  //   userId: session?.user?._id.toString(),
  //   'progress.lessons.isViewed.status': true, // Busca lecciones con "isViewed.status" en true
  // });

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

  // console.log(CourseInProgressCounter);

  // validacion para typescript
  if (!session?.user?._id) {
    throw new Error('No user session found');
  }

  const completedCourses = await getCompletedCoursesCount(session?.user._id.toString());

  // Función para obtener la URL de la primera lección del primer capítulo
  const getFirstLessonUrl = () => {
    if (course?.sections && course.sections.length > 0) {
      const firstSection = course.sections[0];
      if (firstSection.lessons && firstSection.lessons.length > 0) {
        const firstLesson = firstSection.lessons[0];

        const encodeUrl = (url: string) => Buffer.from(url).toString('base64');

        if (firstLesson.type === 'videoUrl' && firstLesson.videoUrl) {
          const videoUrl = firstLesson.videoUrl.split('/').pop();
          return `/curso/${params.id}?videoUrl=${videoUrl}&lessonId=${firstLesson._id.toString()}`;
        } else if (firstLesson.textContent) {
          const urlWithoutProtocol = firstLesson.textContent.replace(/^https?:\/\//, '');
          const encodedTextContent = encodeUrl(urlWithoutProtocol);
          return `/curso/${params.id
            }?textContent=${encodedTextContent}&lessonId=${firstLesson._id.toString()}`;
        }
      }
    }
    return null;
  };

  const firstLessonUrl = getFirstLessonUrl();

  console.log(courseProgress?._id.toString());


  return (
    <>
      <div className="min-h-screen w-full dark:bg-background bg-[#F3F4F6]">
        <ScrollArea className="min-h-screen w-full flex h-full">
          {/* Navbar */}
          <nav className="hidden md:flex md:flex-col md:border-b md:h-full md:w-full ">
            <div className="flex items-center justify-between pb-4">
              <div className=" space-x-2 md:flex md:flex-row md:w-fit ml-8">
                <div className="flex flex-row items-center gap-2  dark:text-white text-black ">
                  <NotebookPen className="h-5 w-5" />
                  <h3 className="text-base leading-none tracking-wide dark:text-white text-black">
                    Categoría:{' '}
                  </h3>
                  <p className="text-sm dark:text-white/text-gray-600">{course?.category}</p>
                </div>
                <p>|</p>
                <div className="space-x-2 w-fit flex ">
                  <div className="flex flex-row items-center md:gap-2  dark:text-white text-black ">
                    <GraduationCap className="h-5 w-5" />
                    <h3 className="text-base leading-none tracking-wide dark:text-white text-black">
                      Nivel:{' '}
                    </h3>
                    <p className="text-sm dark:text-white/text-gray-600">{course?.level}</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-4 h-full">
                <div className="h-full hidden xl:flex items-center justify-center mr-1  ">
                  {/* Círculo de progreso */}
                  <CourseProgressCircle
                    progress={completionPercentage}
                    progressColor={getProgressColor(completionPercentage)}
                  />
                </div>

                <Select defaultValue="0">
                  <div className="hidden ml-2  lg:justify-center lg:items-center  lg:flex ">
                    <Popover>
                      <PopoverTrigger className="hidden xl:flex xl:justify-center xl:items-center gap-10 dark:bg-card bg-card  py-2 px-3 rounded-full text-base">
                        Ver
                        <ChevronDown size={12} />
                      </PopoverTrigger>
                      <PopoverContent className="h-[100px] text-sm ">
                        {viewedLessons || 0} de {totalLessons} completado. Termina el curso para
                        obtener tu certificado..
                      </PopoverContent>
                    </Popover>
                  </div>
                  <SelectContent></SelectContent>
                </Select>

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

          {/* Main content   */}

          <div className="flex-2 grid grid-cols-1 xl:grid-cols-[1fr,300px] border-none md:gap-12 dark:bg-background bg-[#F3F4F6]">
            <div className="flex flex-col">
              <div className="px-5 md:px-8 pb-3 md:py-6">
                <h1 className="text-xl md:text-2xl font-bold dark:text-white text-black">
                  {course?.title || 'Curso Inicial de Análisis fundamental'}
                </h1>
              </div>

              {/* Video player */}
              <div className="dark:bg-background bg-[#F3F4F6] w-full border-none dark:rounded-[36px] rounded-[36px]   ">
                {!videoUrl && !textContent && (
                  <div className="relative w-full dark:rounded-[36px] rounded-[36px]  ">
                    <Image
                      className="w-full h-full object-cover dark:rounded-[36px] rounded-[36px]"
                      src={course?.thumbnail?.url || '/placeholder.svg?height=600&width=1080'}
                      width={1080}
                      height={600}
                      alt={course?.title || 'Imagen del curso Finanflix'}
                    />
                    {/* Gradiente overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 dark:rounded-[36px] rounded-[36px]"></div>
                    {/* Contenido centrado */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center dark:rounded-[36px] rounded-[36px]">
                      <h2 className="text-lg sm:text-xl md:text-2xl 2xl:text-4xl font-bold animate-fade-in text-[#FF5252] mb-2">
                        {(course?.title && course?.title) || 'Curso Finanflix'}
                      </h2>
                      <h2 className="text-white text-lg sm:text-2xl 2xl:text-4xl font-bold animate-fade-in">
                        {(course?.welcomeMessage && course?.welcomeMessage) || 'Bienvenido'}
                      </h2>
                      <p className="text-white text-sm sm:text-lg mt-2 max-w-2xl opacity-80">
                        Explora el contenido, aprende a tu ritmo y alcanza tus objetivos
                      </p>
                      {/* <Button className='mt-10 py-3'>Ingresa al capitulo uno</Button> */}
                      {firstLessonUrl ? (
                        <Link
                          href={firstLessonUrl}
                          className="mt-2 xl:mt-4 text-xs sm:text-base py-2 px-3 md:p-3 bg-primary rounded-full dark:hover:bg-[#d03400]  hover:bg-[#d03400] "
                        >
                          Comenzar la clase
                        </Link>
                      ) : null}
                    </div>
                  </div>
                )}

                {videoUrl && (
                  <div className="relative ">
                    <VimeoPlayerWithCustomControls
                      videoId={videoUrl}
                      lessonId={lessonId}
                      userCourseId={courseProgress?._id.toString()}
                      // nextVideo={nextLesson?.videoUrl?.split('/').pop()}
                      nextLesson={nextLesson?.lessonId}
                      nextTextContent={nextLesson?.textContent}
                      courseId={params.id}
                    />

                    <div className="absolute top-4 right-4">
                      <div className="bg-black/50 px-3 py-1 rounded-md">
                        <span className="text-white text-sm font-medium">FINANFLIX</span>
                      </div>
                    </div>
                  </div>
                )}

                {textContent && <PdfViewer pdfUrl={`https://${textContent}`} />}
              </div>

              {(textContent && !videoUrl) || videoUrl ? (
                <div className="dark:bg-background bg-[#F3F4F6] px-3 py-3 md:pt-6 md:px-6 md:pb-0 ">
                  <div className="flex items-center gap-4">
                    <div className="relative inline-block">
                      <Avatar className="h-[38px] w-[38px] p-0 m-0">
                        <AvatarImage
                          src={
                            session?.user?.profileImage?.url ||
                            'https://res.cloudinary.com/drlottfhm/image/upload/v1750703606/noImgProfile_nkbhbr.png'
                          }
                          alt="profile finanflix"
                        />
                        <AvatarFallback>
                          {session?.user?.firstName?.substring(0, 2) || 'CN'}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="space-y-1">
                      <div>
                        {textContent && !videoUrl ? (
                          <CurrentLessonTitle courseId={course?._id?.toString() as string} />
                        ) : (
                          <h3 className="text-base sm:text-lg font-medium">
                            Estás viendo:{' '}
                            {course?.sections
                              ?.find(section =>
                                section.lessons?.some(lesson => lesson._id.toString() === lessonId)
                              )
                              ?.lessons?.find(lesson => lesson._id.toString() === lessonId)
                              ?.title || 'Lección actual'}
                          </h3>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <span>@{session?.user.firstName}</span>
                        <span className="ml-2 dark:bg-secondary bg-secondary text-green-500 px-1 rounded flex items-center">
                          <Check size={10} className="h-4 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Tabs */}

              <div className="w-full py-3 hidden md:flex"></div>

              {!isUserInDiscord ? <DiscordConnectBanner /> : null}

              <div className="px-3  sm:px-0 dark:bg-background bg-[#F3F4F6] rounded-2xl h-full border-none">
                <Tabs defaultValue="curso" className="border-none p-0 m-0">
                  <TabsList className="flex gap-4 justify-start bg-transparent my-[14px] ">
                    <TabsTrigger
                      className="bg-[#4527A0] text-white flex xl:hidden py-2 sm:py-3 text-[12px] md:text-sm rounded-lg"
                      // defaultChecked
                      value="curso"
                    >
                      Contenido del Curso
                    </TabsTrigger>
                  </TabsList>
                  {/* -------------------  ACORDION MOBILE  ------------------------------------ */}
                  <TabsContent
                    value="curso"
                    className="w-full block xl:hidden p-0 m-0 dark:bg-background bg-[#F3F4F6]"
                  >
                    <script
                      dangerouslySetInnerHTML={{
                        __html: `
                        document.addEventListener('DOMContentLoaded', function() {
                          try {
                            // Intentar obtener la sección guardada
                            const savedSection = localStorage.getItem('course-${params.id}-open-section');
                            if (savedSection) {
                              // Abrir la sección guardada
                              const sectionToOpen = document.querySelector('[data-value="section-' + savedSection + '"]');
                              if (sectionToOpen && !sectionToOpen.getAttribute('data-state') !== 'open') {
                                sectionToOpen.click();
                              }
                          }

                          // Agregar event listeners a los triggers del acordeón
                          document.querySelectorAll('[data-value^="section-"]').forEach(function(item) {
                            item.addEventListener('click', function() {
                              const sectionIndex = this.getAttribute('data-value').replace('section-', '');
                              localStorage.setItem('course-${params.id}-open-section', sectionIndex);
                            });
                          });
                        } catch (e) {
                          console.error('Error accessing localStorage:', e);
                        }
                      });
                    `,
                      }}
                    />
                    <Accordion
                      type="multiple"
                      className="p-0 m-0 rouded-lg mt-6 dark:bg-background bg-[#F3F4F6]"
                      defaultValue={
                        currentChapterIndex !== -1 ? [`section-${currentChapterIndex}`] : []
                      }
                    >
                      {course?.sections?.map((chapter, index) => (
                        <AccordionItem
                          value={`section-${index}`}
                          key={index}
                          data-value={`section-${index}`}
                        >
                          <AccordionTrigger className="px-4">
                            <div className="w-full">
                              <div className="flex items-start rounded-lg space-x-4 w-full">
                                <div className="bg-[#4527A0] text-white rounded-lg p-2 flex-shrink-0">
                                  <NotebookPen className="h-3 w-3" />
                                </div>

                                <div className="flex flex-col items-start justify-start space-y-1">
                                  <h3 className="text-sm font-medium text-start ">
                                    Sección {index + 1}: {chapter.title}
                                  </h3>
                                  <div className="text-xs sm:text-sm text-start text-gray-500">
                                    <span>{chapter.lessons?.length || 0} lecciones</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              {chapter?.lessons?.map((lesson, lessonIndex) => (
                                <ButtonChangeLesson
                                  key={lesson._id.toString()}
                                  id={params.id}
                                  lessonIndex={lessonIndex}
                                  videoUrl={lesson?.videoUrl?.split('/').pop()}
                                  lessonId={lesson?._id.toString()}
                                  videoUrlLesson={lesson.videoUrl}
                                  title={lesson.title}
                                  duration={lesson._id.toString() === lessonId && duration}
                                  type={lesson.type}
                                  textContent={lesson.textContent}
                                  downloadableFile={lesson.downloadableFile}
                                  isActive={lesson._id.toString() === lessonId}
                                  sectionIndex={index}
                                  courseId={params.id}
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <div className="flex  gap-3 pt-3 h-full w-full  ">
                      <div className="bg-[#702DFF] dark:text-white text-white rounded-2xl py-2 sm:py-3 px-3 text-start flex flex-col w-full ">
                        <span className="text-7xl md:text-[76px] leading-tight font-[400] font-groteskBold10">
                          {completedCourses}
                        </span>
                        <span className="text-4xl md:text-5xl font-groteskBold10 font-[400] leading-tight">
                          {completedCourses === 1 ? 'Curso Completado' : 'Cursos Completados'}
                        </span>
                      </div>

                      <div className="bg-[#E0EAF3] dark:text-[#702DFF] text-[#702DFF] rounded-2xl py-2 sm:py-3 px-3 text-start flex flex-col w-full">
                        <span className="text-7xl md:text-[76px] font-groteskBold10 font-[400] leading-tight">
                          {CourseInProgressCounter}
                        </span>
                        <span className="text-4xl md:text-5xl font-groteskBold10 font-[400] leading-tight">
                          {CourseInProgressCounter === 1
                            ? 'Curso en progreso'
                            : 'Cursos en progreso'}
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
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            {/* -------------------  ACORDION DESK  ------------------------------------ */}

            <div className="hidden xl:flex lg:flex-col w-full  dark:bg-background bg-[#F3F4F6] ">
              <div className="p-4 ">
                <h2 className="text-xl font-bold dark:text-white text-black">Clases</h2>
              </div>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  document.addEventListener('DOMContentLoaded', function() {
                    try {
                      // Intentar obtener la sección guardada
                      const savedSection = localStorage.getItem('course-${params.id}-open-section');
                      if (savedSection) {
                        // Abrir la sección guardada
                        const sectionToOpen = document.querySelector('[data-value="section-desktop-' + savedSection + '"]');
                        if (sectionToOpen && !sectionToOpen.getAttribute('data-state') !== 'open') {
                          sectionToOpen.click();
                        }
                      }

                      // Agregar event listeners a los triggers del acordeón
                      document.querySelectorAll('[data-value^="section-desktop-"]').forEach(function(item) {
                        item.addEventListener('click', function() {
                          const sectionIndex = this.getAttribute('data-value').replace('section-desktop-', '');
                          localStorage.setItem('course-${params.id}-open-section', sectionIndex);
                        });
                      });
                    } catch (e) {
                      console.error('Error accessing localStorage:', e);
                    }
                  });
                `,
                }}
              />

              <Accordion
                type="multiple"
                defaultValue={currentChapterIndex !== -1 ? [`section-${currentChapterIndex}`] : []}
              >
                {course?.sections?.map((chapter, index) => (
                  <AccordionItem
                    value={`section-${index}`}
                    key={index}
                    data-value={`section-desktop-${index}`}
                  >
                    <AccordionTrigger className="">
                      <div className="w-full dark:bg-background bg-[#F3F4F6]">
                        <div className="flex items-start rounded-lg  space-x-4 w-full">
                          <div className="bg-[#4527A0] text-white rounded-lg p-2 flex-shrink-0">
                            <NotebookPen className="h-5 w-5" />
                          </div>

                          <div className="flex flex-col items-start justify-start  w-fit break-words">
                            <h3 className="font-medium text-start  ">
                              <span className="text-sm dark:text-white text-black dark:hover:text-[#A7A7A7]  hover:text-gray-600   ">
                                Sección {index + 1}: {chapter.title}
                              </span>
                            </h3>
                            <div className="text-sm text-start text-gray-500">
                              <span>{chapter.lessons?.length || 0} lecciones</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="flex flex-col dark:bg-background bg-[#F3F4F6] ">
                        {chapter?.lessons?.map((lesson, lessonIndex) => (
                          <div key={lessonIndex}>
                            <ButtonChangeLesson
                              id={params.id}
                              key={lesson._id.toString()}
                              lessonIndex={lessonIndex}
                              videoUrl={lesson?.videoUrl?.split('/').pop()}
                              lessonId={lesson?._id.toString()}
                              videoUrlLesson={lesson.videoUrl}
                              title={lesson.title}
                              duration={lesson._id.toString() === lessonId && duration}
                              type={lesson.type}
                              textContent={lesson.textContent}
                              downloadableFile={lesson.downloadableFile}
                              isActive={lesson._id.toString() === lessonId}
                              sectionIndex={index} // NUEVO: Pasar prop para indicar si es la lección activa
                              courseId={params.id}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex justify-between  gap-3 py-3 ">
                <div className="bg-[#702DFF] dark:text-white text-white rounded-2xl px-3 text-start flex flex-col w-full h-full">
                  <span className="text-[68px]  font-groteskBold10 font-[400] leading-tight">
                    {completedCourses}
                  </span>
                  <span className="text-base md:text-4xl font-groteskBold10 font-[400] leading-fit">
                    {completedCourses === 1 ? 'CURSO COMPLETADO' : 'CURSOS COMPLETADOS'}
                  </span>
                </div>

                <div className="bg-[#E0EAF3] dark:text-[#702DFF] text-[#702DFF] rounded-2xl px-3 text-start flex flex-col w-full pb-3">
                  <span className="text-[68px]  font-groteskBold10 font-[400] leading-tight">
                    {CourseInProgressCounter}
                  </span>
                  <span className="text-base md:text-4xl font-groteskBold10 font-[400] leading-fit">
                    {CourseInProgressCounter === 1 ? 'CURSO' : 'CURSOS'}{' '}
                    <span className="whitespace-nowrap"> EN PROGRESO</span>
                  </span>
                </div>

              </div>

              {/* <div className="dark:bg-card bg-card rounded-2xl p-4  ">
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
        </ScrollArea>
      </div>

      <FooterColorSetter color="bg-[#F3F4F6]" />
    </>
  );
}
