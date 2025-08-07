'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';
import { CreditCard, GraduationCap, Upload, ArrowRightLeft, UploadIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ICourse } from '@/interfaces/course';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCourseById } from '@/utils/Endpoints/coursesEndpoint';
import { Button } from '@/components/ui/button';
import {
  sendOfflinePaymentAdmin,
  sendOfflinePaymentConfirmation,
} from '@/utils/Endpoints/emailEndpoints';
import { createOrder } from '@/utils/Endpoints/orderEndpoints';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MercadoPagoButton from '@/components/PaymentMethodBtn/MercadoPagoButton/MercadoPagoButton';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import { useRate } from '@/hooks/useRate';
import { useBillingDetails } from '@/hooks/useBillingDetails';
import { FormBillingDetails } from '@/components/FormBillingDetails/FormBillingDetails';
import { PayPalButton } from '@/components/PaymentMethodBtn/PayPalButton/PayPaylButton';
import { FastPaginationAuth } from '@/components/Auth/FastPaginationAuth';
import FooterVisibilitySetter from '@/components/Footer/FooterVisibilitySetter';
import VimeoTrailerControls from '@/utils/VimeoPlayer/VimeoTrailerControls';

interface Props {
  message: string;
  success: boolean;
}

type Step = 'billing' | 'payment' | null;

