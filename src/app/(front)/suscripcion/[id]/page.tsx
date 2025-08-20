'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { CreditCard, GraduationCap, Upload, ArrowRightLeft, UploadIcon, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import BigTitle from '@/components/BigTitle/BigTitle';
import { getSuscriptionById } from '@/utils/Endpoints/suscriptionsPlanEndpoint';
import { ISubscriptionPlan } from '@/interfaces/subscriptionPlan';
import MercadoPagoSuscription from '@/components/PaymentMethodBtn/MercadoPagoSuscription/MercadoPagoSuscription';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import { PayPalButtonSubscription } from '@/components/PaymentMethodBtn/PayPalButtonSuscription/PayPalButtonSuscription';
import { useRate } from '@/hooks/useRate';
import { createSuscriptionOrder } from '@/utils/Endpoints/orderEndpoints';
import { Toaster, toast } from 'sonner';
import {
  sendOfflineSuscriptionAdmin,
  sendOfflineSuscriptionConfirmation,
} from '@/utils/Endpoints/emailEndpoints';
import { FormBillingDetails } from '@/components/FormBillingDetails/FormBillingDetails';
import { useBillingDetails } from '@/hooks/useBillingDetails';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FastPaginationAuth } from '@/components/Auth/FastPaginationAuth';
import FooterVisibilitySetter from '@/components/Footer/FooterVisibilitySetter';
import VimeoTrailerControls from '@/utils/VimeoPlayer/VimeoTrailerControls';
import { FaqSuscriptionStyle } from '@/components/Faqs/FaqSuscription';

interface ApprovedProps {
  message: string;
  success: null | boolean;
}
type SuscriptionTypeKey = 'basic' | 'icon' | 'diamond';
type Step = 'billing' | 'payment' | null;

