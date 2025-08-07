import { cache } from "react";
import { connectDB } from "@/lib/dbConfig";
import { IOrder } from "@/interfaces/order";
import orderModel from "@/models/orderModel";

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
  const payment = await orderModel.findOne({ _id: id }).lean();
  return payment as IOrder | null; // Asegura el tipo de retorno
});

// const getRelatedServices = cache(
//   async (categoryUser: string, userId: string) => {
//     await connectDB();
//     const services = await courseModel
//       .find({ category: categoryUser, userId: { $ne: userId } })
//       .exec();

//     return services;
//   }
// );

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

    const usernames = await orderModel.find().distinct("username");
    const paymentMethods = await orderModel.find().distinct("paymentMethod");
    const payments = await orderModel
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

    const countPayments = await orderModel.countDocuments({
      ...queryFilter,
      ...usernameFilter,
      ...priceFilter,
      ...paymentMethodFilter,
    });

    return {
      payments: payments,
      countPayments,
      page,
      pages: Math.ceil(countPayments / PAGE_SIZE),
      usernames,
      paymentMethods,
    };
  }
);

const getUsernames = cache(async () => {
  await connectDB();
  const usernames = await orderModel.find().distinct("username");
  return usernames;
});

const getPaymentMethod = cache(async () => {
  await connectDB();
  const paymentMethod = await orderModel.find().distinct("paymentMethod");
  return paymentMethod;
});

const paymentsService = {
  getById,
  getByQuery,
  getUsernames,
  getPaymentMethod,
};
export default paymentsService;
