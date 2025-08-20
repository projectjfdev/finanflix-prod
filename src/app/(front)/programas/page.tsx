import LeaderBoard from '@/components/LeaderBoard/LeaderBoard';
import CardsRecommendedCourses from '@/components/CardsRecommendedCourses/CardsRecommendedCourses';
import SectionFiltersPrograms from '@/components/SectionFilters/SectionFiltersPrograms';
import ContinueLearning from '@/components/ContinueLearning/ContinueLearning';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CardsLiveLessons from '@/components/CardsLiveLessons/CardsLiveLessons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { getCoursesInProgress } from '@/utils/Endpoints/coursesEndpoint';
import courseService from '@/utils/Services/courseService';
import CardsCourses from '@/components/CardsCourses/CardsCourses';
import { MainPagination } from '@/components/MainPagination/MainPagination';
import { NoResults } from '@/components/NoResults/NoResults';
import dynamic from 'next/dynamic';
import MyCourses from '@/components/MyCourses/MyCourses';
import { hasSubscription } from '@/utils/HasSubscription';
import { ICourse } from '@/interfaces/course';

// Importamos el componente del modal con dynamic para que se renderice en el cliente
const DiscordConnectModalOnce = dynamic(
  () => import('@/components/DiscordConnectModal/DiscordConnectModalOnce'),
  {
    ssr: false,
  }
);

export default async function PagePrograms({
  searchParams: { category = 'all', page = '1' },
}: {
  searchParams: {
    category: string;
    page: string;
  };
}) {
  const session = await getServerSession(authOptions);

  const continueLearningCourses = await getCoursesInProgress();

  const getFilterUrl = ({ c }: { c?: string }) => {
    const params = {
      category,
    };
    if (c) params.category = c;
    return `/?${new URLSearchParams(params).toString()}#filtros`;
  };

  const getFilterUrlSubs = ({ pg }: { pg?: string }) => {
    const params = {
      page,
    };
    if (pg) params.page = pg;
    return `/programas?${new URLSearchParams(params).toString()}#filtros`;
  };

  let courses: ICourse[] = [];
  let pages = 0;

  if (hasSubscription(session)) {
    const mySubs = session?.user?.suscription?.type;

    const response = await courseService.getCoursesBySubscription({
      subscription: mySubs || '',
      page,
    });

    courses = response.courses as unknown as ICourse[];
    pages = response.pages;
  }

  return (
    <>
      {/* Renderizamos el modal de Discord pasando el usuario de la sesión importamos con force dinamyc por que dependemos de la session del usuario*/}
      {session && <DiscordConnectModalOnce />}
      <div className="px-4 md:px-0 dark:bg-background bg-[#F3F4F6] w-full">
        {/* -------------------- SECCION CARD - CONTINUAR APRENDIENDO bg-[#eeeef2] gris neko --------------------   */}

        <ContinueLearning />

        {!session && (
          <div className="md:mb-9 mt-3 ">
            <Card className="relative w-full h-full overflow-hidden ">
              <Image
                src="/images/courses/1.jpg"
                alt="Imagen del banner de Clases En Vivo"
                width={1920}
                height={100}
                className="object-cover w-full h-[300px] "
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-start">
                  <Button className=" text-white px-20 py-6 dark:bg-primary bg-primary dark:hover:bg-[#d03400]  text-lg ">
                    Explorar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="w-screen ml-[calc(-50vw+50%)] dark:bg-background bg-white">
          <div className="px-4 md:px-0 md:w-[70.9vw] mx-auto">
            <div
              className={`${!continueLearningCourses ? 'md:pt-3' : 'py-9 md:pt-9 md:pb-4 md:py-0'}`}
            >
              <SectionFiltersPrograms getFilterUrl={getFilterUrl} category={category} />
            </div>

            {/* COMPONENTE MIS CURSOS  */}
            <MyCourses />

            {hasSubscription(session) && (
              <div>
                <MediumTitle title="Cursos exclusivos para suscriptores" className='mb-3' />
                <div className="md:pt-4">
                  {courses.length > 0 ? (
                    <div id="filtros">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-9">
                        {courses?.map((course: any, index: number) => {
                          const key = course?._id?.toString() || index;
                          return <CardsCourses key={key} course={course} />;
                        })}
                      </div>
                      <div className='pb-9 md:pb-0'>
                        <MainPagination page={page} pages={pages} getFilterUrl={getFilterUrlSubs} />
                      </div>
                    </div>
                  ) : (
                    <NoResults />
                  )}
                </div>
              </div>
            )}

            {session ? (
              <div className="w-full md:mb-9">
                <MediumTitle
                  className="ml-3 md:ml-0 pb-3 text-left text-[22px]"
                  title={`Elegido para ${session?.user?.firstName || session?.user.username}`}
                />

                <div id="parati" className="w-full z-10">
                  <CardsRecommendedCourses />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {/* -------------------- SECCION LEADERBOARD SCORE -------------------- */}
        <div id="tendencias">
          <LeaderBoard />
        </div>

        {/* CONTAINER BLANCO BACKGROUND
      <div className="dark:bg-background bg-white hidden 2xl:flex absolute  left-[-450px] w-[calc(100vw+350px)] min-h-[100vh] h-[100vh] -z-40   "></div> */}
        <div className="w-screen ml-[calc(-50vw+50%)] dark:bg-background bg-white">
          <div className="px-8 md:px-0 md:w-[70.9vw] mx-auto">
            <div id="misiones">
              <CardsLiveLessons />
            </div>
          </div>
        </div>

        {/* DIV VACIO */}
        <div id="cursos"></div>
      </div>
    </>
  );
}
