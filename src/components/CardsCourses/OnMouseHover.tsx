'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import VimeoTrailer from '@/utils/VimeoPlayer/VimeoTrailer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CirclePlus, Lock, Unlock } from 'lucide-react';
import { Schema } from 'mongoose';
import { createCourseProgressForSuscriptions } from '@/utils/Endpoints/coursesEndpoint';
import { ModalMoreInfo } from './ModalMoreInfo';

interface Props {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
  myCourses: boolean | undefined;
  viewedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  isVisibleToSubscribers?: string[];
  videoId: any; // TODO: Asignar un tipo más específico
  level: string; // Add level prop
}

export const OnMouseHover = ({
  _id,
  thumbnail,
  title,
  description,
  price,
  myCourses,
  viewedLessons,
  totalLessons,
  completionPercentage,
  isVisibleToSubscribers = [],
  videoId,
  level, // Destructure the level prop
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga

  // Función para verificar si el usuario tiene una suscripción válida
  const hasUserSubscription = (
    isVisibleToSubscribers: string[],
    userType: string | undefined
  ): boolean => {
    if (!userType) return false;

    // Extraemos la parte relevante del tipo de suscripción del usuario
    const baseSubscriptionType = userType.split(' - ')[0]?.toLowerCase();

    if (!baseSubscriptionType) return false;
    return isVisibleToSubscribers.some(sub => sub.toLowerCase().includes(baseSubscriptionType));
  };

  // Función para verificar si el usuario está inscrito en un curso
  const isUserEnrolled = (
    enrolledCourses: Schema.Types.ObjectId[] | undefined,
    courseId: string
  ): boolean => {
    return enrolledCourses?.some(course => course.toString() === courseId) ?? false;
  };

  const userType = session?.user?.suscription?.type;
  const userHasSubscription = hasUserSubscription(isVisibleToSubscribers, userType);

  // Maneja la redirección según el estado del curso y la suscripción
  const handleRedirectBtn = async (id: string) => {
    setIsLoading(true); // Inicia el proceso de carga

    const userId = session?.user._id.toString();
    const enrolledCourses = session?.user?.enrolledCourses as Schema.Types.ObjectId[] | undefined;

    const myCourse = isUserEnrolled(enrolledCourses, id);

    // Si es suscriptor, crea el progreso del curso si es que no lo tiene y entra
    if (userHasSubscription) {
      // console.log(userHasSubscription);
      const data = { courseId: id, userId };
      await createCourseProgressForSuscriptions(data);
      router.push(`/curso/${id}`);
      // Si compró el curso, pasa
      setIsLoading(false); // Finaliza la carga
    } else if (myCourse) {
      router.push(`/curso/${id}`);
      // Si no compró el curso ni es suscriptor, va para el checkout
      setIsLoading(false); // Finaliza la carga
    } else {
      window.open(
        'https://api.whatsapp.com/send?phone=5491134895722&text=%C2%A1Hola!%20Estoy%20interesado%20en%20el%20curso...',
        '_blank'
      );
      // router.push(
      //   'https://api.whatsapp.com/send?phone=5491134895722&text=%C2%A1Hola!%20Estoy%20interesado%20en%20el%20curso...'
      // );
      // router.push(`/checkout/${id}?step=billing`);
      setIsLoading(false); // Finaliza la carga
    }
  };

  // Controla el comportamiento del mouse al pasar por el card
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 1000); // Esperar 1 segundo antes de activar el video
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Cancelar el timeout si el mouse se va antes de 1 segundo
    }
    setIsHovered(false); // Desactivar el video al salir
  };

  // console.log(description, "descripciion");

  return (
    <>
      <Card
        onMouseEnter={handleMouseEnter}
        onClick={() => handleRedirectBtn(_id)}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer overflow-hidden dark:bg-card dark:border-gray-800 border-slate-200 border  hover:shadow-xl duration-300 group rounded-[30.46px] transform transition-all ease-in-out"
        style={{ transition: 'transform 0.3s ease-in-out' }}
      >
        <CardContent className="h-full">
          <div className="relative aspect-[2/1] pt-1">
            {isHovered && videoId ? (
              <div className="p-4 h-[240px] w-full">
                <VimeoTrailer videoId={videoId} />
              </div>
            ) : (
              <Image
                src={thumbnail}
                alt={title || 'Imagen del curso'}
                width={270}
                height={400}
                className="p-[18px] rounded-[30.46px] h-[240px] w-full"
                priority
              />
            )}
          </div>

          <div className="px-[18px] pb-[18px] space-y-2">
            {/* Titulo del curso */}

            <TooltipProvider delayDuration={500}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="text-lg  dark:text-white text-black leading-tight font-groteskMedium20 truncate">
                    {title.length > 25 ? `${title.slice(0, 25)}...` : title}
                  </h3>
                  {/* */}
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Si tiene cursos o suscripcion */}

            {myCourses || userHasSubscription ? (
              <div className="space-y-4">
                {/* <div className="space-y-4" onClick={() => handleRedirectBtn(_id)}> */}
                {/* TODO: Hacer condicion para que si no hay progreso del curso del usuario, que no se vea el siguiente p: */}

                {totalLessons ? (
                  <p className="text-sm text-slate-400 font-poppins pb-2">
                    {viewedLessons} de {totalLessons} lecciones completadas
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 font-poppins pb-2">Comenzar a ver</p>
                )}

                <div className="w-full">
                  <Progress
                    value={completionPercentage}
                    className="h-2 dark:bg-[#474666] bg-[#D9D9D9] w-full"
                  />
                </div>

                <div className="pt-1 w-[200px] flex gap-4 items-center">
                  {/* <Button
                  onClick={() => handleRedirectBtn(_id)}
                  className="text-sm flex px-5 py-2 space-y-2 bg-[#4A90E2] rounded-full text-white font-poppins hover:bg-[#3f7abe] hover:text-white"
                >
                  <Unlock size={16} className="mr-2 " />
                  Ver Curso
                </Button> */}
                  {/* <Link
                  href={`/curso/${_id}`}
                  className="text-sm flex px-5 py-2 space-y-2 bg-[#4A90E2] rounded-full text-white font-poppins hover:bg-[#3f7abe] hover:text-white"
                >
                  <Unlock size={16} className="mr-2 " />
                  Ver Curso
                </Link> */}
                  {/* <ModalMoreInfo
                  thumbnail={thumbnail}
                  description={description}
                  title={title}
                  myCourses={myCourses}
                  userHasSubscription={userHasSubscription}
                  _id={_id}
                  handleRedirectBtn={handleRedirectBtn}
                /> */}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-400 font-poppins pb-2">Nivel: {level}</p>

                <div className="w-full">
                  <Progress
                    value={completionPercentage}
                    className="h-2 dark:bg-[#474666] bg-[#474666] w-full"
                  />
                </div>

                <div className="pt-1 w-[150px]">
                  {/* Quitar esto cuando se ponga de nuevo el boton */}
                  <div className="font-poppins px-4 rounded-full" />
                  <div className="flex gap-4 items-center">
                    <Button
                      // className="text-xs flex px-5 py-2 space-y-2 bg-[#161c24] rounded-full text-white font-poppins hover:bg-secondary hover:text-white"
                      className="text-white text-sm dark:bg-[#4BBD3A] bg-[#4BBD3A] dark:hover:bg-[#4bbd3ac7] hover:bg-[#4bbd3ac7] font-poppins py-2 px-4 rounded-full"
                      onClick={() => handleRedirectBtn(_id)}
                    >
                      <Lock size={16} className="mr-2" />
                      <span>Comprar</span>
                    </Button>
                    <div>
                      <ModalMoreInfo
                        thumbnail={thumbnail}
                        description={description}
                        title={title}
                        myCourses={myCourses}
                        userHasSubscription={userHasSubscription}
                        _id={_id}
                        handleRedirectBtn={handleRedirectBtn}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
