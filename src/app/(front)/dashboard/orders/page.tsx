import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownWideNarrow, Eye, GraduationCap, SearchX } from 'lucide-react';

import ExportOrdersToExcel from '@/components/ExportToExcel/ExportOrdersToExcel';
import { FormValidateOfflineCourse } from '@/components/FormValidateOfflineCourse/FormValidateOfflineCourse';
import { MainPagination } from '@/components/MainPagination/MainPagination';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { NoResults } from '@/components/NoResults/NoResults';
import { Loading } from '@/utils/Loading/Loading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import exchangeRate from '@/models/exchangeRate';
import courseService from '@/utils/Services/courseService';
import paymentsService from '@/utils/Services/paymentsService';
import SmallTitle from '@/components/SmallTitle/SmallTitle';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// TODO: CAMBIOS TEST

export default async function OfflinePayments({
  searchParams,
}: {
  searchParams: {
    q?: string;
    username?: string;
    paymentMethod?: string;
    price?: string;
    sort?: string;
    page?: string;
  };
}) {
  const {
    q = 'all',
    username = 'all',
    paymentMethod = 'all',
    price = 'all',
    sort = 'newest',
    page = '1',
  } = searchParams;

  const getFilterUrl = ({
    u,
    m,
    s,
    p,
    pg,
  }: {
    u?: string;
    m?: string;
    s?: string;
    p?: string;
    pg?: string;
  }) => {
    const params = { q, username, paymentMethod, price, sort, page };
    if (u) params.username = u;
    if (m) params.paymentMethod = m;
    if (p) params.price = p;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/dashboard/orders?${new URLSearchParams(params).toString()}#filtros`;
  };

  try {
    const [usernames, paymentMethods, { countPayments, payments, pages }, coursesNames] =
      await Promise.all([
        paymentsService.getUsernames(),
        paymentsService.getPaymentMethod(),
        paymentsService.getByQuery({
          username,
          paymentMethod,
          q,
          price,
          page,
          sort,
        }),
        courseService.getCoursesNames(),
        exchangeRate.findOne({}),
      ]);

    const plainCoursesNames = coursesNames.map((course: any) => ({
      ...course,
      _id: course._id.toString(),
    }));

    const sortOrders = ['Pagos recientes', 'Menor precio', 'Mayor precio'];

    return (
      <section className="w-full ml-4 md:ml-8">
        <div className="dark:bg-background ">
          <div className="flex justify-between items-center">
            <div className="text-left text-lg font-semibold text-gray-900 flex justify-between w-full items-center pb-3 dark:hover:bg-transparent">
              <MediumTitle title="Órdenes de compra" className="dark:text-white text-black" />
            </div>
          </div>
        </div>

        <Card
          id="filtros"
          className="dark:bg-background bg:white px-5 w-full pb-6 pt-6 overflow-hidden dark:text-white text-black"
        >
          <section className="flex flex-col md:flex-row md:justify-end gap-3 ">
            <Select>
              <SelectTrigger className="w-[220px] ">
                <SelectValue
                  placeholder={
                    paymentMethod === 'all' ? 'Filtrar por método de pago' : paymentMethod
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <Link
                    className={`link link-hover ${'all' === paymentMethod && 'text-secondary'}`}
                    href={getFilterUrl({ m: 'all' })}
                  >
                    <SelectLabel className="list-none pl-2 dark:hover:bg-gray-800 hover:bg-gray-100 dark:text-white text-black font-normal">
                      Todos los metodos de pago
                    </SelectLabel>
                  </Link>
                  {paymentMethods.map((m: string) => (
                    <Link
                      key={m}
                      className={`${m === paymentMethod && 'text-secondary'}`}
                      href={getFilterUrl({ m })}
                    >
                      <SelectLabel className="list-none pl-2 dark:hover:bg-gray-800 hover:bg-gray-100 dark:text-white text-black font-normal">
                        {m}
                      </SelectLabel>
                    </Link>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={username === 'all' ? 'Filtrar por usuario' : username} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <Link
                    className={`link link-hover ${'all' === username && 'text-secondary'}`}
                    href={getFilterUrl({ u: 'all' })}
                  >
                    <SelectLabel className="list-none pl-2 dark:hover:bg-gray-800 hover:bg-gray-100 dark:text-white text-black font-normal">
                      Todos los usuarios
                    </SelectLabel>
                  </Link>
                  {usernames.map((u: string) => (
                    <Link
                      key={u}
                      className={`${u === username && 'text-secondary'}`}
                      href={getFilterUrl({ u })}
                    >
                      <SelectLabel className="list-none pl-2 dark:hover:bg-gray-800 hover:bg-gray-100 font-normal">
                        {u}
                      </SelectLabel>
                    </Link>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </section>

          <ScrollArea className="whitespace-nowrap rounded-md py-3">
            <section id="cripto">
              <section className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-end">
                <section className="mb-3">
                  <Card className="hidden md:flex dark:bg-background bg:white rounded-md p-2 mb-3 px-5 ">
                    <p className="dark:text-gray-500 text-black text-xs italic py-1 ">
                      * En caso de que el usuario haya pagado, otorgarle el curso o suscripción
                      correspondiente
                    </p>
                  </Card>
                  <Card className="dark:bg-background bg:white rounded-md p-2 md:mb-3 px-5 md:w-1/3">
                    <p className="flex gap-2 items-center dark:text-white text-black">
                      <GraduationCap size={20} className="text-yellow-300 " />
                      Pendiente{' '}
                    </p>
                    <p className="flex gap-2 items-center dark:text-white text-black">
                      <GraduationCap size={20} className="text-secondary" />
                      Pagado
                    </p>
                  </Card>
                </section>
                <section className="flex items-end justify-end py-4 mb-3">
                  <section className="flex items-center border dark:bg-background bg:white rounded-md p-2 px-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <ArrowDownWideNarrow />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sortOrders.map(s => (
                          <Link
                            key={s}
                            className={`${sort == s ? 'text-primary' : ''} `}
                            href={getFilterUrl({ s })}
                          >
                            <DropdownMenuItem>{s}</DropdownMenuItem>
                          </Link>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="font-bold dark:text-white text-black mr-1">
                      {payments.length === 0 ? 'No' : countPayments} Resultados
                    </span>
                    {q !== 'all' && q !== '' && ' - ' + q}
                    {paymentMethod !== 'all' && ' - ' + paymentMethod}
                    {price !== 'all' && ' - Price ' + price}
                    &nbsp;
                    {(q !== 'all' && q !== '') || paymentMethod !== 'all' || price !== 'all' ? (
                      <Link href="/dashboard/orders">
                        <Button variant="outline">
                          Eliminar filtros <SearchX size={15} className="ml-1" />
                        </Button>
                      </Link>
                    ) : null}
                  </section>
                </section>
              </section>

              <Suspense fallback={<Loading size="40" />}>
                {payments.length > 0 ? (
                  <section className="overflow-x-auto mr-10 md:mr-0">
                    <Table className="w-full divide-y dark:divide-gray-900 pt-2">
                      <TableBody className="divide-y dark:divide-gray-900 dark:text-white">
                        <TableRow>
                          <TableCell className="p-0 ">
                            <section className="border dark:border-gray-700 border-gray-200 rounded-lg overflow-hidden ">
                              {payments?.map((payment: any, index) => (
                                <Accordion
                                  type="single"
                                  collapsible
                                  key={index}
                                  className="dark:bg-background bg-white border-none w-full"
                                >
                                  <AccordionItem
                                    value={`item-${index}`}
                                    className="border-b dark:border-gray-800 border-gray-200 last:border-b-0 dark:text-white text-black"
                                  >
                                    <AccordionTrigger className="px-6 py-4 transition-colors border">
                                      <section className="flex justify-between items-center w-full shadow-none">
                                        <p className="text-left font-medium">
                                          Orden de compra de{' '}
                                          <span className="font-semibold">
                                            {payment?.username}:
                                          </span>
                                        </p>
                                        <section className="dark:text-white text-gray-400 flex gap-3 items-center mr-3">
                                          <section className="border p-2 rounded-md">
                                            <GraduationCap
                                              size={18}
                                              className={`${cn(
                                                payment.status === 'Pagado'
                                                  ? 'text-secondary'
                                                  : 'text-yellow-300'
                                              )}`}
                                            />
                                          </section>
                                          <section className="border p-2 rounded-md">
                                            <Eye size={18} />
                                          </section>
                                        </section>
                                      </section>
                                    </AccordionTrigger>

                                    <AccordionContent className="px-6 py-4 dark:bg-background dark:hover:bg-transparent bg-white shadow-none dark:text-white text-black">
                                      <section className="overflow-x-auto">
                                        <Table className="w-full divide-y dark:divide-gray-900">
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="py-3 text-left text-sm font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                                INFO
                                              </TableHead>
                                              <TableHead className="py-3 text-right text-sm font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                                Detalle
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900 ">
                                                Id de la orden
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <p className="truncate cursor-help">
                                                        {payment?._id.toString()}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      {payment?._id.toString()}
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Producto
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <p className="truncate cursor-help">
                                                        {payment?.orderTitle}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      {payment?.title || 'Proposal'} with{' '}
                                                      {payment?.username}
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Nombre del Cliente
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <p className="truncate cursor-help">
                                                        {payment?.username}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      {payment?.title || 'Proposal'} with{' '}
                                                      {payment?.username}
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Estado de la orden
                                              </TableCell>
                                              <TableCell className="py-4 text-right w-full flex justify-end ">
                                                <Link
                                                  href={'#'}
                                                  role="button"
                                                  tabIndex={0}
                                                  className={`font-semibold pointer-events-auto dark:bg-card bg-background py-3 rounded-full px-5 transition-all ${
                                                    payment?.status === 'Canceled'
                                                      ? 'border-red-500 text-red-500 bg-red-50 dark:bg-card border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
                                                      : payment?.status === 'Pending'
                                                      ? 'border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-card border'
                                                      : payment?.status === 'Paid'
                                                      ? 'border-green-500 text-green-500 bg-green-50 dark:bg-card border'
                                                      : 'Orden no existente'
                                                  }`}
                                                >
                                                  <p>
                                                    {payment.status
                                                      ? payment.status
                                                      : 'Estado no Disponible'}{' '}
                                                  </p>
                                                </Link>
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Precio
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm font-semibold dark:text-white text-gray-900">
                                                {payment?.price}{' '}
                                                {payment?.currency === 'USD' ? 'USD' : 'AR'}
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Método de Pago
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                {payment.paymentMethod}
                                                {payment.paymentMethod === 'Service' &&
                                                  ' - ' + payment.serviceDetail.type}
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Fecha de creacion
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                <p className="truncate cursor-help">
                                                  {payment?.createdAt.toLocaleDateString()}
                                                </p>
                                              </TableCell>
                                            </TableRow>

                                            {payment?.image && (
                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Comprobante de pago
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  <Link
                                                    className="inline-block px-4 py-2 bg-secondary text-white rounded-full hover:bg-primary"
                                                    href={payment?.image?.url}
                                                    target="_blank"
                                                  >
                                                    Ver
                                                  </Link>
                                                </TableCell>
                                              </TableRow>
                                            )}

                                            {/* DATOS FORMULARIO OFFLINE */}

                                            <TableRow>
                                              <TableCell>
                                                <SmallTitle title="Datos Formulario Cursos Offline" />
                                              </TableCell>
                                            </TableRow>
                                            <Separator />

                                            <>
                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Email del cliente
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {payment?.email}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Dni
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {payment?.dni}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Código Postal
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {payment?.postalCode}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Domicilio
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {payment?.address}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  País
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {payment?.country}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Teléfono
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {`${payment?.phone?.countryCode} ${payment?.phone?.number}`}
                                                </TableCell>
                                              </TableRow>
                                            </>

                                            {payment.paymentMethod === 'Offline' ? (
                                              <FormValidateOfflineCourse
                                                status={payment.status}
                                                coursesNames={plainCoursesNames}
                                                orderId={payment._id.toString()}
                                                userId={payment.userId.toString()}
                                              />
                                            ) : null}
                                          </TableBody>
                                        </Table>
                                      </section>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              ))}
                            </section>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="py-3 ">
                      <MainPagination page={page} pages={pages} getFilterUrl={getFilterUrl} />
                    </div>
                  </section>
                ) : (
                  <NoResults />
                )}
              </Suspense>
            </section>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <ExportOrdersToExcel />
        </Card>
      </section>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    notFound();
  }
}
