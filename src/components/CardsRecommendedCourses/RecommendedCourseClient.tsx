'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/card';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { ModalMoreInfo } from '../CardsCourses/ModalMoreInfo';
import { ICourse } from '@/interfaces/course';

interface Props {
  course: ICourse;
}

export const RecommendedCourseCard = ({ course }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="dark:bg-card bg-white rounded-3xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
      >
        <Image
          alt={course?.title}
          className="w-full h-[240px] filter grayscale brightness-90"
          height="450"
          src={course?.thumbnail?.url}
          width="600"
        />
        <div className="pt-4 bg-none pl-4 pb-4 space-y-1">
          <h2 className="text-base md:text-lg dark:text-white text-black font-groteskMedium20">
            {course.title}
          </h2>
          <p className="text-sm md:text-base text-gray-400 bg-transparent">{course?.category}</p>
        </div>
      </Card>

      <ModalMoreInfo
        sections={course.sections!}
        open={open}
        onOpenChange={setOpen}
        _id={course._id.toString()}
        title={course.title}
        description={course.description as string}
        thumbnail={course.thumbnail.url}
        userHasSubscription={false} // ajustá según lógica real
        myCourses={false} // ajustá según lógica real
        handleRedirectBtn={() => {
          window.open(
            'https://api.whatsapp.com/send?phone=5491134895722&text=%C2%A1Hola!%20Estoy%20interesado%20en%20el%20curso...',
            '_blank'
          );
        }}
      />
    </>
  );
};
