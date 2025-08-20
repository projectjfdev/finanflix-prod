'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Progress } from '../ui/progress';
import VimeoTrailer from '@/utils/VimeoPlayer/VimeoTrailer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Schema } from 'mongoose';
import { createCourseProgressForSuscriptions } from '@/utils/Endpoints/coursesEndpoint';
import { ModalMoreInfo } from './ModalMoreInfo';

import { ISection } from '@/interfaces/course';

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
  videoId: any;
  level: string;
  sections: ISection[];
  outOfSale?: boolean;
  isOnlyForSubscribers?: boolean;
}

export const CardInfiniteScroll = ({
  _id,
  thumbnail,
  title,
  description,
  myCourses,
  viewedLessons,
  totalLessons,
  completionPercentage,
  isVisibleToSubscribers = [],
  videoId,
  sections,
  outOfSale,
  isOnlyForSubscribers,
  level, // Destructure the level prop
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const [isModalOpen, setIsModalOpen] = useState(false); // dispara el modal que contiene mas informacion

  // Función para verificar si el usuario tiene una suscripción válida
  const hasUserSubscription = (
    isVisibleToSubscribers: string[],
    subscriptionType: string | undefined
  ): boolean => {
    if (!subscriptionType) return false;

    // Extraemos la parte relevante del tipo de suscripción del usuario
    const baseSubscriptionType = subscriptionType.split(' - ')[0]?.toLowerCase();

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

  const userStatus = session?.user?.suscription?.status || ''; // 'active', 'expired', etc.
  const subscriptionType = session?.user?.suscription?.type || ''; // 'Suscripcion basic - mensual', etc.

  const userHasSubscription =
    userStatus === 'active' &&
    hasUserSubscription(isVisibleToSubscribers, subscriptionType);


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

  // Función para abrir el modal
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        className="cursor-pointer overflow-hidden dark:bg-card w-[300px] md:w-auto dark:border-gray-800 border-slate-200 border hover:shadow-xl duration-300 group rounded-[30.46px] transform transition-all ease-in-out"
        style={{ transition: 'transform 0.3s ease-in-out' }}
        key={_id}
      >
        <CardContent className="h-full">
          {/* IMAGEN MOBILE */}
          <div
            className="relative pt-1 rounded-[30.46px] overflow-hidden block md:hidden"
            style={{ height: '190px' }}
          >
            {isHovered && videoId ? (
              <VimeoTrailer videoId={videoId} />
            ) : (
              <Image
                src={thumbnail}
                alt={title || 'Imagen del curso'}
                fill
                className={`p-[18px] rounded-[30.46px] ${!(myCourses || userHasSubscription) ? 'filter grayscale brightness-90' : ''
                  }`}
                priority
              />
            )}
          </div>

          {/* IMAGEN DESKTOP */}
          <div className="relative aspect-[3/2] pt-1 rounded-[30.46px] overflow-hidden hidden md:block">
            {isHovered && videoId ? (
              <div className="absolute inset-0">
                <VimeoTrailer videoId={videoId} />
              </div>
            ) : (
              <Image
                src={thumbnail}
                alt={title || 'Imagen del curso'}
                fill
                className={`p-[18px] rounded-[30.46px] ${!(myCourses || userHasSubscription) ? 'filter grayscale brightness-90' : ''
                  }`}
                priority
              />
            )}
          </div>

          <div className="px-[18px] pb-[18px] space-y-2">
            <TooltipProvider delayDuration={500}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="text-base sm:text-lg dark:text-white text-black leading-tight font-groteskMedium20 truncate">
                    {title?.length > 25 ? `${title.slice(0, 25)}...` : title}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {myCourses || userHasSubscription ? (
              <div className="space-y-3">
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
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-400 font-poppins pb-2">Nivel: {level}</p>

                <div className="pt-1 w-[150px]">
                  <div className="font-poppins px-4 rounded-full" />
                  <div className="flex gap-4 items-center"></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
            <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"></div>
          </div>
        )}
      </Card>

      <ModalMoreInfo
        thumbnail={thumbnail}
        description={description}
        title={title}
        myCourses={myCourses}
        sections={sections}
        userHasSubscription={userHasSubscription}
        _id={_id}
        outOfSale={outOfSale}
        isOnlyForSubscribers={isOnlyForSubscribers}
        handleRedirectBtn={handleRedirectBtn}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};
