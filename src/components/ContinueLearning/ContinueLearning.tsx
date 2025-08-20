'use client';

import { ChevronRight, Info, Unlock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { getCoursesInProgress } from '@/utils/Endpoints/coursesEndpoint';
import type { ILessons } from '@/interfaces/course';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import ContinueLearningSkeleton from '../Skeletons/ContinueLearningSkeleton';
import MediumTitle from '../MediumTitle/MediumTitle';

interface CoursesResponse {
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
  }[];
  message: string;
  success: boolean;
}

const ContinueLearning = () => {
  const [continueLearningCourses, setContinueLearningCourses] = useState<CoursesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastViewedIndexes, setLastViewedIndexes] = useState<Record<string, string>>({});

  const getCourses = async () => {
    const res = await getCoursesInProgress();
    setContinueLearningCourses(res);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (!continueLearningCourses?.data?.length) return;

    const newIndexes: Record<string, string> = {};

    continueLearningCourses.data.forEach((course) => {
      const storedIndex = localStorage.getItem(`course-${course.courseId}-last-lesson-index`);
      if (storedIndex) {
        newIndexes[course.courseId] = storedIndex;
      }
    });

    setLastViewedIndexes(newIndexes);
  }, [continueLearningCourses]);





  useEffect(() => {
    getCourses();
  }, []);

  const encodeUrl = (url: string) => Buffer.from(url).toString('base64');


  if (isLoading) {
    return <ContinueLearningSkeleton />;
  }





  return (
    <>
      {continueLearningCourses && continueLearningCourses.data?.length > 0 && (
        <div>
          {/* <div className="pb-3 flex flex-col md:flex-row justify-center md:justify-between">
            <MediumTitle title="Continuar aprendiendo" className='text-[22px] ' />

            <Link
              href="/mis-cursos"
              className="dark:text-white text-black hover:text-primary/90 flex items-center gap-2 relative top-1 font-groteskBook20 leading-tight text-base dark:hover:text-[#A7A7A7]   "
            >
              Ver cursos
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
          </div> */}

          <section className="md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9 sm:gap-9">
              {continueLearningCourses.data.map((course, index) => (
                <Card
                  key={index}
                  className="w-full md:max-w-md ml-0 flex-shrink-0 flex flex-col dark:bg-card bg-white overflow-hidden shadow-md rounded-xl sm:rounded-2xl md:transition-transform md:duration-300 md:ease-in-out md:hover:scale-105 hover:shadow-lg py-4 sm:py-0 snap-start"
                >
                  <CardContent className="flex flex-col h-full p-0">
                    {/* Header Section */}
                    <div className="sm:p-4 px-2 pb-4 pt-0 md:pt-4 flex items-center gap-2 sm:gap-3">
                      <div className="sm:w-16 w-14 md:w-[68px] h-8 md:h-9 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={course.thumbnail.url || '/placeholder.svg'}
                          alt="Imagen del curso"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0 dark:text-white text-black space-y-1 ">
                        <h3 className="font-medium text-sm xl:text-base truncate">
                          {course.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {course.lessonsCompleted} de {course.totalLessons} lecciones completadas
                        </p>
                        <Progress
                          value={(course.lessonsCompleted / course.totalLessons) * 100}
                          className="h-1 mt-1 dark:bg-[#D9D9D9] bg-[#D9D9D9]"
                        />
                      </div>
                    </div>

                    {/* Feature Image */}
                    <div className="relative aspect-[2/1] 2xl:h-[225px]">
                      <Image
                        src={course.thumbnail.url || '/placeholder.svg'}
                        alt="Imagen del curso"
                        fill
                        className="w-full h-full rounded-tl-xl rounded-tr-xl sm:rounded-tl-2xl sm:rounded-tr-2xl"
                      />
                    </div>

                    {/* Footer Section */}
                    <div className="p-2 sm:p-4 flex flex-col flex-grow ml-1 sm:ml-0">
                      <div className="sm:mb-2 dark:text-white text-black">
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Lección {lastViewedIndexes[course.courseId] ? String(Number(lastViewedIndexes[course.courseId]) + 1).padStart(2, '0') : '01'}
                        </p>
                        <div className="flex items-center justify-between">
                          <h3 className="text-base md:text-md lg:text-lg font-medium truncate pt-2">
                            {/* {course?.nextLesson?.title || course?.title} */}
                            {course?.title}
                          </h3>
                          <Link
                            href={
                              course?.nextLesson?.videoUrl
                                ? `/curso/${course.courseId}?videoUrl=${course?.nextLesson?.videoUrl
                                  .split('/')
                                  .pop()}&lessonId=${course?.nextLesson?._id}`
                                : course?.nextLesson?.textContent
                                  ? `/curso/${course.courseId}?textContent=${encodeUrl(
                                    course?.nextLesson?.textContent.replace(/^https?:\/\//, '')
                                  )}`
                                  : `/curso/${course.courseId}`
                            }
                          >
                            <ChevronRight className="w-4 h-4 " />
                          </Link>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Info className="flex-shrink-0 w-4 h-4" />
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Tu clase está actualmente en Lección {lastViewedIndexes[course.courseId] ? String(Number(lastViewedIndexes[course.courseId]) + 1).padStart(2, '0') : '01'}
                          </p>
                        </div>
                      </div>
                      <Separator className="dark:bg-gray-600 my-2" />
                      <div className="flex items-start gap-1 sm:gap-2 mt-1 sm:mt-2 dark:text-white text-black ">
                        <Link
                          href={
                            course?.nextLesson?.videoUrl
                              ? `/curso/${course.courseId}?videoUrl=${course?.nextLesson?.videoUrl
                                .split('/')
                                .pop()}&lessonId=${course?.nextLesson?._id}`
                              : course?.nextLesson?.textContent
                                ? `/curso/${course.courseId}?textContent=${encodeUrl(
                                  course?.nextLesson?.textContent.replace(/^https?:\/\//, '')
                                )}`
                                : `/curso/${course.courseId}`
                          }
                          className="text-xs md:text-sm text-muted-foreground rounded-full py-2 px-5 items-center justify-center flex dark:border-gray-600 border-gray-800 dark:hover:bg-[#3f7abe] hover:text-white bg-[#4A90E2] text-white dark:text-white "
                        >
                          <Unlock size={16} className="mr-2 text-xs md:text-sm" />
                          Ver Curso
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ContinueLearning;