export default function CheckoutSuscriptionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [suscription, setSuscription] = useState<ISubscriptionPlan>();
  const [picture, setPicture] = useState<any>(null);
  const [isApproved, setIsApproved] = useState<ApprovedProps>();
  const [bank, setBank] = useState('');
  const [isLoadingPesos, setIsLoadingPesos] = useState(false);
  const [isLoadingDolares, setIsLoadingDolares] = useState(false);
  const { rate } = useRate();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as SuscriptionTypeKey;
  const step = searchParams.get('step') as Step;
  const { billingDetails } = useBillingDetails();

  const dynamicPrice = type && suscription?.price ? suscription.price[type] : null;

  // Scroll to the top when the component is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Quick Facts Items
  const listItems = [
    '● Para compras en pesos menores a $100.000, asegúrate de completar tu Nombre, Apellido, Email y Teléfono antes de continuar con tu compra',
    '● Para compras en pesos mayores a $100.000, completa todos los campos del formulario antes de continuar con tu compra.',
    '● Para compras en Dólares por PayPal o Trasferencia bancaria, completa todos los campos del formulario',
    '● ¿Necesitas ayuda adicional para encontrar cursos o tienes preguntas? Envía un correo a info@finanflix.com',
  ];

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
        price: currencyState === 'USD' ? dynamicPrice : dynamicPrice! * Number(rate),
        suscriptionId: id,
        orderTitle: suscription?.name + ' - ' + type,
        termsAndConditions: true,
        image: picture,
      };

      if (picture) {
        const newOrder = await createSuscriptionOrder(newData);
        if (newOrder.success) {
          const sendOrderPromise = sendOfflineSuscriptionConfirmation({
            bank,
            bankUSD: bank === 'USD' && aliasUSD + ' - ' + bankUSD,
            bankAR: bank === 'AR' && aliasAR + ' - ' + bankAR,
            title: suscription?.name + ' - ' + type,
            price: dynamicPrice,
            priceArg: dynamicPrice! * Number(rate),
            email: billingDetails?.email,
            suscriptionId: id,
          });

          const sendOrderAdmin = sendOfflineSuscriptionAdmin({
            bank,
            bankUSD: bank === 'USD' && aliasUSD + ' - ' + bankUSD,
            bankAR: bank === 'AR' && aliasAR + ' - ' + bankAR,
            title: suscription?.name + ' - ' + type,
            price: dynamicPrice,
            priceArg: dynamicPrice! * Number(rate),
            email: session?.user?.email,
            suscriptionId: id,
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

          const res = await fetch('/api/security/getDataWebhookMake', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
          });

          // console.log('Referencia del webhook!!', res);

          if (sendOrder.success && sendAdmin.success) {
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
          } else {
            throw new Error('La creación de la orden falló.');
          }

          setTimeout(() => {
            router.push('/payment-success');
          }, 5000);
        }
        setIsApproved(newOrder);
      } else {
        setIsApproved({
          message:
            'Para completar tu compra offline, realiza el pago del producto utilizando el alias o CBU indicado a continuación. Luego, sube una foto del comprobante y haz clic en el botón "Pagar Offline con (método de pago utilizado)". Nuestro equipo de administración verificará los datos del comprobante y, una vez confirmado el pago, se te asignará el curso correspondiente 🚀',
          success: false,
        });
        // TODO: CAMBIOS TEST
        toast.error(
          'Para completar tu compra offline, realiza el pago del producto utilizando el alias o CBU indicado a continuación. Luego, sube una foto del comprobante y haz clic en el botón "Pagar Offline con (método de pago utilizado)". Nuestro equipo de administración verificará los datos del comprobante y, una vez confirmado el pago, se te asignará el curso correspondiente'
        );
      }
    } catch (error) {
      console.error('Error al procesar:', error);
    } finally {
      setIsLoadingPesos(false);
      setIsLoadingDolares(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const suscriptionResponse = await getSuscriptionById(id.toString());
        setSuscription(suscriptionResponse);
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  // const videoId = Number(course?.trailer?.split('/')?.pop() || "https://vimeo.com/1033198717");

  const videoId = 1033198717;

  // console.log(suscription?.frequencyType);

  return (
    <div className="w-full -z-10 sm:px-3 md:px-10 lg:px-20 xl:px-40 md:w-screen md:ml-[calc(-50vw+50%)] pb-40">
      <div className="bg-[#5D3FD3]  px-3 md:px-0  text-white rounded-lg pt-16 pb-10 sm:pb-20 lg:pb-40 text-center absolute top-[0px] left-0 right-0 md:w-screen md:ml-[calc(-50vw+50%)]">
        <Image
          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702623/logo2_jehphr.png"
          alt="Finanflix Logo"
          width={300}
          height={300}
          className="mx-auto pb-8 w-[250px] h-auto sm:w-[300px] sm:h-auto"
        />
       
          <h1 className="text-4xl sm:text-[44px]  lg:text-6xl xl:text-7xl sm:font-[400] lg:mt-3 mb-1 md:mb-3 font-groteskSharpBold10">
            ESTÁS A TAN SOLO UN PASO DE CAMBIAR TU FUTURO.
          </h1>
          <h2 className="text-4xl sm:text-[44px]  lg:text-6xl xl:text-7xl sm:font-[400] font-groteskSharpBold10">
            ES HORA DE CRYPTO.
          </h2>
     
      </div>

      <div className="relative top-60 sm:top-60 lg:top-72  xl:top-[320px] shadow-xl dark:shadow-[0_0_30px_rgba(155,155,155,0.2)] ">
        <Card className="border shadow-2xl pb-20 ">
          <div className="grid lg:grid-cols-2 gap-3 md:gap-8 md:ml-10 pt-5 md:pt-10">
            {/* NUEVA SECCION ELIGE UN METODO DE PAGO - TABS CON FORMULARIOS  */}

            <div className="space-y-6">
              {status === 'unauthenticated' ? (
                <FastPaginationAuth />
              ) : (
                <Card className=" dark:text-white text-black px-3 font-poppins border-none">
                  {step === 'payment' && (
                    <div className="flex gap-2 mb-2">
                      <div className="flex flex-col">
                        {/* <h2 className="font-poppins font-extralight text-xs sm:text-sm whitespace-nowrap md:mt-1 mb-3 md:mb-0"></h2> */}
                        <h2 className="pb-3 font-poppins font-extralight text-xs sm:text-sm ">
                          {' '}
                          PASO <span className="font-[500]">4</span> DE{' '}
                          <span className="font-[500]">4</span>
                        </h2>
                        <Button
                          className="blur-in text-xs sm:text-sm"
                          onClick={() =>
                            router.push(`/suscripcion/${id}?type=${type}&step=billing`)
                          }
                        >
                          Atras
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 'billing' && (
                    <>
                      <div className="flex  flex-col">
                        <h2 className="font-poppins font-extralight text-xs sm:text-sm whitespace-nowrap md:mt-1 mb-3 md:mb-0">
                          PASO <span className="font-[500]">3</span> DE{' '}
                          <span className="font-[500]">4</span>
                        </h2>

                        {suscription?.frequencyType === 'mensual' && (
                          <BigTitle
                            className="text-5xl md:text-6xl 2xl:text-[5rem] mb-3 md:mb-10 ml-3 md:ml-0 break-all font-groteskSharpBold10 w-full text-center"
                            title="EMPIEZA GRATIS AHORA"
                          />
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg md:text-xl font-poppins">
                          Información Personal
                        </CardTitle>
                        <CardDescription className="font-poppins text-sm sm:text-lg">
                          Proporcione sus datos para finalizar su inscripción
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-5 ">
                        <FormBillingDetails
                          subscriptionName={suscription?.name}
                          redirectProp={`/suscripcion/${id}?type=${type}&step=payment`}
                        />
                      </CardContent>
                    </>
                  )}
                  {step === 'payment' && (
                    <div>
                      {suscription?.frequencyType === 'mensual' && (
                        <BigTitle
                          className="text-5xl md:text-6xl 2xl:text-[5rem] mb-3 md:mb-10 ml-3 md:ml-0 break-all font-groteskSharpBold10 w-full text-center"
                          title="EMPIEZA GRATIS AHORA"
                        />
                      )}

                      <h4 className="py-4 dark:text-white text-black font-bold text-[16px]">
                        Elige un medio de pago
                      </h4>
                      <div>
                        <div className="flex flex-col w-full gap-5 ">
                          {!hasBasicDetails && (
                            <p className="text-sm ">
                              <span className="text-primary cursor-pointer">* </span> Antes de
                              realizar cualquier pago, asegúrate de completar el{' '}
                              <span
                                className="text-primary cursor-pointer"
                                onClick={() =>
                                  router.push(`/suscripciones/${id}?type=${type}&step=billing`)
                                }
                              >
                                paso anterior
                              </span>
                            </p>
                          )}
                          {/*
                          <PayPalButtonSubscription
                            suscription={suscription!}
                          // hasCompleteDetails={hasCompleteDetails}
                          /> */}
                          <MercadoPagoSuscription
                            buttonText={`Mercado Pago ARS (Suscripción Finanflix)`}
                            suscription={suscription}
                            suscriptionPrice={dynamicPrice}
                            hasBasicDetails={hasBasicDetails}
                            hasCompleteDetails={hasCompleteDetails}
                            type={type}
                          />
                        </div>
                        {suscription?.name !== 'Mensual' && (
                          <>
                            <div className="w-full px-5 my-8">
                              <div className="flex text-center dark:bg-background bg-white w-full py-[9px] -mt-2 rounded-md  dark:text-white text-black text-sm border pl-3 space-x-3">
                                <ArrowRightLeft size={16} />
                                <span className="whitespace-normal break-words">
                                  Transferencia (Pagos por Transferencia Bancaria en Pesos o
                                  Dólares) 👇
                                </span>
                              </div>
                            </div>

                            <Card className=" py-2">
                              <CardContent className="px-5 py-1 space-y-3">
                                {hasBasicDetails && !hasCompleteDetails && (
                                  <p className="text-sm">
                                    <span className="text-primary cursor-pointer">* </span>
                                    Para pagos en dólares, debes completar todos los campos del{' '}
                                    <span
                                      className="text-primary cursor-pointer"
                                      onClick={() =>
                                        router.push(
                                          `/suscripciones/${id}?type=${type}&step=billing`
                                        )
                                      }
                                    >
                                      paso anterior
                                    </span>
                                  </p>
                                )}

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
                                  {isLoadingDolares
                                    ? 'Procesando pago...'
                                    : 'Pagar Offline en Dolares'}
                                </Button>
                                {isApproved && (
                                  <Alert
                                    className={`mt-4 border ${
                                      isApproved.success ? 'border-green-500' : 'border-red-500'
                                    }`}
                                  >
                                    {/* <RocketIcon className="h-4 w-4" /> */}
                                    <AlertTitle
                                      className={
                                        isApproved.success ? 'text-green-500' : 'text-red-500'
                                      }
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
                              <div className="grid xl:grid-cols-2 gap-6 p-6 pt-10">
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
                                        src={picture}
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
                                          <p className="mb-2 text-sm text-muted-foreground text-center">
                                            <span className="font-semibold">
                                              Click para subir imagen
                                            </span>{' '}
                                            <p className="mb-2 text-sm text-muted-foreground text-center">
                                              Formato PNG, JPG (Max. 4Mb)
                                            </p>
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
                          </>
                        )}
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

            {/* COLUMNA 2 - DETALLES DE LA Suscripción  */}

            <div className="space-y-6 font-poppins">
              <Card className="dark:text-white text-black border border-none">
                <CardContent className="px-3 md:px-0  w-full md:w-[80%]">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold font-poppins ">
                        ¿Qué es la suscripción Finanflix?
                      </h3>
                      <p className="dark:text-gray-300 text-gray-600 font-poppins break-words  whitespace-normal pt-1 text-xs sm:text-sm md:text-base">
                        El mercado de las criptomonedas cambia, y lo hace todo el tiempo. Es por eso
                        que en Finanflix diseñamos nuestra suscripción para mantenerte al tanto de
                        todo y formarte en todos los ámbitos del mercado.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold mb-2 text-lg sm:text-xl md:text-2xl font-poppins">
                        Desbloquearás inmediatamente:
                      </h4>
                      <div className="dark:text-gray-300 text-gray-600 text-xs sm:text-sm break  flex flex-col">
                        {type === 'diamond' ? (
                          <div>
                            <p>
                              🌍 Actualizaciones constantes sobre eventos críticos en el mundo
                              crypto.
                            </p>
                            <p>
                              📚 Clases en vivo semanales, actualidad de mercado, DeFi, Inglés,
                              Finanzas y más.
                            </p>
                            <p>
                              🔍 Análisis detallados de oportunidades (técnicas y fundamentales).
                            </p>
                            <p>
                              👨‍🏫 Charla diariamente con todo el equipo Finanflix y sus estudiantes.
                            </p>
                            <p>😲 TODOS LOS CURSOS DISPONIBLES</p>
                            <p>💼 Mindset para operar.</p>
                            <p>🎥 +300hs de contenido premium grabado.</p>
                          </div>
                        ) : (
                          <p>
                            <p>
                              💻 El camino educativo definitivo ordenado de principiante a avanzado.
                            </p>
                            <p>
                              💻Acceso a la comunidad Finanflix con seguimiento de parte del staff.
                            </p>
                            <p>⁠🌍 Actualizaciones diarias del mundo crypto.</p>
                            <p>📚 Clases en vivo semanales sobre análisis del mercado crypto.</p>
                            <p>🔍 Análisis de oportunidades en tiempo real.</p>
                            <p>⁠🎥 +300 horas de contenido premium actualizado semanalmente.</p>
                          </p>
                          // ))
                        )}
                        {type === 'icon' && (
                          <div>
                            <p className="text-green-600 mt-2">
                              😲 + Analisis Fundamental & Curso de Trading Pro{' '}
                              <span className="text-gray-500">¡Solo para suscriptores icon!</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:text-white text-black border border-none ">
                <CardContent className="px-3 md:px-0 w-full md:w-[80%]">
                  <div className="aspect-video relative mb-6 overflow-hidden ">
                    <div className="  w-full  ">
                      <div className="w-full  flex flex-col justify-center items-center  ">
                        <div className="w-full max-w-[840px] ">
                          <VimeoTrailerControls videoId={videoId} />
                        </div>
                        {step === 'billing' && (
                          <div className="w-full max-w-[840px] ">
                            <VimeoTrailerControls videoId={videoId} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold font-poppins">
                        Suscripción Finanflix - {suscription?.name}
                      </h3>

                      <div className="pt-2">
                        <p className="text-sm font-medium text-gray-500">Precios</p>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <p className="sm:text-lg font-semibold text-green-600">
                              {suscription?.name === 'Mensual' ? (
                                <span className="font-bold">
                                  $0 primer mes,{' '}
                                  <span className="text-sm">luego USD ${dynamicPrice}</span>
                                </span>
                              ) : (
                                `$${dynamicPrice}`
                              )}
                            </p>
                            <p className="text-xs text-gray-500">USD</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-lg sm:text-xl font-bold text-green-600">
                              {suscription?.name === 'Mensual' ? (
                                <span className="font-bold">
                                  $0 primer mes,{' '}
                                  <span className="text-sm">
                                    luego ARS $
                                    {new Intl.NumberFormat('es-AR').format(
                                      dynamicPrice! * Number(rate)
                                    )}
                                  </span>
                                </span>
                              ) : (
                                `$${new Intl.NumberFormat('es-AR').format(
                                  dynamicPrice! * Number(rate)
                                )}`
                              )}
                            </p>
                            <p className="text-xs text-gray-500">ARS</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                </CardContent>
              </Card>

              <div className="pb-5">
                <FaqSuscriptionStyle />
              </div>
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
