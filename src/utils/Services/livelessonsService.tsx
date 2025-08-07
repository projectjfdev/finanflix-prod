import { cache } from 'react';
import { connectDB } from '@/lib/dbConfig';
import { ILiveLesson } from '@/interfaces/liveLesson';
import liveLessonModel from '@/models/liveLessonModel';

// Si tienes una página que combina tanto SSR como CSR, puedes usar revalidate en la parte del servidor, pero el contenido que se renderiza solo en el cliente no será afectado por esto.
export const revalidate = 3600; // Revalida la página cada 1 hora, se usa solo en "use server"

const getById = cache(async (id: string): Promise<ILiveLesson | null> => {
  await connectDB();
  const liveLesson = await liveLessonModel.findOne({ _id: id }).lean();
  return liveLesson as ILiveLesson | null; // Asegura el tipo de retorno
});

const deleteById = cache(async (id: string): Promise<ILiveLesson | null> => {
  await connectDB();
  const liveLesson = await liveLessonModel.findOneAndDelete({ _id: id });
  return liveLesson as ILiveLesson | null; // Asegura el tipo de retorno
});

const PAGE_SIZE = 9;
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    page = '1',
  }: {
    q: string;
    category: string;
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
                description: {
                  $regex: q,
                  $options: 'i',
                },
              },
            ],
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};

    const order: Record<string, 1 | -1> =
      sort === 'Alfabéticamente Asc. (A → Z)'
        ? { title: 1 }
        : sort === 'Alfabéticamente Des. (Z ← A)'
        ? { title: -1 }
        : { _id: -1 };

    const categories = await liveLessonModel.find().distinct('category');
    const liveLessons = await liveLessonModel
      .find(
        {
          ...queryFilter,
          ...categoryFilter,
        }
        // "-review"
      )
      .collation({ locale: 'en', strength: 2 })
      .sort(order)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean();

    const countLiveLessons = await liveLessonModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
    });

    return {
      liveLessons: liveLessons,
      countLiveLessons,
      page,
      pages: Math.ceil(countLiveLessons / PAGE_SIZE),
      categories,
    };
  }
);

const customOrder = [
  'Trading con Guchi',
  'Mercados financieros',
  'Análisis fundamental',
  'DeFi',
  'Coaching',
  'Cómo conseguir trabajo remoto',
  'Inteligencia artificial',
  'NFT/Gaming',
  'Seguridad',
];

const getCategories = cache(async () => {
  await connectDB();
  const categories = await liveLessonModel.find().distinct('category');

  const orderedCategories = categories.sort((a, b) => {
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return orderedCategories;
});

// const getCategories = cache(async () => {
//   await connectDB();
//   const categories = await liveLessonModel.find().distinct('category');
//   return categories;
// });

const liveLessonService = {
  getById,
  getByQuery,
  getCategories,
  deleteById,
};
export default liveLessonService;
