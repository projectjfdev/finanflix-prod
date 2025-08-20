'use client';

import useInView from '@/hooks/useInView';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { CardInfiniteScroll } from './CardInfiniteScroll';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const InfiniteScrollComponent = ({ data, next_cursor, start_cursor, q, category }: any) => {
  const router = useRouter();
  const [courses, setCourses] = useState(data);
  const [loading, setLoading] = useState(false);
  const isLoadMore = useRef(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { ref, inView } = useInView();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleHorizontalScroll = () => {
    if (!isMobile || loading || !next_cursor) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      handleLoadMore();
    }
  };
  // console.log(data);

  useEffect(() => {
    const next = searchParams.get('next');
    if (next && next !== '0') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('next', '0');
      window.location.href = `${pathname}`;
    }
  }, []);

  async function handleLoadMore() {
    if (!next_cursor) return; // No hay más cursos

    setLoading(true);
    isLoadMore.current = true;

    const params = new URLSearchParams();

    params.set('next', next_cursor.toString());

    // Mantiene los filtros actuales en la URL
    params.set('q', q || 'all');
    params.set('category', category || 'all');

    router.push(`?${params.toString()}#filtros`, { scroll: false });
  }

  useEffect(() => {
    if (!isLoadMore.current) return;

    // Aquí actualizamos el estado de los cursos con los nuevos que llegaron
    setCourses((prevCourses: any) => {
      const existingIds = new Set(prevCourses.map((c: any) => c._id));
      const newCourses = data.filter((c: any) => !existingIds.has(c._id));
      return [...prevCourses, ...newCourses];
    });

    setLoading(false);
    isLoadMore.current = false;
  }, [data]);

  useEffect(() => {
    if (!start_cursor) {
      setCourses(data);
    }
  }, [start_cursor]);

  useEffect(() => {
    if (!isMobile && inView) {
      handleLoadMore();
    }
  }, [inView, isMobile]);
  return (
    <>
      {isMobile ? (
        <div className="relative w-full">
          <div
            className="flex overflow-x-auto space-x-4 w-full pb-4"
            ref={scrollContainerRef}
            onScroll={handleHorizontalScroll}
          >
            {courses.map((course: any, i: number) => (
              <div key={i} className="min-w-[250px] flex-shrink-0">
                <CardInfiniteScroll
                  _id={course?._id?.toString()}
                  videoId={course.trailer?.split('/')?.pop()}
                  thumbnail={course?.thumbnail?.url}
                  title={course.title}
                  outOfSale={course.outOfSale}
                  isOnlyForSubscribers={course.isOnlyForSubscribers}
                  description={course.description as string}
                  price={course.price}
                  isVisibleToSubscribers={course.isVisibleToSubscribers}
                  myCourses={course.myCourses}
                  viewedLessons={course.viewedLessons}
                  totalLessons={course.totalLessons}
                  completionPercentage={course.completionPercentage}
                  level={course.level as string}
                  sections={course.sections}
                />
              </div>
            ))}
          </div>

          {/* Spinner en mobile encima del scroll horizontal */}
          {(next_cursor || loading) && loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-white/60 dark:bg-black/60">
              {loading && <LoadingFinanflix />}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-9">
          {courses.map((course: any, i: number) => (
            <div key={i}>
              <CardInfiniteScroll
                _id={course?._id?.toString()}
                videoId={course.trailer?.split('/')?.pop()}
                thumbnail={course?.thumbnail?.url}
                title={course.title}
                outOfSale={course.outOfSale}
                isOnlyForSubscribers={course.isOnlyForSubscribers}
                description={course.description as string}
                price={course.price}
                isVisibleToSubscribers={course.isVisibleToSubscribers}
                myCourses={course.myCourses}
                viewedLessons={course.viewedLessons}
                totalLessons={course.totalLessons}
                completionPercentage={course.completionPercentage}
                level={course.level as string}
                sections={course.sections}
              />
            </div>
          ))}
        </div >
      )}

      {/* esta validacion esta para que no renderize mas el componente si termino de cargar */}
      {
        (next_cursor || loading) && (
          <button
            disabled={loading}
            onClick={handleLoadMore}
            ref={ref}
            className="w-full inset-0 md:flex md:items-center md:justify-center z-10 py-7 hidden "
          >
            {loading ? <LoadingFinanflix /> : ''}
          </button>
        )
      }
    </>
  );
};
