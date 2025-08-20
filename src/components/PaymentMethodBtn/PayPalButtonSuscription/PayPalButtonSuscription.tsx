'use client';

import { OnApproveData, OnApproveActions } from '@paypal/paypal-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';
import {
  createSuscriptionOrderPaypal,
  PaypalSuscriptionConfirmationAdmin,
  PaypalSuscriptionConfirmationBuyer,
} from '@/utils/Endpoints/orderEndpoints';
import { useBillingDetails } from '@/hooks/useBillingDetails';
import { useRouter, useSearchParams } from 'next/navigation';
import { ISubscriptionPlan } from '@/interfaces/subscriptionPlan';
import { Toaster, toast } from 'sonner';
import { useMemo } from 'react';

export const PayPalButtonSubscription = ({
  suscription,
}: // hasCompleteDetails,
{
  suscription: ISubscriptionPlan;
  // hasCompleteDetails: boolean;
}) => {
  const { data: session } = useSession();
  const { getBillingDetails } = useBillingDetails();
  const searchParams = useSearchParams();
  const type = useMemo(
    () => searchParams.get('type') as 'basic' | 'icon' | 'diamond',
    [searchParams]
  );
  const router = useRouter();
  const frequency = suscription.frequencyType as 'mensual' | 'semestral' | 'anual';
  const userIdSession = session?.user?._id?.toString();

  let userEmailSession = session?.user?.email;

  let suscriptionTitle = suscription?.name ? `${suscription.name} - ${type}` : 'Título desconocido';

  if (typeof suscriptionTitle === 'string' && suscriptionTitle.startsWith('{')) {
    try {
      const parsedTitle = JSON.parse(suscriptionTitle);
      if (parsedTitle?.suscriptionTitle) {
        suscriptionTitle = parsedTitle.suscriptionTitle;
      }
    } catch (e) {
      console.log('Error al parsear suscriptionTitle:', e);
    }
  }

  if (typeof userEmailSession === 'string' && userEmailSession.startsWith('{')) {
    try {
      const parsedEmail = JSON.parse(userEmailSession);
      if (parsedEmail?.userEmailSession) {
        userEmailSession = parsedEmail.userEmailSession;
      }
    } catch (e) {
      console.log('Error al parsear suscriptionTitle:', e);
    }
  }

  const selectedPrice =
    suscription && type && suscription.price && type in suscription.price
      ? suscription.price[type as keyof typeof suscription.price]
      : null;

  // P-6F084431HF184152CM6I27CA
  // TODO: Pasar esto a variables de entorno
  const planIdMap: Record<string, string> = {
    // lo dejamos en wsp
    mensualBasic: 'P-81W13163B8740492AM63DVUA', // - PROD-1PK68962BL101704J   // VA CON FREE TRIAL
    semestralBasic: 'P-9FB51978J05059836M6MX22Q', // PROD-6SB01099FV8185456
    anualBasic: 'P-2FC92098P7485701WM6MX3QA', // P-8DH767449J7386643M6QR6AI
    semestralIcon: 'P-41C81197HF0734354M6MX37Q', // PROD-72B30538V1863334P
    anualIcon: 'P-8GG91881595015332M6MX4KY', //  PROD-9PJ30452EK847512F
    semestralDiamond: 'P-0GB61100XJ119422EM6MX56I', // PROD-9YE87265BA168541N
    anualDiamond: 'P-6PF36796HL912331SM6MX6NA', // PROD-3M345417UC619364J
    // mensualBasic: 'P-220824983U056822XM6R7PNI', // - PROD-1PK68962BL101704J   // VA CON FREE TRIAL
    // semestralBasic: 'P-2MV05227YY652061KM6QR4II', // PROD-6SB01099FV8185456
    // anualBasic: 'P-8DH767449J7386643M6QR6AI', // P-8DH767449J7386643M6QR6AI
    // semestralIcon: 'P-7WP80763K5341770LM6QR7LA', // PROD-72B30538V1863334P
    // anualIcon: 'P-5AD99955TY117015RM6QR77Y', //  PROD-9PJ30452EK847512F
    // semestralDiamond: 'P-21425144966753547M6QSAUY', // PROD-9YE87265BA168541N
    // anualDiamond: 'P-6F887176AH5632011M6QSBJQ', // PROD-3M345417UC619364J
  };

  const planKey = `${frequency}${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const planId = planIdMap[planKey] || null;

  const createSubscription = async (data: any, actions: any) => {
    if (!planId) {
      console.error('Error: planId no encontrado.');
      return;
    }
    try {
      const subscriptionId = await actions.subscription.create({
        plan_id: planId,
        vault: true,
        custom_id: userIdSession,
        subscriber: {
          name: {
            given_name: 'Finanflix',
            surname: 'SRL',
          },
          email_address: 'finanflixofficial@gmail.com',
          shipping_address: {
            name: {
              full_name: 'Finanflix SRL',
            },
            address: {
              address_line_1: suscriptionTitle,
              address_line_2: userEmailSession,
              admin_area_2: 'Buenos Aires',
              admin_area_1: 'CABA',
              postal_code: 'C1425AAB',
              country_code: 'AR',
            },
          },
        },
      });
      // console.log( "Orden de Suscripción creada en Pendiente - ORDERSUSCRIPTIONID DE PAYPAL:", subscriptionId );

      return subscriptionId;
    } catch (error) {
      console.error('Error al crear la suscripción:', error);
      throw error;
    }
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    try {
      const billingDetails = await getBillingDetails();

      // ADMIN EMAIL
      await Promise.all([
        PaypalSuscriptionConfirmationAdmin({
          // suscriptionId: suscription._id.toString(),
          suscriptionTitle: suscription?.name + ' - ' + type,
          frequency: suscription.frequency,
          price: selectedPrice,
          buyerId: session?.user._id.toString(),
          buyerUsername: session?.user?.username || '',
          email: session?.user?.email,
          frequencyType: suscription.frequencyType,
        }),

        // BUYER EMAIL
        PaypalSuscriptionConfirmationBuyer({
          // suscriptionId: suscription._id.toString(),
          suscriptionTitle: suscription?.name + ' - ' + type,
          frequency: suscription.frequency,
          price: selectedPrice,
          payerName: session?.user.username || '',
          email: billingDetails?.email,
          frequencyType: suscription.frequencyType,
        }),

        // Se agrega la suscripcion al usuario TODO: testear
        // generateSuscription({
        //   userId: session?.user?._id.toString(),
        //   type: `Suscripcion ${type} - ${suscription?.frequencyType}`, // el type deberia decia algo como Suscripcion mensual - icon
        // }),

        // ORDER SUSCRIPTION
        createSuscriptionOrderPaypal({
          userId: session?.user?._id.toString(),
          // suscriptionId: suscription?._id.toString(),
          price: selectedPrice,
          currency: 'USD',
          orderTitle: suscription?.name + ' - ' + type,
          status: 'Pagado',
          firstName: billingDetails?.firstName,
          lastName: billingDetails?.lastName,
          email: billingDetails?.email,
          phone: {
            countryCode: billingDetails?.phone?.countryCode,
            number: billingDetails?.phone?.number,
          },
          username: session?.user?.username,
          paymentMethod: 'Service',
          serviceDetail: {
            id: data.orderID,
            type: 'PayPal',
          },
          termsAndConditions: true,
          country: billingDetails?.country,
          address: billingDetails?.address,
          postalCode: billingDetails?.postalCode,
          dni: billingDetails?.dni,
        }),

        fetch(`${process.env.WEBHOOK_MAKE}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session?.user?._id.toString(),
            // suscriptionId: suscription?._id.toString(),
            price: selectedPrice,
            currency: 'USD',
            orderTitle: suscription?.name + ' - ' + type,
            status: 'Pagado',
            firstName: billingDetails?.firstName,
            lastName: billingDetails?.lastName,
            email: billingDetails?.email,
            phone: {
              countryCode: billingDetails?.phone?.countryCode,
              number: billingDetails?.phone?.number,
            },
            username: session?.user?.username,
            paymentMethod: 'Service',
            serviceDetail: {
              id: data.orderID,
              type: 'PayPal',
            },
            termsAndConditions: true,
            country: billingDetails?.country,
            address: billingDetails?.address,
            postalCode: billingDetails?.postalCode,
            dni: billingDetails?.dni,
          }),
        }),
      ]);

      // console.log('Suscripción aprobada:', data);
    } catch (error) {
      console.error('Error al procesar la suscripción:', error);
    }

    toast.success('Pago realizado con éxito', {
      description: `Nuestro equipo ha procesado tu pago correctamente.`,
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

    return;
  };

  const triggerIncompletePaymentEmail = async (orderId: string): Promise<void> => {
    // Llamo a la función para que tome el billingDetails
    const billingDetails = await getBillingDetails();
    const billingData = {
      email: billingDetails?.email ?? undefined,
      firstName: billingDetails?.firstName ?? undefined,
      lastName: billingDetails?.lastName ?? undefined,
      countryCode: billingDetails?.phone?.countryCode ?? undefined,
      number: billingDetails?.phone?.number ?? undefined,
      country: billingDetails?.country ?? undefined,
      address: billingDetails?.address ?? undefined,
      postalCode: billingDetails?.postalCode ?? undefined,
      dni: billingDetails?.dni ?? undefined,
    };

    try {
      // Crea las dos promesas para enviar los correos
      const userEmailPromise = fetch('/api/users/email/paypal-suscription-incomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suscriptionId: suscription?._id.toString() || 'ID No disponible',
          title: suscription.name + ' - ' + type,
          price: selectedPrice,
          orderId,
          ...billingData,
        }),
      });

      const adminEmailPromise = fetch('/api/users/email/paypal-suscription-incomplete-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suscriptionId: suscription?._id.toString() || 'ID No disponible',
          title: suscription.name + ' - ' + type,
          price: selectedPrice,
          orderId,
          ...billingData,
        }),
      });

      // Usa Promise.all() para esperar a que ambas promesas se resuelvan
      const [userResponse, adminResponse] = await Promise.all([
        userEmailPromise,
        adminEmailPromise,
      ]);

      // Verifica si ambas respuestas son correctas
      if (!userResponse.ok || !adminResponse.ok) {
        throw new Error('Error al enviar el correo de cancelación.');
      }

      // console.log('Correos de cancelación enviados con éxito');
    } catch (error) {
      console.error('Error al intentar enviar los correos:', error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col h-full">
      <PayPalButtons
        className="paypal-button w-full p-0 m-0 text-center h-full z-10"
        // disabled={!hasCompleteDetails}
        style={{
          layout: 'horizontal',
          label: 'subscribe',
          tagline: false,
          height: 40,
        }}
        createSubscription={createSubscription}
        onApprove={onApprove}
        onCancel={(data, actions) => {
          // console.log('Suscripción cancelada:', data);
          // console.log('Suscripción actions:', actions);
          triggerIncompletePaymentEmail(data.orderID as any);
        }}
        onError={err => {
          console.error('Error en el proceso de suscripción:', err);
        }}
      />
      <Toaster />
    </div>
  );
};
