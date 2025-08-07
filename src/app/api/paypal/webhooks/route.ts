import { NextRequest, NextResponse } from 'next/server';
import billingDetails from '@/models/billingDetails';
import { IBillingDetails } from '@/interfaces/billingDetails';
import userModel from '@/models/userModel';

//---------------------------   WEBHOOK FUNCIONAL --------------------------- //

// Función para manejar la solicitud POST del webhook de PayPal

export async function POST(req: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud JSON
    const body = await req.json();

    // ----------------------> EVENTO DE RENOVACIÓN DE SUSCRIPCIÓN <------------------------------------ //

    if (body.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED') {
      // console.log('Suscripción renovada:', body.resource.id);

      // ID de la sesión del usuario
      let customId = body.resource.custom_id;

      // Actualizar el estado de la suscripción del usuario
      const user = await userModel.findOne({ _id: customId });
      if (!user) {
        // console.log('Usuario no encontrado con el id:', customId);
        return new NextResponse('User not found', { status: 404 });
      }

      // Actualizar el estado de la suscripción
      user.suscription = {
        status: 'active',
        // TODO: Agregar los otros campos, type, orderDate, endDate,
      };

      await user.save();
      // console.log('Suscripción renovada correctamente para el userId:', customId);

      // Obtener detalles de facturación si es necesario
      const billingDetailsUser = (await billingDetails
        .findOne({
          userId: customId,
        })
        .lean()) as IBillingDetails | null;

      // Aquí puedes enviar notificaciones o realizar otras acciones necesarias
      // Por ejemplo, enviar un correo al usuario confirmando la renovación

      try {
        if (billingDetailsUser) {
          // Enviar notificación de renovación si es necesario
          // Similar al código para cancelación pero con un endpoint diferente
          await fetch(`${process.env.APP_URL}/api/users/email/paypal-suscription-renewed`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: customId,
              status: 'renewed',
              // Otros datos necesarios
            }),
          });
        }
      } catch (error) {
        console.error('Error al enviar la notificación de renovación:', error);
      }

      // Actualizar el estado de la suscripción en la base de datos
      await updateSubscriptionStatus(body.resource.id, 'active');

      return new NextResponse('Subscription renewal processed successfully', {
        status: 200,
      });
    }

    // ----------------------> EVENTO DE CANCELACION DE SUSCRIPCIÓN <------------------------------------ //

    if (body.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
      // ID SE LA SESION DEL USUARIO
      let customId = null;

      customId = body.resource.custom_id;

      // Remover suscripcion del usuario primero para garantizar la efectividad sin bloqueos externos
      const user = await userModel.findOne({ _id: customId });
      if (!user) {
        // console.log('Usuario no encontrado con el id:', customId);
        return;
      }

      // Se remueve la suscripcion al usuario de la base de datos
      user.suscription = {
        status: 'expired',
      };

      await user.save();
      // console.log('Suscripción cancelada correctamente para el userId:', customId);

      // MANDO EL TITULO DE LA SUSCRIPCION EN EL ADDRESS LINE 1
      // const addressLine1 =
      //    body.resource.subscriber.shipping_address.address.address_line_1;
      // MANDO EL MAIL DE SESION DEL USUARIO EN EL ADDRESS LINE 2
      const addressLine2 = body.resource.subscriber.shipping_address.address.address_line_2;

      // console.log('email de usuario:', addressLine2);

      // Obtener directamente el email de usuario sin parsearlo
      let userEmailSession = addressLine2; // Asumimos que ya está parseado en el front

      // console.log('email de usuario:', userEmailSession);

      // Obtener la suscripción cancelada
      // console.log('Suscripción cancelada:', body.resource.id);

      const billingDetailsUser = (await billingDetails
        .findOne({
          userId: customId,
        })
        .lean()) as IBillingDetails | null;

      // Accede al título de la suscripción
      const titleSuscription = body.resource.subscriber.shipping_address.address.address_line_1
        ? body.resource.subscriber.shipping_address.address.address_line_1
        : 'Título no disponible';

      // Accede al email de usuario
      const userEmail = userEmailSession ? userEmailSession : 'Email no disponible';

      // Aquí puedes enviar los datos a donde necesites o continuar con el flujo

      // Enviar un correo de notificación (por ejemplo, al administrador)
      try {
        if (billingDetailsUser) {
          const { firstName, lastName, country, address, postalCode, dni, email } =
            billingDetailsUser;

          await fetch(`${process.env.APP_URL}/api/users/email/paypal-suscription-cancelled-admin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              suscriptionTitle: titleSuscription,
              userId: customId,
              userEmail: userEmail,
              status: 'canceled',
              firstName: firstName,
              lastName: lastName,
              country: country,
              address: address,
              postalCode: postalCode,
              dni: dni,
              email: email,
            }),
          });
        }

        return new NextResponse('Webhook processed successfully', {
          status: 200,
        });
      } catch (error) {
        console.error('Error al enviar la notificación:', error);
      }

      // Lógica para actualizar el estado de la suscripción en tu base de datos
      await updateSubscriptionStatus(body.resource.id, 'cancelled');

      return new NextResponse('Webhook processed successfully', {
        status: 200,
      });
    }

    // Si el evento no es de tipo "BILLING.SUBSCRIPTION.CANCELLED", solo respondemos con un 200
    return new NextResponse('Event type not handled', { status: 200 });
  } catch (error) {
    // console.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

// Función de ejemplo para actualizar el estado de la suscripción
async function updateSubscriptionStatus(subscriptionId: string, status: string) {
  // Aquí implementarías la lógica para actualizar el estado de la suscripción en tu base de datos
  console.log(
    `Actualizando suscripción ${subscriptionId} a estado: ${status} ignorar es un handler para suscripcion`
  );
}
