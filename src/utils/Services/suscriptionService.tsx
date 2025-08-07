import { cache } from "react";
import { connectDB } from "@/lib/dbConfig";
import { IOrder } from "@/interfaces/order";
import suscriptionOrderModel from "@/models/suscriptionOrderModel";

export const revalidate = 3600;

// const getLatest = cache(async () => {
//   await connectDB();
//   const services = await servicesModel
//     .find({})
//     .sort({ _id: -1 })
//     .limit(6)
//     .lean();
//   return services as IServices[];
// });

const getById = cache(async (id: string): Promise<IOrder | null> => {
  await connectDB();
  const payment = await suscriptionOrderModel.findOne({ _id: id }).lean();
  return payment as IOrder | null; // Asegura el tipo de retorno
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

const getSuscriptionsNames = cache(async () => {
  await connectDB();
  const suscriptionsNames = await suscriptionOrderModel.find({}, { _id: 1, title: 1 }).lean();
  return suscriptionsNames;
});


const PAGE_SIZE = 6;
const getByQuery = cache(
  async ({
    q,
    username,
    paymentMethod,
    sort,
    price,
    page = "1",
  }: {
    q: string;
    username: string;
    paymentMethod: string;
    price: string;
    sort: string;
    page: string;
  }) => {
    await connectDB();

    const queryFilter =
      q && q !== "all"
        ? {
            $or: [
              {
                username: {
                  $regex: q,
                  $options: "i",
                },
              },
              {
                _id: {
                  $regex: q,
                  $options: "i",
                },
              },
            ],
          }
        : {};
    const usernameFilter = username && username !== "all" ? { username } : {};
    const paymentMethodFilter =
      paymentMethod && paymentMethod !== "all" ? { paymentMethod } : {};
    const priceFilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const order: Record<string, 1 | -1> =
      sort === "Menor precio"
        ? { price: 1 }
        : sort === "Mayor precio"
        ? { price: -1 }
        : { _id: -1 };

    const usernames = await suscriptionOrderModel.find().distinct("username");
    const paymentMethods = await suscriptionOrderModel.find().distinct("paymentMethod");
    const suscriptions = await suscriptionOrderModel
      .find(
        {
          ...queryFilter,
          ...usernameFilter,
          ...priceFilter,
          ...paymentMethodFilter,
        }
        // "-review"
      )
      .collation({ locale: "en", strength: 2 })
      .sort(order)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean();

    const countSuscriptions = await suscriptionOrderModel.countDocuments({
      ...queryFilter,
      ...usernameFilter,
      ...priceFilter,
      ...paymentMethodFilter,
    });

    return {
      suscriptions: suscriptions,
      countSuscriptions,
      page,
      pages: Math.ceil(countSuscriptions / PAGE_SIZE),
      usernames,
      paymentMethods,
    };
  }
);

const getUsernames = cache(async () => {
  await connectDB();
  const usernames = await suscriptionOrderModel.find().distinct("username");
  return usernames;
});

const getPaymentMethod = cache(async () => {
  await connectDB();
  const paymentMethod = await suscriptionOrderModel.find().distinct("paymentMethod");
  return paymentMethod;
});

const suscriptionService = {
  getById,
  getByQuery,
  getUsernames,
  getPaymentMethod,
  getSuscriptionsNames
};
export default suscriptionService;
