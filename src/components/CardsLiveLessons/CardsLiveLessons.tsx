import React from 'react';
import { Card } from '../ui/card';
import MediumTitle from '../MediumTitle/MediumTitle';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { ILiveLesson } from '@/interfaces/liveLesson';
import liveLessonModel from '@/models/liveLessonModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getImageByCategoryRectangular } from '@/utils/LiveLessonsImages/LiveLessonsImages';
import { hasSubscription } from '@/utils/HasSubscription';

export default async function CardsLiveLessons() {
  const classes: ILiveLesson[] = await liveLessonModel.find().sort({ createdAt: -1 }).limit(3);
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* <div className="dark:bg-background bg-white hidden 2xl:flex absolute left-[-450px] w-[calc(100vw+350px)] min-h-[100vh] h-[100vh] -z-40 "></div> */}
      {hasSubscription(session) ? (
        // Contenido de las clases en vivo
        <div className="lg:pr-0 mx-auto w-full py-5 md:py-10">
          {/* CONTAINER BLANCO BACKGROUND */}
          {/* <div className="dark:bg-background bg-white hidden 2xl:flex absolute left-[-450px] w-[calc(100vw+350px)] min-h-[100vh] h-[100vh] -z-40"></div> */}
          <div className=" pb-5 md:pb-10">
            <MediumTitle title="Clases en Vivo" className=" text-3xl md:text-[32px] font-bold " />
            <p className="text-[#A7A7A7] text-[14px] md:text-[18px] w-full py-2 font-poppins">
              Únete a nuestras clases en vivo y perfecciona tus habilidades para convertirte en un
              trader experto.
            </p>
          </div>

          <div className="flex justify-between">
            <Link
              href="/clases-en-vivo"
              className="dark:text-white text-black  hover:text-primary/90 flex items-center gap-2 relative top-1 font-groteskBook20 leading-tight text-base  dark:hover:text-[#A7A7A7]   "
            >
              Ver todas
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <section className="course-area rounded-md grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {classes?.map((liveClass, index) => (
              <section key={index}>
                <div className="pt-5">
                  <Link
                    href={`/clase-en-vivo/${liveClass._id}?videoUrl=${liveClass.videoUrl
                      .split('/')
                      .pop()}`}
                  >
                    <Card className="dark:bg-card bg-white rounded-3xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
                      <Image
                        alt="Publica un Análisis de Trading Diario"
                        className="w-full h-[240px]"
                        height={450}
                        src={getImageByCategoryRectangular(liveClass.category)}
                        // src={"/images/ver.jpg"}
                        width={600}
                      />
                      <div className="pt-4 bg-none pl-4 pb-4 space-y-1">
                        <h2 className="text-lg dark:text-white text-black font-groteskMedium20 truncate">
                          {liveClass?.title}
                        </h2>
                        <p className="text-gray-400  bg-transparent truncate">
                          {/* {liveClass.description.length > 100
                            ? liveClass.description.substring(0, 100) + '...'
                            : liveClass.description || 'N/A'} */}
                          {liveClass?.description}
                        </p>

                        {/* <div className="flex gap-1 items-center text-gray-400"> */}
                        <div className="flex gap-1 items-center">
                          <Clock size={12} />
                          <p className="text-gray-400 bg-transparent flex items-center gap-1">
                            <span className="mr-1">Fecha de creación:</span>
                            {liveClass?.lessonDate
                              ? new Date(liveClass.lessonDate).toLocaleDateString()
                              : 'Fecha no disponible'}
                          </p>
                        </div>
                        {/* </div> */}
                      </div>
                    </Card>
                  </Link>
                </div>
              </section>
            ))}
          </section>
        </div>
      ) : null}
    </>
  );
}
