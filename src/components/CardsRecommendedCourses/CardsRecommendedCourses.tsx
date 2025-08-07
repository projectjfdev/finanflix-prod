import React from 'react';
import courseModel from '@/models/courseModel';
import { ICourse } from '@/interfaces/course';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { RecommendedCourseCard } from './RecommendedCourseClient';

const CardsRecommendedCourses = async () => {
  const session = await getServerSession(authOptions);
  // session.user.enrolledCourses: array de cursos en los que el usuario está inscrito
  const rawCourses = await courseModel.aggregate([
    {
      $match: {
        _id: { $nin: session?.user.enrolledCourses || [] },
        // outOfSale: { $ne: true }, // 👈 excluye cursos en outOfSale
      },
    },
    { $sample: { size: 3 } },
  ]);
  const courses: ICourse[] = JSON.parse(JSON.stringify(rawCourses));

  return (
    <div className="mx-auto bg-transparent">
      <section className="rounded-md flex flex-col gap-10">
        <div className="md:px-0 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 dark:bg-transparent">
          {courses?.map((course, index) => (
            <RecommendedCourseCard key={index} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CardsRecommendedCourses;