export default function CheckoutClient({ id, step }: { id: string; step?: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<ICourse>();
  const [picture, setPicture] = useState<any>(null);
  const [isApproved, setIsApproved] = useState<Props>();
  const [bank, setBank] = useState('');
  const [isLoadingPesos, setIsLoadingPesos] = useState(false);
  const [isLoadingDolares, setIsLoadingDolares] = useState(false);
  const { rate } = useRate();
  const { billingDetails } = useBillingDetails();
  const searchParams = useSearchParams();
  const currentStep = step || (searchParams.get('step') as Step) || 'default';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await getCourseById(id.toString());
        setCourse(courseResponse);
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Scroll to the top when the component is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Variable Bank TEST
  const bankUSD = '0070363331009750132317';
  const bankAR = '0070363320000001910724';
  const aliasUSD = 'FinanflixUSD';
  const aliasAR = 'FinanflixARS';

  // Comprobante  Uploader
  const handleFileChangeImg = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = event => {
        setPicture(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const payOffline = async (currencyState: string) => {
    setBank(currencyState);

    if (currencyState === 'AR') {
      setIsLoadingPesos(true);
    } else if (currencyState === 'USD') {
      setIsLoadingDolares(true);
    }

    try {
      const newData = {
        firstName: billingDetails?.firstName,
        lastName: billingDetails?.lastName,
        email: billingDetails?.email,
        phone: {
          countryCode: billingDetails?.phone.countryCode,
          number: billingDetails?.phone.number,
        },
        country: billingDetails?.country,
        address: billingDetails?.address,
        postalCode: billingDetails?.postalCode,
        dni: billingDetails?.dni,
        status: 'Pendiente',
        paymentMethod: 'Offline',
        userId: session?.user?._id.toString(),
        username: session?.user.username,
        currency: currencyState,
        price: currencyState === 'USD' ? course?.price : course?.price! * Number(rate),
        courseId: id,
        orderTitle: course?.title,
        termsAndConditions: true,
        image: picture,
      };

      if (picture) {
        const newOrder = await createOrder(newData);
        if (newOrder.success) {
          const sendOrderPromise = sendOfflinePaymentConfirmation({
            bank,
            bankUSD: bank === 'USD' && aliasUSD + ' - ' + bankUSD,
            bankAR: bank === 'AR' && aliasAR + ' - ' + bankAR,
            title: course?.title,
            price: course?.price,
            priceArg: course?.price! * Number(rate),
            email: billingDetails?.email,
            courseId: id,
          });

          const sendOrderAdmin = sendOfflinePaymentAdmin({
            bank,
            bankUSD: bank === 'USD' && aliasUSD + ' - ' + bankUSD,
            bankAR: bank === 'AR' && aliasAR + ' - ' + bankAR,
            title: course?.title,
            price: course?.price,
            priceArg: course?.price! * Number(rate),
            email: billingDetails?.email,
            courseId: id,
            countryCode: billingDetails?.phone?.countryCode,
            phone: billingDetails?.phone?.number,
            firstName: billingDetails?.firstName,
            lastName: billingDetails?.lastName,
            country: billingDetails?.country,
            address: billingDetails?.address,
            postalCode: billingDetails?.postalCode,
            dni: billingDetails?.dni,
          });

          const [sendOrder, sendAdmin] = await Promise.all([sendOrderPromise, sendOrderAdmin]);

          await fetch(`${process.env.NEXT_PUBLIC_WEBHOOK_MAKE}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
          });

          const res = await fetch('/api/security/getDataWebhookMake', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
          });

          // console.log('Referencia del webhook!!', res);

          if (sendOrder.success && sendAdmin.success) {
            //     console.log(sendOrder);
            // TODO: CAMBIOS TEST
            toast.success('Envio de solicitud de Pago Exitosa', {
              description: `Nuestro equipo revisará tu solicitud de pago.`,
              duration: 10000,
              action: {
                label: 'X',
                onClick: () => {
                  window.close();
                },
              },
            });

            setTimeout(() => {
              router.push('/payment-success');
            }, 5000);
          } else {
            throw new Error('La creación de la orden falló.');
          }
        }
        setIsApproved(newOrder);
      } else {
        setIsApproved({
          message:
            'Para completar tu compra offline, realiza el pago del producto utilizando el alias o CBU indicado a continuación. Luego, sube una foto del comprobante y haz clic en el botón "Pagar Offline con (método de pago utilizado)". Nuestro equipo de administración verificará los datos del comprobante y, una vez confirmado el pago, se te asignará el curso correspondiente 🚀',
          success: false,
        });
      }
    } catch (error) {
      // console.error('Error al procesar:', error);
      toast.error('Hubo un problema. Por favor, intenta nuevamente.');
    } finally {
      setIsLoadingPesos(false);
      setIsLoadingDolares(false);
    }
  };

  const hasBasicDetails = Boolean(
    billingDetails?.firstName &&
      billingDetails?.lastName &&
      billingDetails?.email &&
      billingDetails?.phone?.countryCode &&
      billingDetails?.phone?.number
  );

  const hasCompleteDetails = Boolean(
    billingDetails?.firstName &&
      billingDetails?.lastName &&
      billingDetails?.email &&
      billingDetails?.phone?.countryCode &&
      billingDetails?.phone?.number &&
      billingDetails?.country &&
      billingDetails?.address &&
      billingDetails?.postalCode &&
      billingDetails?.dni
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  const videoId = Number(course?.trailer?.split('/')?.pop() || 0);

  //console.log(videoId);

  // md:w-screen md:ml-[calc(-50vw+50%)]
  return (
    <div className="w-full -z-10 sm:px-3 md:px-10 lg:px-20 xl:px-40   md:w-screen md:ml-[calc(-50vw+50%)] pb-40 ">
      <div className="bg-[#5D3FD3] px-3 md:px-0  text-white rounded-lg pt-10 pb-20 lg:pb-40 text-center absolute top-[0px] left-0 right-0 md:w-screen md:ml-[calc(-50vw+50%)]">
        <Image
          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702623/logo2_jehphr.png"
          alt="Finanflix Logo"
          width={300}
          height={300}
          className="mx-auto pb-8"
        />
        {/* <h1 className="text-[25px] lg:text-[35px] font-[400] font-poppins ">
               ESTÁS A TAN SOLO UN PASO DE CAMBIAR TU FUTURO.
             </h1>
             <h2 className="text-[25px] lg:text-[35px] font-[400] font-poppins">
               ES HORA DE CRYPTO.
             </h2> */}

        <h1 className="text-xl md:text-[25px] lg:text-[35px] font-[400] font-poppins lg:mt-3 md:mb-3 lg:mb-5">
          ESTÁS A TAN SOLO UN PASO DE CAMBIAR TU FUTURO.
        </h1>
        <h2 className="text-xl md:text-[25px] lg:text-[35px] font-[400] font-poppins">
          ES HORA DE CRYPTO.
        </h2>
      </div>

      {/* AUTH RENDER CONDICIONAL */}

      <div className="relative top-60 lg:top-96 2xl:top-72 shadow-xl dark:shadow-[0_0_30px_rgba(155,155,155,0.2)]  w-full">
        <Card className="border shadow-2xl pb-20 ">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* NUEVA SECCION ELIGE UN METODO DE PAGO - TABS CON FORMULARIOS  */}

            <div className="space-y-6">
              {status === 'unauthenticated' ? (
                <FastPaginationAuth />
              ) : (
                <Card className=" dark:text-white text-black px-5  pt-5 font-poppins">
                  {currentStep === 'payment' && (
                    <div className="flex gap-2 mb-2">
                      <div className="flex flex-col">
                        <h2 className="pb-3 font-poppins font-extralight text-sm ">
                          {' '}
                          PASO <span className="font-[500]">4</span> DE{' '}
                          <span className="font-[500]">4</span>
                        </h2>
                        <Button
                          className="blur-in"
                          onClick={() => router.push(`/checkout/${id}?step=billing`)}
                        >
                          Atras
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'billing' && (
                    <>
                      <h2 className="pb-3 font-poppins font-extralight text-sm ">
                        {' '}
                        PASO <span className="font-[500]">3</span> DE{' '}
                        <span className="font-[500]">4</span>
                      </h2>

                      <CardHeader>
                        <CardTitle className="md:text-xl font-poppins">
                          Información Personal y Datos de facturación
                        </CardTitle>
                        <CardDescription className="font-poppins">
                          Proporcione sus datos para completar la compra
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-5 ">
                        <FormBillingDetails redirectProp={`/checkout/${id}?step=payment`} />
                      </CardContent>
                    </>
                  )}
                  {currentStep === 'payment' && (
                    <div>
                      <h4 className="p-4 dark:text-white text-black font-bold text-[16px]">
                        Elige un medio de pago
                      </h4>
                      <div>
                        <div className="flex flex-col w-full gap-5 px-5">
                          {!hasBasicDetails && (
                            <p className="text-sm ">
                              <span className="text-primary cursor-pointer">* </span> Antes de
                              realizar cualquier pago, asegúrate de completar el{' '}
                              <span
                                className="text-primary cursor-pointer"
                                onClick={() => router.push(`/checkout/${id}?step=billing`)}
                              >
                                paso anterior
                              </span>
                            </p>
                          )}
                          {hasBasicDetails && !hasCompleteDetails && (
                            <p className="text-sm">
                              <span className="text-primary cursor-pointer">* </span>
                              Para pagos en dólares, debes completar todos los campos del{' '}
                              <span
                                className="text-primary cursor-pointer"
                                onClick={() => router.push(`/checkout/${id}?step=billing`)}
                              >
                                paso anterior
                              </span>
                            </p>
                          )}

                          {/* PAYPAL */}

                          {/* <PayPalButton hasCompleteDetails={hasCompleteDetails} course={course} /> */}

                          <PayPalButton course={course} />

                          {/* Mercado Pago Button */}

                          <MercadoPagoButton
                            course={course}
                            hasBasicDetails={hasBasicDetails}
                            hasCompleteDetails={hasCompleteDetails}
                          />
                        </div>
                        <div className="w-full px-5 my-8">
                          <div className="flex text-center dark:bg-background bg-white w-full py-[9px] -mt-2 rounded-md dark:text-white text-black text-sm border pl-3 space-x-3">
                            <ArrowRightLeft size={16} />
                            <span className="whitespace-normal break-words ">
                              Transferencia (Pagos por Transferencia Bancaria en Pesos o Dólares) 👇
                            </span>
                          </div>
                        </div>

                        <Card>
                          <CardContent className="px-5 py-1 space-y-3">
                            <Button
                              type="submit"
                              variant="outline"
                              className="w-full py-3 bg-primary text-white hover:bg-secondary hover:text-white rounded-md"
                              onClick={() => {
                                payOffline('AR');
                              }}
                              disabled={isLoadingPesos}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              {isLoadingPesos ? 'Procesando pago...' : 'Pagar Offline en Pesos'}
                            </Button>
                            <Button
                              type="submit"
                              variant="outline"
                              className="w-full py-3 bg-primary text-white hover:bg-secondary hover:text-white rounded-md"
                              onClick={() => {
                                payOffline('USD');
                              }}
                              disabled={isLoadingDolares}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              {isLoadingDolares ? 'Procesando pago...' : 'Pagar Offline en Dolares'}
                            </Button>
                            {isApproved && (
                              <Alert
                                className={`mt-4 border ${
                                  isApproved.success ? 'border-green-500' : 'border-red-500'
                                }`}
                              >
                                {/* <RocketIcon className="h-4 w-4" /> */}
                                <AlertTitle
                                  className={isApproved.success ? 'text-green-500' : 'text-red-500'}
                                >
                                  {isApproved.success ? 'Completado' : 'Algo faltó'}
                                </AlertTitle>
                                <AlertDescription>{isApproved.message}</AlertDescription>
                              </Alert>
                            )}
                            <div className="text-xs text-gray-500  text-center font-poppins ">
                              Al hacer clic en "Pagar Offline", acepta nuestros{' '}
                              <Link
                                href={'/terminos-y-condiciones'}
                                className="hover:text-gray-700 dark:hover:text-gray-300 dark:text-white text-black"
                              >
                                Términos y Condiciones.
                              </Link>
                            </div>
                          </CardContent>
                        </Card>

                        <div>
                          <div className="grid xl:grid-cols-2 gap-6 px-6 pt-6 w-[80%] ">
                            <div className="space-y-4">
                              <div className="flex justify-start items-center gap-4">
                                <div className="w-5 h-5 dark:bg-white dark:text-black bg-black text-white rounded-full flex justify-center">
                                  <span className="text-white dark:text-black text-xs font-semibold leading-5 ">
                                    1
                                  </span>
                                </div>

                                <h3 className="font-semibold">Datos bancarios</h3>
                              </div>

                              <div className="space-y-2 flex flex-col gap-4 w-full">
                                <div>
                                  <div>
                                    <strong>Banco:</strong>
                                  </div>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">Galicia</p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Razón Social:</strong>
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    FINANFLIX S. R. L.
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Cuenta corriente:</strong>
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    USD: 9750132-3 363-1
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    ARS: 0001910-7 363-2
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>ALIAS:</strong>
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    USD: {aliasUSD}
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    ARS: {aliasAR}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>CBU:</strong>
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    USD: {bankUSD}
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    ARS: {bankAR}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>CUIT:</strong>
                                  </p>
                                  <p className="dark:text-[#A7A7A7] text-[#8d8d8d]">
                                    30-71739982-6
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-start items-center gap-4">
                                <div className="w-5 h-5 bg-black  dark:bg-white dark:text-black  text-white  rounded-full flex justify-center">
                                  <span className="text-white dark:text-black text-xs font-semibold leading-5">
                                    2
                                  </span>
                                </div>

                                <h3 className="font-semibold">Adjunta el comprobante</h3>
                              </div>

                              {picture ? (
                                <div className="flex justify-center relative">
                                  <Image
                                    src={picture || '/placeholder.svg'}
                                    alt="Imagen del comprobante de pago"
                                    width={80}
                                    height={80}
                                    className="object-cover w-1/2 rounded-md"
                                  />
                                </div>
                              ) : (
                                <div className="rounded-xl p-6 text-center dark:bg-background bg-background">
                                  <label
                                    htmlFor="image"
                                    className="cursor-pointer flex flex-col items-center"
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                                      <p className="text-sm text-muted-foreground text-center">
                                        <span className="font-semibold">
                                          Click para subir imagen
                                        </span>{' '}
                                      </p>
                                      <p className="mb-2 text-sm text-muted-foreground text-center">
                                        Formato PNG, JPG (Max. 4Mb)
                                      </p>
                                    </div>
                                    <input
                                      type="file"
                                      id="image"
                                      data-max-size="5120"
                                      className="hidden"
                                      accept=".jpg, .png, .jpeg"
                                      onChange={handleFileChangeImg}
                                    />
                                  </label>
                                </div>
                              )}
                              <label
                                htmlFor="image"
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <div className="p-2 bg-primary text-white w-full text-xs rounded-md hover:bg-secondary text-center flex justify-center items-center gap-2">
                                  <p>Imagen del comprobante</p>{' '}
                                  <div>
                                    <UploadIcon size={14} />
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id="image"
                                  data-max-size="5120"
                                  className="hidden"
                                  accept=".jpg, .png, .jpeg"
                                  onChange={handleFileChangeImg}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {step === 'payment' && (
                <div className="flex justify-center items-center gap-10 pl-3 pr-6 md:px-0 ">
                  <div>
                    <Image
                      src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703240/visa_oufbsm.png"
                      alt="Finanflix Logo"
                      width={110}
                      height={110}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <Image
                      src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703238/master_hstr64.png"
                      alt="Finanflix Logo"
                      width={110}
                      height={110}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <Image
                      src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703239/paypal_dzuq2n.png"
                      alt="Finanflix Logo"
                      width={110}
                      height={110}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <Image
                      src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703237/american_bjtihh.png"
                      alt="Finanflix Logo"
                      width={110}
                      height={110}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* COLUMNA 2 - DETALLES DEL CURSO  */}

            <div className="space-y-6 font-poppins w-full">
              <Card className="dark:text-white text-black border border-none">
                <CardContent className="px-3 lg:px-6 w-full md:w-[80%]">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-semibold font-poppins ">
                        Informacion sobre el Curso de {course?.title}
                      </h3>
                      <p className="dark:text-gray-300 text-gray-600 font-poppins break-words  whitespace-normal pt-1 text-sm md:text-base">
                        {course?.description ||
                          'Explora el mundo del trading y adquiere herramientas clave para tomar decisiones financieras informadas.'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-semibold font-poppins">
                        ¿Que aprenderás en este curso?
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 font-poppins pt-3 text-sm md:text-base">
                        <li>
                          💼 Herramientas para organizar ingresos y gastos, y hábitos de consumo
                          responsables.
                        </li>
                        <li>
                          📈 Conocimientos sobre tasas de interés, manejo de deudas y préstamos.
                        </li>
                        <li>
                          👨🏼‍💼 Estrategias para establecer metas financieras a corto, mediano y largo
                          plazo.
                        </li>
                        <li>
                          💸 Entendimiento de instrumentos de renta fija y variable, incluyendo
                          criptomonedas y estrategias con Stablecoins.
                        </li>
                        <li>
                          🧠 Aprenderás a gestionar tus finanzas personales con excelencia y lograr
                          un crecimiento sostenido en el tiempo.
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:text-white text-black border border-none ">
                <CardContent className="px-3 md:px-6 w-full md:w-[80%]">
                  <div className="aspect-video  mb-6 overflow-hidden relative">
                    <div className="  w-full  ">
                      <div className="w-full  flex flex-col justify-center items-center  ">
                        <div className="w-full max-w-[840px]  ">
                          <VimeoTrailerControls videoId={videoId} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-semibold font-poppins">
                        {course?.title}
                      </h3>
                      <p className="dark:text-gray-300 text-gray-600 font-poppins break-all">
                        {course?.subtitle}
                      </p>

                      <div className="pt-2">
                        <p className="text-sm font-medium text-gray-500">Precios</p>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold text-green-600">
                              {' '}
                              ${course?.price}
                            </p>
                            <p className="text-xs text-gray-500">Dólares Estadounidenses</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xl font-bold text-green-600">
                              $
                              {new Intl.NumberFormat('es-AR').format(course?.price! * Number(rate))}
                            </p>
                            <p className="text-xs text-gray-500">Pesos Argentinos</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full ">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-5 h-5  dark:text-white text-black" />
                        <p className="text-sm">Nivel:</p>
                        <span className="text-sm">{course?.level}</span>
                      </div>
                    </div>
                    {course?.description && (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2">Descripción del curso</h4>
                          <p className="dark:text-gray-300 text-gray-600 text-sm break break-all">
                            {course?.description}
                          </p>
                        </div>
                      </>
                    )}
                    <Separator />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>
      <div className="md:py-40"></div>
      <Toaster />
      <FooterVisibilitySetter hidden={true} />
    </div>
  );
}
