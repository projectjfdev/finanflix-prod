import BigTitle from '@/components/BigTitle/BigTitle';
import CarouselBannerTop from '@/components/CarouselBannerTop/CarouselBannerTop';
import LastLiveClasses from '@/components/LastLiveClasses/LastLiveClasses';
import { NoResults } from '@/components/NoResults/NoResults';
import TaskProgressTabs from '@/components/TaskProgressTabs/TaskProgressTabs';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { authOptions } from '@/lib/authOptions';
import { cn } from '@/lib/utils';
import courseService from '@/utils/Services/courseService';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';
import { getAllCourses } from '@/actions/infiniteScroll';
import { InfiniteScrollComponent } from '@/components/CardsCourses/InfiniteScrollComponent';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';
import ContinueLearningHome from '@/components/ContinueLearning/ContinueLearningHome';
import type { Metadata } from 'next';
import MediumTitle from '@/components/MediumTitle/MediumTitle';

// Importamos el componente del modal con dynamic para que se renderice en el cliente
const DiscordConnectModalOnce = dynamic(
  () => import('@/components/DiscordConnectModal/DiscordConnectModalOnce'),
  {
    ssr: false,
  }
);

// IMPORTAMOS CON DYNAMIC PARA ESPECIFICAR DICHO COMPONENTE QUE SE TRAE SE RENDERICE DESDE EL LADO DEL CLIENTE

interface Props {
  searchParams: {
    q: string;
    category: string;
    next: string;
  };
}

export const metadata: Metadata = {
  title: 'Plataforma Finanflix',
  description:
    'Explora Finanflix, tu plataforma para aprender sobre finanzas, criptomonedas e inversiones. Educación práctica para transformar tu futuro.',
  openGraph: {
    title: 'Plataforma Finanflix',
    description:
      'Explora Finanflix, tu plataforma para aprender sobre finanzas, criptomonedas e inversiones. Educación práctica para transformar tu futuro.',
    url: 'https://finanflix.com',
    siteName: 'Finanflix',
    images: [
      {
        url: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
        width: 1200,
        height: 630,
        alt: 'Finanflix Logo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Plataforma Finanflix',
    description: 'Aprende finanzas y economía con Finanflix',
    site: '@finanflix', // Cambia esto si tienes el usuario de Twitter oficial
    creator: '@finanflix', // Opcional
    images: ['https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png'],
  },
  icons: {
    icon: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
    shortcut: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
    apple: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
  },
};

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const categories = await courseService.getCategories();
  const { courses, next_cursor } = await getAllCourses(searchParams);
  const data = courses ? JSON.parse(courses) : [];

  const getFilterUrl = ({ c }: { c?: string }) => {
    const params = new URLSearchParams();

    // mantener query actual
    if (searchParams.q && searchParams.q !== 'all') {
      params.set('q', searchParams.q);
    }

    // mantener o actualizar la categoría
    if (c && c !== 'all') {
      params.set('category', c);
    } else if (searchParams.category && searchParams.category !== 'all') {
      params.set('category', searchParams.category);
    }

    // resetear next para que empiece desde la página 1 otra vez
    params.set('next', '0');

    // return `/?${params.toString()}#filtros`;
    return `/?${params.toString()}#filtros`;
  };

  return (
    <>
      {/* Renderizamos el modal de Discord pasando el usuario de la sesión importamos con force dinamyc por que dependemos de la session del usuario*/}
      {session && <DiscordConnectModalOnce />}

      <div className="sm:px-4 md:px-0">
        {/* Modal de video (solo si ya se aceptaron/rechazaron las cookies) */}
        {/* <VideoModalIntro /> */}

        {/* TOP CARROUSEL CARDS HOME  MOBILE */}
        <div className={`${!session ? 'w-full mt-3' : 'md:pt-9'}  md:hidden  w-full pb-9`}>
          <CarouselBannerTop />
        </div>

        {session && (
          <>
            <div className="pb-5 hidden sm:block">
              <BigTitle
                className="text-2xl md:text-4xl break-all "
                title={`Hola, ${session?.user.firstName || session?.user.username}`}
              />
            </div>

            <TaskProgressTabs />
          </>
        )}

        {/* TOP CARROUSEL CARDS HOME  */}
        <div className={`${!session ? 'w-full mt-3' : 'md:pt-9'} hidden md:block  w-full`}>
          <CarouselBannerTop />
        </div>

        {/* CONTINUE LEARNING CARD */}

        <ContinueLearningHome />

        {/* CLASES EN VIVO */}
        <div className={`${!session ? 'pt-5' : 'pt-[36px]'} pl-4 sm:pl-0`}>
          <LastLiveClasses />
        </div>

        {/* SECCION COMPONENTE FILTROS HOME */}
        <div className={`${!session ? 'mb-8 md:mb-0' : 'mb-5 md:mb-0'} hidden sm:block`}>
          <div className="">{/* <Separator/> */}</div>

          <div className="flex md:gap-5 h-fit md:pb-9">
            <div id="cursos" className="flex space-x-2 overflow-auto w-full">
              {/* el h-14 marca los paddings del scroollbar */}
              <ScrollArea className="whitespace-nowrap rounded-md h-fit">
                <a href={'/?q=all&category=all#cursos'}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="py-[18px] hover:bg-muted hover:text-foregroun hover:bg-primary hover:text-[#A7A7A7] text-white text-sm mr-3 rounded-full px-4  h-8  font-poppins transition-colors dark:bg-card dark:text-white   dark:hover:bg-primary dark:bg-[#702DFF] bg-[#702DFF]"
                  >
                    Todos
                  </Button>
                </a>
                {categories.map((c: string) => (
                  <a key={c} href={getFilterUrl({ c })} rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'py-[18px] mr-3 rounded-full px-4 bg-white h-8 text-[10.48px] font-poppins transition-colors dark:bg-card dark:text-[#A7A7A7] text-black dark:hover:text-white dark:hover:bg-primary',
                        c === searchParams.category
                          ? 'hover:bg-primary/90 dark:bg-secondary dark:text-white ttext-xs sm:text-sm py-4'
                          : 'hover:bg-muted hover:text-foreground dark:hover:text-white hover:bg-primary hover:text-white text-[#A7A7A7] text-xs sm:text-sm'
                      )}
                    >
                      {c}
                    </Button>
                  </a>
                ))}
                <div className="pt-4 flex md:hidden">
                  <ScrollBar id="filtros" orientation="horizontal" />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <MediumTitle
          title="Cursos"
          className="relative text-lg md:text-[26px] sm:hidden px-4"
        />

        <div className="mt-3 md:mt-0 pl-4 sm:pl-0" id="filtros">
          {data.length > 0 ? (
            <InfiniteScrollComponent
              data={data}
              next_cursor={next_cursor}
              start_cursor={searchParams?.next}
              q={searchParams?.q}
              category={searchParams?.category}
            />
          ) : (
            <NoResults />
          )}
        </div>
      </div>
      <FooterColorSetter color="bg-[#F3F4F6]" />
    </>
  );
}
