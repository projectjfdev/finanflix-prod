'use client';

import { useBillingDetails } from '@/hooks/useBillingDetails';
import { createCourseProgress } from '@/utils/Endpoints/coursesEndpoint';
import {
  createOrderOnApprovePaypal,
  PaypalPaymentConfirmationAdmin,
  PaypalPaymentConfirmationBuyer,
} from '@/utils/Endpoints/orderEndpoints';
import {
  OnApproveData,
  OnApproveActions,
  CreateOrderData,
  CreateOrderActions,
} from '@paypal/paypal-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Toaster, toast } from 'sonner';

export const PayPalButton = ({
  course,
}: // hasCompleteDetails,
{
  course: any;
  // hasCompleteDetails: boolean;
}) => {
  const { data: session } = useSession();
  const { billingDetails, getBillingDetails } = useBillingDetails();

  //console.log(session?.user.email);

  const router = useRouter();

  async function createOrder(data: CreateOrderData, actions: CreateOrderActions) {
    const res = await fetch('/api/orders/paypal/checkout', {
      method: 'POST',
      body: JSON.stringify({
        price: course?.price,
        description: `ID del curso: ${course?._id.toString()}`,
      }),
    });
    const order = await res.json();
    return order.id;
  }

  async function onApprove(data: OnApproveData, actions: OnApproveActions) {
    // console.log(course);

    const billingDetails = await getBillingDetails();
    const userEmail = billingDetails?.email;

    // DEBUGS
    // console.log(billingDetails);
    // console.log(userEmail);
    // console.log(course);

    // AGREGUE ESTA VALIDACION PARA QUE NO TIRE 400 EN CREACION DE ORDEN
    if (!course) {
      // console.error('El objeto course no está definido.');
      return;
    }

    await Promise.all([
      // Email al administrador
      PaypalPaymentConfirmationAdmin({
        courseId: course._id.toString(),
        title: course.title,
        price: course.price,
        buyerId: session?.user?._id.toString(),
        buyerUsername: session?.user?.username,
        email: userEmail,
      }),
      // email al usuario comprador
      PaypalPaymentConfirmationBuyer({
        courseId: course._id.toString(),
        title: course.title,
        price: course.price,
        email: userEmail,
      }),
      // Creacion del progreso del curso
      createCourseProgress({
        courseId: course._id.toString(),
        userId: session?.user._id.toString(),
      }),

      // Creacion de la orden endpoint
      // TODO: TIRAR ERROR 400 ACA  - EL PRECIO NO LLEGA BIEN
      createOrderOnApprovePaypal({
        userId: session?.user?._id.toString(),
        courseId: course._id.toString(),
        price: course?.price,
        phone: {
          countryCode: billingDetails?.phone.countryCode, // Código de país (Ej: +54)
          number: billingDetails?.phone.number, // Teléfono
        },
        country: billingDetails?.country,
        address: billingDetails?.address,
        postalCode: billingDetails?.postalCode,
        dni: billingDetails?.dni,
        orderTitle: course.title,
        firstName: billingDetails?.firstName,
        lastName: billingDetails?.lastName,
        email: billingDetails?.email,
        username: session?.user?.username,
        currency: 'USD',
        status: 'Pagado',
        paymentMethod: 'Service',
        serviceDetail: {
          id: data.orderID,
          type: 'PayPal',
        },
      }),
      fetch(`${process.env.WEBHOOK_MAKE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?._id.toString(),
          courseId: course._id.toString(),
          price: course?.price,
          phone: {
            countryCode: billingDetails?.phone.countryCode, // Código de país (Ej: +54)
            number: billingDetails?.phone.number, // Teléfono
          },
          country: billingDetails?.country,
          address: billingDetails?.address,
          postalCode: billingDetails?.postalCode,
          dni: billingDetails?.dni,
          orderTitle: course.title,
          firstName: billingDetails?.firstName,
          lastName: billingDetails?.lastName,
          email: billingDetails?.email,
          username: session?.user?.username,
          currency: 'USD',
          status: 'Pagado',
          paymentMethod: 'Service',
          serviceDetail: {
            id: data.orderID,
            type: 'PayPal',
          },
        }),
      }),
    ]);

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

    const captureResult = await actions.order?.capture();
    setTimeout(() => {
      router.push('/payment-success');
    }, 5000);
    return;
  }

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
      const userEmailPromise = fetch('/api/users/email/paypal-payment-incomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course?._id.toString(),
          title: course?.title,
          priceArg: course?.price,
          orderId,
          ...billingData,
        }),
      });

      const adminEmailPromise = fetch('/api/users/email/paypal-payment-incomplete-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course?._id.toString(),
          title: course?.title,
          priceArg: course?.price,
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
    <div className="w-full flex justify-center items-center flex-col h-full ">
      <PayPalButtons
        // disabled={!hasCompleteDetails}
        className="paypal-button w-full p-0 m-0 text-center h-full"
        style={{
          layout: 'horizontal',
          label: 'pay',
          tagline: false,
          height: 40,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={(data, actions) => {
          // console.log('Data de onCancel:', data);
          triggerIncompletePaymentEmail(data?.orderID as string);
        }}
      />
      <Toaster />
    </div>
  );
};
