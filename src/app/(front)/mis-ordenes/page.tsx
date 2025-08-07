import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { TooltipAprender } from '@/components/TooltipAprender/TooltipAprender';
import moment from 'moment';
import orderModel from '@/models/orderModel';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { IOrder } from '@/interfaces/order';
import courseModel from '@/models/courseModel';
import DownloadOrderPDF from '@/components/DownloadOrderPDF/DownloadOrderPDF';
import BigTitle from '@/components/BigTitle/BigTitle';
import exchangeRate from '@/models/exchangeRate';
import { IExchangeRate } from '@/interfaces/exchangeRate';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';

interface IOrderPopulated extends Omit<IOrder, 'courseId'> {
  courseId: { title: string };
}

export default async function PageMisOrdenes() {
  const session = await getServerSession(authOptions);

  const exchangeRateData: IExchangeRate | null = await exchangeRate.findOne({});
  const rate = exchangeRateData?.rate;
  const myOrders: IOrderPopulated[] = await orderModel
    .find({
      userId: session?.user?._id.toString(),
      $or: [{ status: 'Pagado' }, { 'serviceDetail.type': 'PayPal' }], // TRAE LAS ORDENES DE MERCADOPAGO YA QUE TIENE EL ATRIBUTO STATUS PAGADO - PAYPAL NO LO TIENE POR ENDE SE UTILIZA SERVICEDETAIL
    })
    .populate({
      path: 'courseId',
      select: 'title',
      model: courseModel,
    });

  if (!session) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80 rounded-lg  ">
        <div className="w-full bg-background  rounded-lg ">
          {/* <h1 className="text-3xl md:text-4xl font-bold text-center py-6 text-foreground">
          Órdenes de Compra
        </h1> */}
          <BigTitle
            className="text-2xl md:text-4xl font-bold text-center text-foreground "
            title="Órdenes de Compra"
          />
        </div>

        <div className="container mx-auto mt-8 pb-5 overflow-hidden">
          <ScrollArea className="w-full rounded-md ">
            <Tabs defaultValue="all-courses" className="w-full p-1 ">
              <TabsList className="w-full flex gap-5 justify-start  ">
                <Link href={'/mis-cursos'}>
                  <TabsTrigger
                    className="dark:bg-card bg-secondary text-white py-1 hover:text-opacity-80"
                    value="my-lists"
                  >
                    Mis cursos
                  </TabsTrigger>
                </Link>
                <Link href={'/clases-en-vivo'}>
                  <TabsTrigger
                    className="dark:bg-card py-1 bg-secondary text-white hover:text-opacity-80"
                    value="wishlist"
                  >
                    Clases en vivo
                  </TabsTrigger>
                </Link>
                <Link href={'/mis-ordenes'}>
                  <TabsTrigger
                    className="dark:bg-card py-1 bg-secondary text-white hover:text-opacity-80"
                    value="learning-tools"
                  >
                    Mis Órdenes
                  </TabsTrigger>
                </Link>
                <Link href={'https://soporte-finanflix.vercel.app/'} target="_blank">
                  <TabsTrigger
                    className="dark:bg-card py-1 bg-secondary text-white hover:text-opacity-80"
                    value="learning-tools"
                  >
                    Soporte
                  </TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
            <div className="pt-5">
              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>

          <div className="pt-3 md:pt-0">
            <TooltipAprender
              showButtons={false}
              title="Gestiona tus órdenes fácilmente"
              text="Consulta el estado y los detalles de tus órdenes en cualquier momento. Administra y realiza el seguimiento de tus compras de forma eficiente."
            />
          </div>

          {/* ORDENES */}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 mt-8 gap-10">
            {myOrders?.map(order => (
              <Card
                key={order?._id?.toString() as string}
                className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-full"
              >
                <CardContent className="flex-grow p-6 space-y-4">
                  <h3 className="text-base font-semibold text-foreground line-clamp-2">
                    ID de la Orden:
                    <span className="italic"> "{order?._id?.toString()}"</span>
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Producto:</span>
                    <span className="text-sm text-foreground font-semibold line-clamp-1">
                      {order?.courseId?.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Precio:</span>
                    <span className="text-sm font-bold text-foreground">
                      {order.currency === 'USD'
                        ? `$${order?.price} USD`
                        : `$${(order.price * Number(rate)).toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                          })} ARS`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Metodo de Pago:
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {order.serviceDetail.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Fecha de Orden:
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {moment(order.createdAt).format('DD MMM, YYYY')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Descargar la Orden</p>
                    <div className="text-lg font-bold text-foreground">
                      <DownloadOrderPDF
                        createdAt={order?.createdAt}
                        id={order?._id?.toString() as string}
                        courseTitle={order?.courseId?.title}
                        currency={order?.currency}
                        price={order?.price}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 bg-muted/50">
                  {/* Asistencia con enlace */}
                  <div className="mt-4 text-center text-sm text-muted-foreground w-full">
                    <p>
                      Si tienes algún inconveniente con tu orden de compra, puedes comunicarte con
                      nosotros a través
                    </p>
                    <Link
                      href="https://soporte-finanflix.vercel.app"
                      target="_blank"
                      className="text-primary hover:underline "
                    >
                      de nuestro portal de soporte
                    </Link>{' '}
                    para recibir asistencia personalizada.
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <FooterColorSetter color="bg-[#F3F4F6]" />
    </>
  );
}
