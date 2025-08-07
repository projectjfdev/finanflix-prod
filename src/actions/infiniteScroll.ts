import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import UserCourse from '@/models/userCourseModel';
import { getServerSession } from 'next-auth';

connectDB();

const normalizeText = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export async function getAllCourses(searchParams: any) {
  const session = await getServerSession(authOptions);

  try {
    const limit = 3;
    const extendedLimit = limit + 1;
    const next = parseInt(searchParams?.next);
    const q = searchParams?.q || 'all';
    const category = searchParams?.category || 'all';

    const query: any = {};

    // Filtro por categoría exacta
    if (category !== 'all') {
      query.category = category;
    }

    if (!isNaN(next)) {
      query.orderIndex = { $gt: next }; // Pagina hacia adelante
    }

    // Buscar todos los cursos relevantes (hasta 100 para no traer todo)
    const rawCourses = await courseModel
      .find(query)
      .sort({ orderIndex: 1 })
      .limit(100)
      .select(
        '_id title description price thumbnail level orderIndex isVisibleToSubscribers sections outOfSale isOnlyForSubscribers'
      );

    // Filtrado por título insensible a tildes
    const normalizedQ = normalizeText(q);
    const coursesFiltered =
      q === 'all'
        ? rawCourses
        : rawCourses.filter(course => normalizeText(course.title).includes(normalizedQ));

    const hasMore = coursesFiltered.length > limit;
    const limitedCourses = hasMore ? coursesFiltered.slice(0, limit) : coursesFiltered;
    const next_cursor = hasMore ? limitedCourses[limit - 1].orderIndex : undefined;

    const enrolledCourses = session?.user?.enrolledCourses?.map((e: any) => e.toString()) || [];

    const data = await Promise.all(
      limitedCourses.map(async course => {
        const courseProgress = await UserCourse.findOne({
          courseId: course._id,
          userId: session?.user?._id,
        });

        const totalLessons = courseProgress?.progress?.reduce(
          (total: number, section: any) => total + (section.lessons?.length || 0),
          0
        );

        const viewedLessons = courseProgress?.progress?.reduce((total: number, section: any) => {
          const viewedInSection =
            section.lessons?.filter((lesson: any) => lesson.isViewed?.status).length || 0;
          return total + viewedInSection;
        }, 0);

        const completionPercentage =
          totalLessons === 0 ? 0 : Math.round((viewedLessons / totalLessons) * 100);

        return {
          ...course._doc,
          myCourses: enrolledCourses.includes(course._id.toString()),
          totalLessons,
          viewedLessons,
          completionPercentage,
        };
      })
    );

    return { courses: JSON.stringify(data), next_cursor };
  } catch (error: any) {
    return { errMsg: error.message };
  }
}

// freeLessons: {
//   $reduce: {
//     input: '$sections',
//     initialValue: [],
//     in: {
//       $concatArrays: [
//         '$$value',
//         {
//           $filter: {
//             input: '$$this.lessons',
//             as: 'lesson',
//             cond: { $eq: ['$$lesson.isFree', true] },
//           },
//         },
//       ],
//     },
//   },
// },

// const courses = await courseModel.aggregate([
//   { $match: query },
//   { $sort: { orderIndex: 1 } },
//   { $limit: extendedLimit },
//   {
//     $project: {
//       _id: 1,
//       title: 1,
//       description: 1,
//       price: 1,
//       thumbnail: 1,
//       level: 1,
//       orderIndex: 1,
//       isVisibleToSubscribers: 1,
//       sections: {
//         $map: {
//           input: '$sections',
//           as: 'section',
//           in: {
//             title: '$$section.title',
//             lessons: {
//               $filter: {
//                 input: '$$section.lessons',
//                 as: 'lesson',
//                 cond: { $eq: ['$$lesson.isFree', true] },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// ]);
