import { ICourse } from '@/interfaces/course';
import { authOptions } from '@/lib/authOptions';
import UserCourse from '@/models/userCourseModel';
import { getServerSession } from 'next-auth';
import { OnMouseHover } from './OnMouseHover';

export const revalidate = 3600;
// export const revalidate = 0; // Esto fuerza a que siempre se obtengan datos frescos

export default async function CardsCourses({ course }: { course: ICourse }) {
  const session = await getServerSession(authOptions);

  const courseProgress = await UserCourse.findOne({
    courseId: course._id,
    userId: session?.user?._id,
  });
  // .lean(); // Evita almacenar en caché el documento en Mongoose
  const totalLessons = courseProgress?.progress?.reduce(
    (total: number, section: any) => total + (section.lessons?.length || 0),
    0
  );

  // NIVEL DEL CURSO
  const levelCourse = course.level;
  // console.log(levelCourse, "nivel");

  const viewedLessons = courseProgress?.progress?.reduce((total: number, section: any) => {
    const viewedInSection =
      section.lessons?.filter((lesson: any) => lesson.isViewed?.status).length || 0;
    return total + viewedInSection;
  }, 0);

  function calculateCompletionPercentage(totalLessons: number, viewedLessons: number): number {
    if (totalLessons === 0) return 0; // Evitar división por cero
    return Math.round((viewedLessons / totalLessons) * 100); // Redondear porcentaje
  }

  const completionPercentage = calculateCompletionPercentage(totalLessons || 0, viewedLessons || 0);

  const myCourses = session?.user?.enrolledCourses?.some(
    (e: any) => e.toString() === course._id.toString()
  );

  return (
    <div
    // href={myCourses ? `/curso/${course?._id}` : `/checkout/${course?._id}`}
    // passHref
    >
      <OnMouseHover
        _id={course._id.toString()}
        videoId={course.trailer?.split('/')?.pop()}
        thumbnail={course?.thumbnail?.url}
        title={course.title}
        description={course.description as string}
        price={course.price}
        isVisibleToSubscribers={course.isVisibleToSubscribers}
        myCourses={myCourses}
        viewedLessons={viewedLessons}
        totalLessons={totalLessons}
        completionPercentage={completionPercentage}
        level={levelCourse as string}
      />
    </div>
  );
}
