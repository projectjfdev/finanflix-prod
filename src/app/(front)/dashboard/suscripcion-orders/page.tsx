import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownWideNarrow, Eye, GraduationCap, SearchX } from 'lucide-react';

import ExportSuscriptionsToExcel from '@/components/ExportToExcel/ExportSuscriptionsToExcel';
import { FormValidateOfflineSuscription } from '@/components/FormValidateOfflineSuscription/FormValidateOfflineSuscription';
import { MainPagination } from '@/components/MainPagination/MainPagination';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { NoResults } from '@/components/NoResults/NoResults';
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

import { IExchangeRate } from '@/interfaces/exchangeRate';
import { cn } from '@/lib/utils';
import exchangeRate from '@/models/exchangeRate';
import suscriptionService from '@/utils/Services/suscriptionService';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import paymentsService from '@/utils/Services/paymentsService';
import courseService from '@/utils/Services/courseService';
import billingDetails from '@/models/billingDetails';
import { IBillingDetails } from '@/interfaces/billingDetails';
import SmallTitle from '@/components/SmallTitle/SmallTitle';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const sortOrders = ['Pagos recientes', 'Menor precio', 'Mayor precio'];

// TODO: CAMBIOS TEST

export default async function SuscriptionOrders({
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
    return `/dashboard/suscripcion-orders?${new URLSearchParams(params).toString()}#filtros`;
  };

  try {
    const [
      exchangeRateData,
      usernames,
      paymentMethods,
      { countSuscriptions, suscriptions, pages },
    ] = await Promise.all([
      exchangeRate.findOne({}),
      suscriptionService.getUsernames(),
      suscriptionService.getPaymentMethod(),
      suscriptionService.getByQuery({
        username,
        paymentMethod,
        q,
        price,
        page,
        sort,
      }),
    ]);

    return (
      <section className="w-full ml-4 md:ml-8">
        <div className="dark:bg-background ">
          <div className="flex justify-between items-center">
            <div className="text-left text-lg font-semibold text-gray-900 flex justify-between w-full items-center pb-3 dark:hover:bg-transparent">
              <MediumTitle
                title="Órdenes de Suscripciones"
                className="dark:text-white text-black"
              />
            </div>
          </div>
        </div>

        <Card
          id="filtros"
          className="dark:bg-background bg:white px-5 w-full pb-6 pt-6 overflow-hidden dark:text-white text-black"
        >
          <section className="flex flex-col md:flex-row md:justify-end gap-3">
            <Select>
              <SelectTrigger className="w-[220px]">
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
                  <Card className="hidden md:flex dark:bg-background bg:white rounded-md p-2 mb-3 px-5">
                    <p className="dark:text-gray-500 text-black text-xs italic py-1">
                      * En caso de que el usuario haya pagado, otorgarle el curso o suscripción
                      correspondiente
                    </p>
                  </Card>
                  <Card className="dark:bg-background bg:white rounded-md p-2 md:mb-3 px-5 md:w-1/3">
                    <p className="flex gap-2 items-center dark:text-white text-black">
                      <GraduationCap size={20} className="text-yellow-300" />
                      Pendiente
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
                            className={`${sort == s ? 'text-primary' : ''}`}
                            href={getFilterUrl({ s })}
                          >
                            <DropdownMenuItem>{s}</DropdownMenuItem>
                          </Link>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="font-bold dark:text-white text-black mr-1">
                      {suscriptions.length === 0 ? 'No' : countSuscriptions} Resultados
                    </span>
                    {q !== 'all' && q !== '' && ' - ' + q}
                    {paymentMethod !== 'all' && ' - ' + paymentMethod}
                    {price !== 'all' && ' - Price ' + price}
                    &nbsp;
                    {(q !== 'all' && q !== '') || paymentMethod !== 'all' || price !== 'all' ? (
                      <Link href="/dashboard/suscripcion-orders">
                        <Button variant="outline">
                          Eliminar filtros <SearchX size={15} className="ml-1" />
                        </Button>
                      </Link>
                    ) : null}
                  </section>
                </section>
              </section>

              <Suspense fallback={<LoadingFinanflix />}>
                {suscriptions.length > 0 ? (
                  <section className="overflow-x-auto mr-10 md:mr-0">
                    <Table className="w-full divide-y dark:divide-gray-900 pt-2">
                      <TableBody className="divide-y dark:divide-gray-900 dark:text-white">
                        <TableRow>
                          <TableCell className="p-0">
                            <section className="border dark:border-gray-700 border-gray-200 rounded-lg overflow-hidden">
                              {suscriptions?.map((suscription: any, index) => (
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
                                            {suscription?.username}:
                                          </span>
                                        </p>
                                        <section className="dark:text-white text-gray-400 flex gap-3 items-center mr-3">
                                          <section className="border p-2 rounded-md">
                                            <GraduationCap
                                              size={18}
                                              className={cn(
                                                suscription.status === 'Pagado'
                                                  ? 'text-secondary'
                                                  : 'text-yellow-300'
                                              )}
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
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Id de la orden
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <p className="truncate cursor-help">
                                                        {suscription?._id.toString()}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      {suscription?._id.toString()}
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
                                                        {suscription?.orderTitle}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      {suscription?.title || 'Proposal'} with{' '}
                                                      {suscription?.username}
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Cliente
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <p className="truncate cursor-help">
                                                        {suscription?.username}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      {suscription?.title || 'Proposal'} with{' '}
                                                      {suscription?.username}
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Estado de la orden
                                              </TableCell>
                                              <TableCell className="py-4 text-right w-full flex justify-end">
                                                <div
                                                  className={`font-semibold pointer-events-auto dark:bg-card bg-background py-3 rounded-full px-5 transition-all ${
                                                    suscription?.status === 'Cancelado'
                                                      ? 'border-red-500 text-red-500 bg-red-50 dark:bg-card border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
                                                      : suscription?.status === 'Pendiente'
                                                      ? 'border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-card border'
                                                      : suscription?.status === 'Pagado'
                                                      ? 'border-green-500 text-green-500 bg-green-50 dark:bg-card border'
                                                      : 'Orden no existente'
                                                  }`}
                                                >
                                                  <p>
                                                    {suscription.status || 'Estado no disponible'}
                                                  </p>
                                                </div>
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Precio
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm font-semibold dark:text-white text-gray-900">
                                                $
                                                {new Intl.NumberFormat('es-AR').format(
                                                  suscription.price
                                                )}{' '}
                                                {suscription?.currency === 'USD' ? 'USD' : 'AR'}
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Método de Pago
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                {suscription.paymentMethod}
                                                {suscription.paymentMethod === 'Service' &&
                                                  ' - ' +
                                                    suscription?.serviceDetail?.type +
                                                    ' ID: ' +
                                                    suscription?.serviceDetail?.id}
                                              </TableCell>
                                            </TableRow>

                                            <TableRow>
                                              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                Fecha de creación
                                              </TableCell>
                                              <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                <p className="truncate cursor-help">
                                                  {suscription?.createdAt.toLocaleDateString()}
                                                </p>
                                              </TableCell>
                                            </TableRow>

                                            {suscription?.image && (
                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Comprobante de pago
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  <Link
                                                    className="inline-block px-4 py-2 bg-secondary text-white rounded-full hover:bg-primary"
                                                    href={suscription?.image?.url}
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
                                                <SmallTitle title="Datos Formulario Suscripción  Offline" />
                                              </TableCell>
                                            </TableRow>
                                            <Separator />

                                            <>
                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Email del cliente
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {suscription?.email}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Dni
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {suscription?.dni}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Código Postal
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {suscription?.postalCode}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Domicilio
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {suscription?.address}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  País
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {suscription?.country}
                                                </TableCell>
                                              </TableRow>

                                              <TableRow>
                                                <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                                                  Teléfono
                                                </TableCell>
                                                <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                                                  {`${suscription?.phone?.countryCode} ${suscription?.phone?.number}`}
                                                </TableCell>
                                              </TableRow>
                                            </>

                                            {suscription.paymentMethod === 'Offline' && (
                                              <FormValidateOfflineSuscription
                                                status={suscription.status}
                                                orderId={suscription._id.toString()}
                                                userId={suscription.userId.toString()}
                                              />
                                            )}
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
                    <div className="py-3">
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
          <ExportSuscriptionsToExcel />
        </Card>
      </section>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    notFound();
  }
}
