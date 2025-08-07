import { cache } from 'react';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import { ICourse } from '@/interfaces/course';

// Si tienes una página que combina tanto SSR como CSR, puedes usar revalidate en la parte del servidor, pero el contenido que se renderiza solo en el cliente no será afectado por esto.
export const revalidate = 3600; // Revalida la página cada 1 hora, se usa solo en "use server"

// const getLatest = cache(async () => {
//   await connectDB();
//   const services = await servicesModel
//     .find({})
//     .sort({ _id: -1 })
//     .limit(6)
//     .lean();
//   return services as IServices[];
// });

const getById = cache(async (id: string): Promise<ICourse | null> => {
  await connectDB();
  const course = await courseModel.findOne({ _id: id }).lean();
  return course as ICourse | null; // Asegura el tipo de retorno
});

// const getOtherServicesById = cache(
//   async (userId: string, excludedMyServiceId: string) => {
//     await connectDB();
//     const excludedServiceId = excludedMyServiceId;
//     const services = await courseModel
//       .find({ userId: userId, _id: { $ne: excludedServiceId } })
//       .exec();

//     return services;
//   }
// );

// const getRelatedServices = cache(
//   async (categoryUser: string, userId: string) => {
//     await connectDB();
//     const services = await courseModel
//       .find({ category: categoryUser, userId: { $ne: userId } })
//       .exec();

//     return services;
//   }
// );

const getCoursesNames = cache(async () => {
  await connectDB();
  const coursesNames = await courseModel.find({}, { _id: 1, title: 1 }).lean();
  return coursesNames;
});

const PAGE_SIZE = 9;
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    page = '1',
  }: {
    q: string;
    category: string;
    price: string;
    sort: string;
    page: string;
  }) => {
    await connectDB();

    const queryFilter =
      q && q !== 'all'
        ? {
            $or: [
              {
                title: {
                  $regex: q,
                  $options: 'i',
                },
              },
              {
                subtitle: {
                  $regex: q,
                  $options: 'i',
                },
              },
            ],
          }
        : {};
    // const outOfSaleFilter = { outOfSale: { $ne: true } };
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const order: Record<string, 1 | -1> =
      sort === 'Menor precio'
        ? { price: 1 }
        : sort === 'Mayor precio'
        ? { price: -1 }
        : sort === 'Alfabéticamente Asc. (A → Z)'
        ? { title: 1 }
        : sort === 'Alfabéticamente Des. (Z ← A)'
        ? { title: -1 }
        : { orderIndex: 1 };

    const categories = await courseModel.find().distinct('category');
    const courses = await courseModel
      .find(
        {
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          // ...outOfSaleFilter,
        }
        // "-review"
      )
      .collation({ locale: 'en', strength: 2 })
      .sort(order)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean();

    const countCourses = await courseModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      // ...outOfSaleFilter,
    });

    return {
      courses: courses,
      countCourses,
      page,
      pages: Math.ceil(countCourses / PAGE_SIZE),
      categories,
    };
  }
);

const getCategories = cache(async () => {
  await connectDB();
  const categories = await courseModel.find({ outOfSale: { $ne: true } }).distinct('category');
  return categories;
});

const getCoursesBySubscription = cache(
  async ({ subscription, page = '1' }: { subscription: string; page: string }) => {
    await connectDB();

    // Extraer solo el nombre de la suscripción (sin "- mensual")
    const cleanSubscription = subscription.split(' - ')[0];

    const courses = await courseModel
      .find({
        isVisibleToSubscribers: { $in: [cleanSubscription] },
      })
      .collation({ locale: 'en', strength: 2 })
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean();

    const countCourses = await courseModel.countDocuments({
      isVisibleToSubscribers: { $in: [cleanSubscription] },
    });

    return {
      courses,
      page,
      pages: Math.ceil(countCourses / PAGE_SIZE),
    };
  }
);

const courseService = {
  getById,
  getByQuery,
  getCategories,
  getCoursesNames,
  getCoursesBySubscription,
};
export default courseService;
