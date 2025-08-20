'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import type { ILiveLesson } from '@/interfaces/liveLesson';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/es';
import { getImageByCategory } from '@/utils/LiveLessonsImages/LiveLessonsImages';
import { ModalUnsubscribed } from './ModalUnsubscribed';
import { ChevronRight, Star } from 'lucide-react';

interface Props {
  classes: ILiveLesson[];
  hasSubscription: boolean;
}

export default function MobileLiveClassesCard({ classes, hasSubscription }: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleClassClick = (e: React.MouseEvent, href: string) => {
    if (!hasSubscription) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="flex gap-3 sm:hidden  overflow-x-auto  pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 ">
        {classes.map(item => (
          <Card
            key={item._id.toString()}
            className="overflow-hidden rounded-2xl flex-shrink-0 w-80"
          >
            <CardContent className="p-0">
              <Link
                href={`/clase-en-vivo/${item._id}?videoUrl=${item.videoUrl.split('/').pop()}`}
                onClick={e => handleClassClick(e, item._id.toString())}
              >
                <div className="flex items-stretch p-3 gap-3">
                  {/* Imagen */}
                  <div className="relative w-[70px] h-[70px] flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={getImageByCategory(item.category) || '/placeholder.svg'}
                      alt={item.title || 'Clase en vivo'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 space-y-1 sm:space-y-0">
                    <h3 className="font-poppins font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.lessonDate
                        ? (() => {
                          const fecha = moment(item.lessonDate).locale('es');
                          const diaSemana = fecha.format('dddd');
                          const mes = fecha.format('MMM');
                          const dia = fecha.format('D');
                          const anio = fecha.format('YYYY');
                          const capitalizar = (texto: string) =>
                            texto.charAt(0).toUpperCase() + texto.slice(1);
                          return `${capitalizar(diaSemana)}, ${capitalizar(
                            mes
                          )} ${dia} de ${anio}`;
                        })()
                        : 'Fecha no disponible'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Flecha alineada abajo */}
                  <div className="flex flex-col justify-end">
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <ModalUnsubscribed isOpen={showModal} onOpenChange={setShowModal} />
    </>
  );
}
