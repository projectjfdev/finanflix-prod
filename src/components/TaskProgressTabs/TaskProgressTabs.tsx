'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronsRight } from 'lucide-react';
import OnboardingModal from '../Modal/OnboardingModal';
import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useSession } from 'next-auth/react';
import { UniteADiscord } from '../Modal/UniteADiscord';
import { getOnboardingInfo } from '@/utils/Endpoints/configUserEndpoints';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface InfoOboardingProps {
  connectedToDiscord: boolean;
  perfilCompleted: boolean;
  preferences: boolean;
}

export default function TaskProgressTabs() {
  const { status, data: session } = useSession();
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const handleOnboardingOpenModal = () => setIsOnboardingModalOpen(true);
  const handleDiscordOpenModal = () => setIsDiscordModalOpen(true);
  const [taskProgress, setTaskProgress] = useState<InfoOboardingProps>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isJoined, setIsJoined] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isJoinedDiscord') === 'true';
    }
    return false;
  });

  // Revisar si el usuario ya se encuentra en el servidor de Discord
  const checkDiscordMembership = async () => {
    try {
      const res = await fetch('/api/discord/user-in-server');
      const data = await res.json();

      setIsJoined(data.isMember);
      if (data.isMember) {
        setIsJoined(true);
        localStorage.setItem('isJoinedDiscord', 'true');
      }
    } catch (error) {
      console.error('Error al verificar la membresía de Discord:', error);
    }
  };

  useEffect(() => {
    checkDiscordMembership();
  }, []);

  // Función para manejar el clic en "Aún tienes preferencias por completar"

  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  // const handleVideoCloseModal = (open: boolean) => setIsVideoModalOpen(open);

  const handleOnboardingCloseModal = (open: boolean) => setIsOnboardingModalOpen(open);

  const handleDiscordCloseModal = (open: boolean) => setIsDiscordModalOpen(open);
  // Dentro de tu componente

  const handleModalClick = () => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && !taskProgress?.preferences) {
      handleOnboardingOpenModal();
      return;
    }
  };

  const handleModalDiscord = () => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && !taskProgress?.connectedToDiscord) {
      handleDiscordOpenModal();
      return;
    }
  };

  const getInfo = async () => {
    try {
      const res = await getOnboardingInfo();

      setTaskProgress(res?.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error obteniendo información de onboarding:', error);
    }
  };

  const redirectPerfilCompleted = () => {
    if (status !== 'authenticated') {
      router.push('/login');
    }
    router.push('/editar-perfil');
  };

  {
    session?.user?.discordConnected === true
      ? 'DONE'
      : !!session?.user?.discordId &&
        !session?.user?.discordConnected &&
        session?.user?.suscription?.status === 'active'
        ? 'RECLAMAR ROL'
        : 'CONECTATE A DISCORD';
  }

  // const { completedTasks, totalTasks } = calculateProgress();

  const { completedTasks, totalTasks } = useMemo(() => {
    const totalTasks = 3;
    const completedTasks = [
      taskProgress?.perfilCompleted,
      taskProgress?.preferences,
      isJoined,
    ].filter(Boolean).length;
    return { completedTasks, totalTasks };
  }, [taskProgress, session, isJoined]);

  // if (isLoading) {
  //   return <OnboardingSkeletonLoader />;
  // }

  useEffect(() => {
    getInfo();
  }, []);

  if (isLoading) return null;

  if (completedTasks === totalTasks) {
    return <div></div>;
  }

  return (
    <div className="mx-auto ml-4 md:ml-0">
      <div className="flex items-center gap-2 pb-2">
        <p className="font-poppins text-xs whitespace-nowrap">
          TU PROGRESO {completedTasks}/{totalTasks}
        </p>
        {/* <Separator className="dark:bg-slate-200 flex-1 h-px sm:hidden" /> */}
      </div>

      <Tabs defaultValue="onboarding">
        <div className="flex justify-start items-start md:mb-3 ">
          <TabsList className="flex justify-start gap-2 w-full sm:w-auto sm:inline-flex font-poppins">
            <div>
              <Button
                value="onboarding"
                className="hover:bg-secondary bg-secondary hover:text-white h-8 text-white font-poppins text-xs sm:text-sm leading-tight sm:dark:bg-card"
              >
                Onboarding
              </Button>
            </div>

            <div className="sm:hidden">
              <Button
                value="onboarding"
                className="hover:bg-secondary  bg-secondary hover:text-white h-8 text-white font-poppins text-xs sm:text-sm leading-tight dark:bg-card"
              >
                Comenzá
              </Button>
            </div>

            <div className=" sm:hidden">
              <Button
                value="onboarding"
                className="hover:bg-secondary  bg-secondary hover:text-white h-8 text-white font-poppins text-xs sm:text-sm leading-tight dark:bg-card"
              >
                Explorá
              </Button>
            </div>
          </TabsList>
        </div>

        <Carousel
          plugins={[plugin.current]}
          onMouseLeave={plugin.current.reset}
          opts={{ align: 'start' }}
          orientation="horizontal"
          className="flex md:hidden md:pb-9 "
        >
          {/* ------------------------------  TABS PROGRESS MOBILE MODE ---------------------------------------------------- */}
          <CarouselContent className="mt-6 overflow-visible sm:gap-4">
            <CarouselItem className="basis-[60vw] md:basis-1/2 shrink-0">
              <Card
                className={` ${taskProgress ? '' : ''
                  } dark:bg-[#4C2FBA] bg-card-foreground  text-white px-5 pt-6 rounded-3xl sm:min-w-[300px] h-[185px] md:min-w-full w-full border-none transition-transform duration-300 ease-in-out hover:scale-[1.009]`}
              >
                <CardHeader>
                  <div className="w-full flex justify-between ">
                    <CardTitle className="text-[17px] sm:text-lg">Bienvenido </CardTitle>
                    <ChevronsRight className="hidden sm:block" />
                  </div>
                  <CardDescription className="text-[11px]  pb-4  text-white dark:text-muted-foreground font-poppins ">
                    Configura tu cuenta para una experiencia personalizada.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 w-full mt-6 sm:mt-0">
                  <div className="space-y-1 mt-[10px] ">
                    <p className="text-[12px] font-poppins">
                      {completedTasks}/{totalTasks}
                    </p>
                    <Progress
                      indicatorClassName="bg-green-500"
                      value={(completedTasks / totalTasks) * 100}
                      className="dark:bg-[#422b2b] bg-[#D9D9D9]  h-3 "
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="basis-[60vw] md:basis-1/2 shrink-0">
              <Card className="dark:bg-[#282844] bg-card text-white px-1 pt-5 rounded-3xl sm:min-w-[300px] h-[185px] md:min-w-full w-full  transition-transform duration-300 ease-in-out hover:scale-[1.009] hover:shadow-md">
                <CardHeader className="flex-grow px-5 relative top-1 space-y-1 ">
                  <p className=" dark:text-white text-[#71767F] text-[10.49px] font-poppins ">
                    Tarea 1
                  </p>
                  <CardTitle className="text-sm sm:text-md dark:text-white text-black font-poppins">
                    Completar Perfil
                  </CardTitle>
                  <CardDescription className=" dark:text-white text-[#71767F] dark:text-muted-foreground text-[11px] font-poppins  ">
                    Ingresa a tu cuenta y completa tu perfil.
                  </CardDescription>
                </CardHeader>

                <CardFooter className="mt-5 cursor-pointer w-full px-5">
                  <div className="w-full cursor-pointer py-4">
                    {/* hover:bg-[#4bbd3ac7] */}
                    <Button
                      className={cn(
                        'w-full text-white text-sm px-0 mx-0 flex ',
                        taskProgress?.perfilCompleted &&
                        'bg-[#4BBD3A] hover:bg-[#4BBD3A]  cursor-default'
                      )}
                      // disabled={taskProgress?.perfilCompleted}
                      onClick={redirectPerfilCompleted}
                    >
                      <span className="text-[11px] sm:text-sm  font-poppins">
                        {taskProgress?.perfilCompleted ? 'DONE' : 'COMPLETAR'}
                      </span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="basis-[60vw] md:basis-1/2 shrink-0">
              <Card className="dark:bg-[#282844] bg-card text-white px-1 pt-5 rounded-3xl sm:min-w-[300px] h-[185px] md:min-w-full w-full  transition-transform duration-300 ease-in-out hover:scale-[1.009] hover:shadow-md">
                <CardHeader className="flex-grow px-5 relative top-1 space-y-1">
                  <p className="dark:text-white text-[#71767F]  text-[10.49px] font-poppins">
                    Tarea 2
                  </p>
                  <CardTitle className="text-sm sm:text-md dark:text-white text-black font-poppins">
                    Elegir Preferencias
                  </CardTitle>
                  <CardDescription className=" dark:text-white text-[#71767F] dark:text-muted-foreground text-[11px] font-poppins ">
                    Personaliza tu experiencia según tus necesidades.
                  </CardDescription>
                </CardHeader>

                <CardFooter className="mt-5 cursor-pointer w-full px-5">
                  <div className="w-full cursor-pointer py-4">
                    <Button
                      disabled={taskProgress?.preferences}
                      onClick={handleModalClick}
                      className={cn(
                        'w-full text-white text-sm px-0 mx-0 flex ',
                        taskProgress?.preferences &&
                        'bg-[#4BBD3A] hover:bg-[#4BBD3A] cursor-default'
                      )}
                    // disabled={taskProgress?.preferences}

                    >
                      <span className="text-[11px] sm:text-sm font-poppins ">
                        {taskProgress?.preferences ? 'DONE' : 'ELEGIR'}
                      </span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="basis-[60vw] md:basis-1/2 shrink-0">
              <Card className="dark:bg-[#282844] bg-card text-white px-1 pt-5 rounded-3xl sm:min-w-[300px] h-[185px] md:min-w-full w-full  transition-transform duration-300 ease-in-out hover:scale-[1.009] hover:shadow-md">
                <CardHeader className="flex-grow px-5 relative top-1 space-y-1 w-full">
                  <p className="dark:text-white text-[#71767F]  text-[10.49px] font-poppins">
                    Tarea 3
                  </p>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <CardTitle className="text-sm sm:text-md dark:text-white text-black font-poppins">
                      {isJoined ? 'Conectado a Discord' : 'Unite a la comunidad'}
                    </CardTitle>
                  </div>
                  <CardDescription className=" dark:text-white text-[#71767F] dark:text-muted-foreground text-[11px] font-poppins ">
                    {isJoined ? 'Ya has conectado tu cuenta de Discord.' : 'Únete a nuestra comunidad en Discord.'}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="mt-5  w-full px-5 ">
                  <div className="w-full pt-5">
                    <Button
                      disabled={isJoined}
                      className={cn(
                        'w-full text-white text-sm cursor-pointer px-0 mx-0 flex relative bottom-1 sm:bottom-0 ',
                        isJoined
                          ? 'bg-[#4BBD3A] hover:bg-[#4BBD3A]'
                          : null
                      )}
                      onClick={handleModalDiscord}
                    >
                      <span className="text-[11px] sm:text-sm cursor-pointer font-poppins">
                        {isJoined
                          ? 'DONE'
                          : !!session?.user?.discordId &&
                            !session?.user?.discordConnected &&
                            (session?.user?.suscription?.status === 'active' ||
                              (Array.isArray(session?.user?.enrolledCourses) &&
                                session?.user?.enrolledCourses.length > 0))
                            ? session?.user?.suscription?.status === 'active'
                              ? 'RECLAMAR ROL'
                              : 'CONECTATE A DISCORD'
                            : 'CONECTATE A DISCORD'}
                      </span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </CarouselItem>
          </CarouselContent>

          <div className="hidden md:flex">
            <CarouselPrevious className="w-8 h-8 md:h-12 md:w-12  -translate-x-[-30px]  md:-translate-x-[-23px]  transform -translate-y-1/2 z-30 dark:hover:bg-[#A7A7A7]  hover:bg-[#A7A7A7] dark:bg-white bg-black dark:text-black text-white " />
            <CarouselNext className="w-8 h-8 md:h-12 md:w-12  -translate-x-[30px]  md:-translate-x-[23px]  transform -translate-y-1/2 z-30 dark:hover:bg-[#A7A7A7]  hover:bg-[#A7A7A7] dark:bg-white bg-black dark:text-black text-white" />
          </div>

          {/* <div className="flex md:hidden">
            <CarouselPrevious className="w-8 h-8 md:h-12 md:w-12  -translate-x-[-30px]  md:-translate-x-[-23px]  transform -translate-y-1/2 z-30 dark:hover:bg-gray-500  hover:bg-[#A7A7A7] dark:bg-gray-800 bg-black dark:text-white text-white " />
            <CarouselNext className="w-8 h-8 md:h-12 md:w-12  -translate-x-[30px]  md:-translate-x-[23px]  transform -translate-y-1/2 z-30 dark:hover:bg-gray-500  hover:bg-[#A7A7A7] dark:bg-gray-800 bg-black dark:text-white text-white" />
          </div> */}
        </Carousel>

        {/* ------------------------------  TABS PROGRESS DESK MODE ---------------------------------------------------- */}

        <TabsContent
          value="onboarding"
          className="p-0 m-0 h-full w-full relative bottom-3 hidden md:flex overflowx-visible"
        >
          <ScrollArea className=" flex h-full w-full pt-2">
            <div className="flex md:grid h-full w-full sm:grid-cols-2 xxl:grid-cols-2 xxxl:grid-cols-4 gap-7 border border-none">
              <Card className="dark:bg-[#4C2FBA] bg-card-foreground text-white  px-5 pt-6 rounded-3xl sm:min-w-[300px] h-[200px] md:min-w-full  w-full border-none transition-transform duration-300 ease-in-out  ">
                <CardHeader>
                  <CardTitle className="text-lg">Bienvenido </CardTitle>
                  <CardDescription className="text-sm  pb-4  text-white dark:text-muted-foreground font-poppins ">
                    Configura tu cuenta para una experiencia personalizada.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 w-full ">
                  <div className="space-y-1 mt-[18px] ">
                    <p className="text-[12px] font-poppins">
                      {completedTasks}/{totalTasks}
                    </p>
                    <Progress
                      indicatorClassName="bg-[#F03300] "
                      value={(completedTasks / totalTasks) * 100}
                      className="dark:bg-[#7D69CA] bg-[#7D69CA] h-3 "
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-[#282844] bg-card text-white  px-1 pt-5 rounded-3xl sm:min-w-[300px] h-[200px]  md:min-w-full  w-full  transition-transform duration-300 ease-in-out hover:scale-[1.009] ">
                <CardHeader className="flex-grow px-5 relative top-2 ">
                  <p className=" dark:text-white text-[#71767F] text-sm font-poppins ">Tarea 1</p>
                  <CardTitle className="text-md   dark:text-white text-black font-poppins">
                    Completar Perfil
                  </CardTitle>
                  <CardDescription className=" dark:text-white text-[#71767F] dark:text-muted-foreground text-sm font-poppins  ">
                    Ingresa a tu cuenta y completa tu perfil.
                  </CardDescription>
                </CardHeader>

                <CardFooter className="w-full px-5">
                  <div className="w-full  py-5">
                    <Button
                      className={cn(
                        `w-full text-white text-sm px-0 mx-0 flex relative top-1 dark:hover:bg-[rgba(240, 52, 0, 1)`,
                        taskProgress?.perfilCompleted && 'bg-[#4BBD3A] cursor-default'
                      )}
                      disabled={taskProgress?.perfilCompleted}
                      style={{
                        opacity: taskProgress?.perfilCompleted ? 1 : undefined,
                      }}
                      onClick={redirectPerfilCompleted}
                    >
                      <span className="text-sm font-poppins dark:hover:text-[#e9e9e9]">
                        {taskProgress?.perfilCompleted ? 'DONE' : 'COMPLETAR'}
                      </span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="dark:bg-[#282844] bg-card text-white  px-1   pt-5 rounded-3xl sm:min-w-[300px] h-[200px] md:min-w-full  w-full  transition-transform duration-300 ease-in-out hover:scale-[1.009]">
                <CardHeader className="flex-grow px-5 relative top-1">
                  <p className="relative top-1 dark:text-white text-[#71767F]  text-sm font-poppins">
                    Tarea 2
                  </p>
                  <CardTitle className="text-md dark:text-white text-black font-poppins">
                    Elegir Preferencias
                  </CardTitle>
                  <CardDescription className=" dark:text-white text-[#71767F] dark:text-muted-foreground text-sm font-poppins ">
                    Personaliza tu experiencia según tus necesidades.
                  </CardDescription>
                </CardHeader>

                <CardFooter className="  w-full px-5">
                  <div className="w-full  pt-5">
                    <Button
                      disabled={taskProgress?.preferences}
                      onClick={handleModalClick}
                      className={cn(
                        `w-full text-white text-sm px-0 mx-0 flex relative top-1 dark:hover:bg-[rgba(240, 52, 0, 1) cursor-pointer`,
                        taskProgress?.preferences &&
                        'bg-[#4BBD3A] cursor-default dark:hover:bg-[#4BBD3A]'
                      )}
                      style={{
                        opacity: taskProgress?.perfilCompleted ? 1 : undefined,
                      }}
                    >
                      <span
                        className={`${taskProgress?.preferences
                          ? 'text-sm  font-poppins '
                          : 'text-sm  font-poppins dark:hover:text-[#e9e9e9]'
                          }  `}
                      >
                        {taskProgress?.preferences ? 'DONE' : 'ELIGE TUS PREFERENCIAS'}
                      </span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              <Card className="dark:bg-[#282844] bg-card text-white  px-1   pt-5 rounded-3xl min-w-[300px] h-[200px]  md:min-w-full  w-full  transition-transform duration-300 ease-in-out hover:scale-[1.009] ">
                <CardHeader className="flex-grow px-5 relative top-1">
                  <p className="relative top-1 dark:text-white text-[#71767F]  text-sm font-poppins">
                    Tarea 3
                  </p>
                  <CardTitle className="text-md dark:text-white text-black font-poppins">
                    Conectate a Discord
                  </CardTitle>
                  <CardDescription className=" dark:text-white text-[#71767F] dark:text-muted-foreground text-sm font-poppins ">
                    Únete a nuestra comunidad
                  </CardDescription>
                </CardHeader>

                <CardFooter className="mt-5  w-full px-5">
                  <div className="w-full py-4">
                    <Button
                      disabled={isJoined}
                      className={cn(
                        `w-full text-white text-sm px-0 mx-0 flex relative top-1 dark:hover:bg-none cursor-pointer`,
                        isJoined
                          ? 'bg-[#4BBD3A] cursor-default  dark:hover:bg-[#4BBD3A]'
                          : null
                      )}
                      onClick={handleModalDiscord}
                    >
                      <span
                        className={`${taskProgress?.connectedToDiscord
                          ? 'text-sm  font-poppins '
                          : 'text-sm  font-poppins dark:hover:text-[#e9e9e9]'
                          }  `}
                      >
                        {isJoined ? 'DONE' : 'UNITE A LA COMUNIDAD'}
                      </span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="md:hidden">
              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* <VideoModal isOpen={isVideoModalOpen} onOpenChange={handleVideoCloseModal} /> */}
      <OnboardingModal isOpen={isOnboardingModalOpen} onOpenChange={handleOnboardingCloseModal} />
      <UniteADiscord
        isActive={
          session?.user?.suscription?.status === 'active' &&
          new Date(session?.user?.suscription?.endDate) > new Date()
        }
        isOpen={isDiscordModalOpen}
        onOpenChange={handleDiscordCloseModal}
      />
    </div>
  );
}
