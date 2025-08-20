'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ILiveLesson } from '@/interfaces/liveLesson';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/es';
import { getImageByCategory } from '@/utils/LiveLessonsImages/LiveLessonsImages';
import { ModalUnsubscribed } from './ModalUnsubscribed'; // Importá tu modal

interface Props {
  classes: ILiveLesson[];
  hasSubscription: boolean;
}

export default function LiveClassesGrid({ classes, hasSubscription }: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleClassClick = (e: React.MouseEvent, href: string) => {
    if (!hasSubscription) {
      e.preventDefault(); // Bloquea la navegación
      setShowModal(true); // Muestra el modal
    }
  };

  return (
    <>
      <div className="max-sm:hidden sm:grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {classes.map(item => (
          <Card key={item._id.toString()} className="overflow-hidden rounded-3xl h-full">
            <CardContent className="p-0 flex flex-col h-full">
              <Link
                href={`/clase-en-vivo/${item._id}?videoUrl=${item.videoUrl.split('/').pop()}`}
                onClick={e => handleClassClick(e, item._id.toString())}
              >
                <div className="relative aspect-video">
                  <Image
                    src={getImageByCategory(item.category)}
                    alt={item.title || 'Clase en vivo'}
                    fill
                    className="md:object-cover md:object-left"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-poppins">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.lessonDate
                      ? moment(item.lessonDate).locale('es').format('D [de] MMMM [de] YYYY')
                      : 'Fecha no disponible'}
                  </p>
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
