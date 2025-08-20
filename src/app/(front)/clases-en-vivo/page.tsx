import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { TooltipAprender } from '@/components/TooltipAprender/TooltipAprender';
import moment from 'moment';
import { fetchVideoDuration } from '@/utils/VIdeos/FetchDuration';
import { formatDuration } from '@/utils/FormatDuration/FormatDuration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import BigTitle from '@/components/BigTitle/BigTitle';
import liveLessonService from '@/utils/Services/livelessonsService';
import { MainPagination } from '@/components/MainPagination/MainPagination';
import { Search, SearchX } from 'lucide-react';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';
import dynamic from 'next/dynamic';
import { getImageByCategoryRectangular } from '@/utils/LiveLessonsImages/LiveLessonsImages';

// Importamos el componente del modal con dynamic para que se renderice en el cliente
const DiscordConnectModalOnce = dynamic(
  () => import('@/components/DiscordConnectModal/DiscordConnectModalOnce'),
  {
    ssr: false,
  }
);

export default async function PageClasesEnVivo({
  searchParams: { q = 'all', category = 'all', sort = 'newest', page = '1' },
}: {
  searchParams: {
    q: string;
    category: string;
    sort: string;
    page: string;
  };
}) {
  const getFilterUrl = ({
    c,
    s,

    pg,
  }: {
    c?: string;
    s?: string;

    pg?: string;
  }) => {
    const params = {
      q,
      category,

      sort,
      page,
    };
    if (c) params.category = c;

    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/clases-en-vivo?${new URLSearchParams(params).toString()}#filtros`;
  };

  const session = await getServerSession(authOptions);
  const categories = await liveLessonService.getCategories();
  const { countLiveLessons, liveLessons, pages } = await liveLessonService.getByQuery({
    category,
    q,
    page,
    sort,
  });

  // Obtener las duraciones de los videos
  const classesWithDuration = await Promise.all(
    liveLessons.map(async c => {
      try {
        const duration = await fetchVideoDuration(c.videoUrl);
        return {
          ...c, // Acceso explícito al documento
          duration: duration || 'No time',
        };
      } catch (error) {
        console.error(`Error obteniendo duración para ${c._doc.title}:`, error);
        return {
          ...c._doc,
          duration: null,
        };
      }
    })
  );

  return (
    <>
      {/* Renderizamos el modal de Discord pasando el usuario de la sesión importamos con force dinamyc por que dependemos de la session del usuario*/}
      {session && (
        <DiscordConnectModalOnce />
      )}
      <div className="min-h-screen dark:bg-background  rounded-lg">
        <div className="w-full rounded-lg bg-background ">
          <BigTitle
            className="text-2xl md:text-4xl font-bold text-center dark:text-white text-black"
            title="Clases en Vivo"
          />
        </div>

        <div className="px-4 md:px-0 pb-5 overflow-hidden h-full">
          <div className="pt-5 md:pt-9">
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
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-start md:items-center pt-5 justify-center md:justify-start">
            <span className="font-bold text-sm sm:text-base text-primary mr-1">
              {liveLessons.length === 0 ? 'No' : countLiveLessons} clases encontradas
            </span>
            {/* {q !== 'all' && q !== '' && ' - ' + q}
            {category !== 'all' && ' - ' + category}
            &nbsp; */}

            {q !== 'all' && q !== '' && (
              <span className="text-sm sm:text-base text-muted"> - {q}</span>
            )}

            {category !== 'all' && (
              <span className="text-sm sm:text-base text-muted"> - {category}</span>
            )}

            {(q !== 'all' && q !== '') || category !== 'all' ? (
              <Link href="/clases-en-vivo">
                <Card className="w-full flex gap-3 md:ml-5 items-center justify-center md:px-2 py-2 dark:hover:bg-primary">
                  <span className="px-3 md:px-1 text-xs sm:text-sm text-center md:text-start w-full ">
                    Eliminar filtros{' '}
                  </span>
                  <SearchX size={15} className='mr-3' />
                </Card>
              </Link>
            ) : null}
          </div>

          <div className="flex items-center md:mb-10 mb-9 mt-[10px] gap-1 dark:hover:text-[#E7E3E3] hover:text-black  text-[#BCBCBC] dark:bg-card bg-white rounded-full px-3 py-1 md:w-fit w-full">
            <Search className="w-4 h-4 md:w-6 md:h-6" />
            <SearchBox actionForm="clases-en-vivo" />
          </div>

          <div className="flex space-x-2 overflow-auto w-full " id="#filtros">
            {/* el h-14 marca los paddings del scroollbar */}
            <ScrollArea className="w-full whitespace-nowrap rounded-md h-full overflow-hidden">
              {categories.map((c: string) => (
                <Link key={c} href={getFilterUrl({ c })}>
                  <Button
                    id="ultima"
                    variant="outline"
                    size="sm"
                    className={cn(
                      'py-[18px] mr-3 rounded-full px-4 bg-white h-8 font-poppins transition-colors dark:bg-card  dark:text-[#A7A7A7] text-black dark:hover:text-white dark:hover:bg-primary',
                      c === category
                        ? ' hover:bg-primary/90 dark:bg-secondary  dark:text-white text-xs sm:text-sm'
                        : '  hover:bg-muted hover:text-foreground dark:hover:text-white  hover:bg-primary hover:text-white text-[#A7A7A7] text-xs sm:text-sm'
                    )}
                  >
                    {c}
                  </Button>
                </Link>
              ))}

              <div className="pt-5">
                <ScrollBar id="filtros" orientation="horizontal" />
              </div>
            </ScrollArea>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 pt-4 gap-9">
            {classesWithDuration.map((c: any, index) => {
              return (
                <Link
                  href={`/clase-en-vivo/${c._id}?videoUrl=${c?.videoUrl?.split('/')?.pop()}`}
                  key={c?._id?.toString() || index}
                >
                  <Card className="flex bg-white dark:bg-card flex-col w-full border-none rounded-2xl">
                    <CardHeader className="relative p-0">
                      <Image
                        width={600}
                        height={400}
                        src={getImageByCategoryRectangular(c?.category)}
                        alt="Imagen de la clase en vivo Finanflix"
                        className="w-full rounded-t-2xl"
                      />
                    </CardHeader>

                    <CardContent className="flex-grow py-2 sm:py-4 space-y-1  pl-4">
                      <h3 className="text-lg sm:text-xl   dark:text-white text-black truncate">
                        {c.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{c.description}</p>
                      <p className="text-xs sm:text-sm dark:text-white text-black ">
                        Duración: {c.duration ? formatDuration(c.duration) : 'N/A'}{' '}
                      </p>
                    </CardContent>

                    <CardFooter className="py-3 pt-0 pl-4">
                      {/* barra de progreso casera */}
                      <div className="w-full space-y-2 ">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-muted-foreground">{c.category}</span>
                          <p className="text-xs sm:text-sm dark:text-[#A7A7A7] text-black pt-1 pr-4">
                            {c?.lessonDate
                              ? moment(c?.lessonDate).format('MMMM DD, YYYY')
                              : 'Sin fecha'}
                          </p>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
          <MainPagination page={page} pages={pages} getFilterUrl={getFilterUrl} />
        </div>
      </div>
      <FooterColorSetter color="bg-[#F3F4F6]" />
    </>
  );
}
