import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import orderModel from '@/models/orderModel';
import suscriptionOrderModel from '@/models/suscriptionOrderModel';
import billingDetails from '@/models/billingDetails';
import type { IBillingDetails } from '@/interfaces/billingDetails';
import userModel from '@/models/userModel';
import { connectDB } from '@/lib/dbConfig';
import {
  assignRoleToUser,
  assignSuscriptionRoleToUser,
  getRoleIdForCourse,
  getRoleIdForSubscription,
  removeSubscriptionRoleFromUser,
} from '@/lib/discord/roles/roleManager';
import { removeRoleFromUser } from '@/lib/discord/roles/roleManager';
import { isUserInGuild, userHasRole } from '@/lib/discord/discord';
import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import Rol from '@/models/rolesModel';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import { getRoleIdForExpiredSuscriptions } from '@/lib/discord/roles/temporary-role-subscriptions/discord-roles-suscription';
import { getRoleIdForExpiredCourses } from '@/lib/discord/roles/temporary-role-courses/discord-roles-courses';
import { syncCoursesRolesInSusByUserId } from '@/lib/discord/roles/activateExpiredRoleSus';
import { delay } from '@/lib/discord/roles/roleManagerDiamond';
import { log } from 'node:console';
import { assignExpiredRoleBySubscriptionType } from '@/lib/discord/roles/asignExpiredSusRoles';

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    // console.log('BODY SUBSCRIPTION ENTITY?', body);
    if (!body.type) {
      // console.error('Event type is undefined');
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    switch (body.type) {
      // -------------------------- PAYMENT -------------------------------------- (Cuando el usuario realiza la compra de manera exitosa)
      case 'payment':
        {
          const paymentId = body?.data?.id;

          const payment = await new Payment(mercadopago).get({
            id: paymentId,
          });

          const userSessionId = payment.metadata.user_id;
          const billingDetailsUser = (await billingDetails
            .findOne({
              userId: userSessionId,
            })
            .lean()) as IBillingDetails | null;

          switch (payment.status) {
            case 'approved':
              if (billingDetailsUser) {
                const { firstName, lastName, phone, country, address, postalCode, dni, email } =
                  billingDetailsUser;

                // console.log('billingDetailsUser', billingDetailsUser);
                // console.log('payment.metadata', payment.metadata);

                // Tener en cuenta que si le envio pirceArg en la metadata, lo convierte a snake case (price_arg)
                const order = {
                  orderTitle: payment.metadata.title,
                  userId: payment.metadata.user_id,
                  courseId: payment.metadata.course_id,
                  price: payment.metadata.price,
                  email: payment.metadata.user_email,
                  username: payment.metadata.username,
                  currency: 'AR',
                  status: 'Pagado',
                  termsAndConditions: true,
                  firstName,
                  lastName,
                  phone: {
                    countryCode: phone?.countryCode,
                    number: phone?.number,
                  },
                  country,
                  address,
                  postalCode,
                  dni,
                  paymentMethod: 'Service',
                  serviceDetail: {
                    id: payment.order?.id,
                    type: payment.order?.type,
                  },
                };

                const existingOrder = await orderModel.findOne({
                  courseId: payment.metadata.course_id,
                  userId: payment.metadata.user_id,
                  status: 'Pagado',
                  // paymentMethod: 'Service',
                  serviceDetail: 'Mercadopago',
                });

                if (existingOrder) {
                  // console.log('Orden ya existe:', existingOrder);
                  return NextResponse.json(
                    { message: 'Orden ya existente', success: false },
                    { status: 409 }
                  );
                }

                const newOrder = new orderModel(order);
                await newOrder.save();

                //  ------------- LOGICA DE DISCORD ----------------------- //

                const courseTitles = [
                  'DeFi Avanzado',
                  'Análisis fundamental | Curso avanzado',
                  'Trading avanzado',
                  'Análisis Técnico de 0 a 100',
                  'NFTs Revolution',
                  'Solidity',
                  'Finanzas Personales',
                  'Bolsa argentina',
                  'StartZero',
                  'Hedge Value',
                  'Trading Pro',
                ];

                const user = await userModel.findById(payment.metadata.user_id);
                const userDiscordId = user.discordId;

                if (userDiscordId && courseTitles.includes(payment.metadata.title)) {
                  // Actualizar campo discordConnected a false en la base de datos
                  const updatedUser = await userModel.findByIdAndUpdate(
                    payment.metadata.user_id,
                    { discordConnected: false }, // paso el discord connected a false para que aparezca el modal de discord y reclame los roles de los nuevos cursos
                    { new: true }
                  );

                  // console.log(
                  //   'DiscordConnected en false para que usuario reclame rol de curso realizado correctamente'
                  // );

                  if (!updatedUser) {
                    return new Response('User not found', { status: 404 });
                  }

                  const rolDiscordCursoComprado = getRoleIdForCourse(payment.metadata.title);

                  const resPost = await fetch(
                    `${process.env.APP_URL}/api/discord/rol-schema-course`,
                    {
                      method: 'POST',
                      body: JSON.stringify({
                        userId: payment.metadata.user_id.toString(),
                        courses: [
                          {
                            rolId: rolDiscordCursoComprado,
                            title: payment.metadata.title,
                            status: 'claimed',
                            orderDate: new Date(),
                            source: 'manual',
                            subscriptionType: null,
                            rolNumber: payment.metadata.title === 'Trading Pro' ? 1 : 0,
                          },
                        ],
                      }),
                    }
                  );

                  // console.log('creando curso');

                  if (resPost.status === 409) {
                    await fetch(`${process.env.APP_URL}/api/discord/rol-schema-course`, {
                      method: 'PUT',
                      body: JSON.stringify({
                        userId: payment.metadata.user_id.toString(),
                        courses: [
                          {
                            rolId: rolDiscordCursoComprado,
                            title: payment.metadata.title,
                            status: 'claimed',
                            orderDate: new Date(),
                            source: 'manual',
                            subscriptionType: null,
                            rolNumber: payment.metadata.title === 'Trading Pro' ? 1 : 0,
                          },
                        ],
                      }),
                    });
                  }

                  // --------------------------- ROLES EN DISCORD ------------------------------------------ //

                  // Obtener el discordId del usuario específico al que se le está asignando el curso
                  const userDiscordId = await getDiscordIdForUser(
                    payment.metadata.user_id.toString()
                  );

                  // console.log(
                  //   userDiscordId,
                  //   'userDiscordId para el usuario:',
                  //   payment.metadata.user_id.toString()
                  // );

                  // Solo intentamos asignar el rol si el usuario tiene un discordId y está en el servidor
                  if (userDiscordId) {
                    // console.log(
                    //   '✅ Usuario tiene Discord ID, verificando si está en el servidor...'
                    // );

                    // chequeamos si el usuario esta en el servidor
                    const isUserInServer = await isUserInGuild(userDiscordId);
                    // console.log('¿Usuario está en el servidor?', isUserInServer);

                    if (isUserInServer) {
                      // console.log(
                      //   '✅ Usuario está en el servidor, obteniendo rol para el curso:',
                      //   payment.metadata.title
                      // );

                      // Obtenemos el ID del rol correspondiente al curso
                      const courseRoleId = getRoleIdForCourse(payment.metadata.title);
                      // console.log('Role ID encontrado:', courseRoleId);

                      if (!courseRoleId) {
                        // console.error(
                        //   '❌ No se encontró un ID de rol para el curso:',
                        //   payment.metadata.title
                        // );
                        return; // cortamos ejecución
                      }

                      // * ASIGNAR SEGUNDO ROL DE TRADING PRO SI YA FUE RECLAMADO ANTERIORMENTE

                      if (payment.metadata.title === 'Trading Pro') {
                        // 🚨 Lógica especial para Trading Pro
                        const tradingProVencido =
                          process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_VENCIDO;
                        const secondRolId =
                          process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;

                        const secondRolTradingProWasClaimed = await Rol.findOne({
                          discordId: userDiscordId,
                          'courses.rolId': secondRolId,
                        });

                        if (secondRolTradingProWasClaimed) {
                          await removeRoleFromUser(userDiscordId, tradingProVencido as string);
                          const assignSecondRole = await assignRoleToUser(
                            userDiscordId,
                            secondRolId as string
                          );
                          // console.log('✅ Segundo rol de Trading Pro asignado');
                        } else {
                          // * SI NO LO RECLAMÓ AÚN, ASIGNAMOS EL PRIMER ROL DE TRADING PRO
                          const roleAssigned = await assignRoleToUser(
                            userDiscordId,
                            courseRoleId as string
                          );
                          // if (roleAssigned) {
                          //   console.log('✅ Primer rol de Trading Pro asignado');
                          // }
                        }
                      } else {
                        // * ASIGNAR ROLES PARA TODOS LOS CURSOS QUE NO SEAN TRADING PRO
                        const roleAssigned = await assignRoleToUser(
                          userDiscordId,
                          courseRoleId as string
                        );
                        // if (roleAssigned) {
                        //   console.log(`✅ Rol del curso "${payment.metadata.title}" asignado`);
                        // } else {
                        //   console.error('❌ No se pudo asignar el rol del curso');
                        // }

                        // 🔄 Removemos el rol vencido de este curso (si existiera)
                        const expiredRoleId = await getRoleIdForExpiredCourses(
                          payment.metadata.title
                        );
                        await removeRoleFromUser(userDiscordId, expiredRoleId as any);
                      }
                    } else {
                      console.log('⚠️ El usuario no está en el servidor de Discord');
                    }
                  } else {
                    console.log('⚠️ El usuario no tiene una cuenta de Discord conectada');
                  }
                }

                //  ------------- FIN DE LOGICA DE DISCORD ----------------------- //

                try {
                  // Enviar emails de forma secuencial para mejor control
                  await fetch(`${process.env.APP_URL}/api/cursos/course-progress`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      courseId: payment.metadata.course_id.toString(),
                      userId: payment.metadata.user_id.toString(),
                    }),
                  });

                  // EMAIL A FINANFLIX
                  await fetch(
                    `${process.env.APP_URL}/api/users/email/service-payment-confirmation-admin`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        courseId: payment.metadata.course_id,
                        orderTitle: payment.metadata.title,
                        buyerName: payment.metadata.username,
                        priceArg: payment?.metadata?.price,
                        email,
                      }),
                    }
                  );

                  // EMAIL AL COMPRADOR
                  await fetch(
                    `${process.env.APP_URL}/api/users/email/service-payment-confirmation-buyer`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        title: payment?.metadata?.title,
                        priceArg: payment?.metadata?.price,
                        courseId: payment?.metadata?.course_id,
                        email,
                      }),
                    }
                  );

                  // Webhook a Make (comentado en el código original)
                  await fetch(`${process.env.WEBHOOK_MAKE}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(order),
                  });

                  // console.log('Emails de pago enviados correctamente');
                } catch (error) {
                  console.error('Error al enviar emails de pago:', error);
                }

                return NextResponse.json(
                  {
                    message: 'Orden creada correctamente',
                    success: true,
                    courseId: newOrder,
                  },
                  { status: 200 }
                );
              }

              break;

            // -------------------------- REJECTED -------------------------------------- (Cuando el pago es rechazado por falta de fondos o tarjeta invalida)
            case 'rejected':
              // console.log(`Payment ${paymentId} was rejected`);

              if (billingDetailsUser) {
                const { email, firstName, lastName, phone, country, address, postalCode, dni } =
                  billingDetailsUser ?? {};

                try {
                  // Email al usuario
                  const userResponse = await fetch(
                    `${process.env.APP_URL}/api/users/email/service-payment-incomplete`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        title: payment?.metadata?.title,
                        priceArg: payment?.metadata?.price,
                        courseId: payment?.metadata?.course_id,
                        email,
                        firstName,
                        lastName,
                        countryCode: phone.countryCode,
                        number: phone.number,
                        country,
                        address,
                        postalCode,
                        dni,
                      }),
                    }
                  );

                  // Email al administrador
                  const adminResponse = await fetch(
                    `${process.env.APP_URL}/api/users/email/service-payment-incomplete-admin`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        title: payment?.metadata?.title,
                        priceArg: payment?.metadata?.price,
                        courseId: payment?.metadata?.course_id,
                        email,
                        firstName,
                        lastName,
                        countryCode: phone.countryCode,
                        number: phone.number,
                        country,
                        address,
                        postalCode,
                        dni,
                      }),
                    }
                  );

                  // Verifica si ambas respuestas son correctas
                  if (!userResponse.ok || !adminResponse.ok) {
                    throw new Error('Error al enviar el correo de cancelación.');
                  }

                  // console.log('Correos de cancelación enviados con éxito');
                } catch (error) {
                  console.error('Error al enviar emails de rechazo:', error);
                }

                return NextResponse.json(
                  { message: 'Notificación de rechazo procesada', success: true },
                  { status: 200 }
                );
              } else {
                // console.log('No billing details found for user');
                return NextResponse.json(
                  { message: 'No se encontraron detalles de facturación', success: false },
                  { status: 404 }
                );
              }

            // -------------------------- CANCELLED -------------------------------------- (Cuando el usuario cierra la ventana de pago o no completa el proceso)
            case 'cancelled':
              try {
                await fetch(`${process.env.APP_URL}/api/users/email/service-payment-incomplete`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    title: payment?.metadata?.title,
                    email: payment.metadata.user_email,
                    priceArg: payment?.metadata?.price,
                    courseId: payment?.metadata?.course_id,
                    // dni: billingDetailsUser.dni
                  }),
                });

                // console.log('Email de cancelación enviado con éxito');
              } catch (error) {
                console.error('Error al enviar email de cancelación:', error);
              }

              return NextResponse.json(
                { message: 'Notificación de cancelación procesada', success: true },
                { status: 200 }
              );

            // -------------------------------- PENDING -------------------------------- TODO LO QUE NO SEA PAGO APROVADO SERA TOMADO COMO COMPRA PENDIENTE
            default:
              // Enviar emails de rechazo (siempre que NO sea 'approved')

              // console.log(payment, 'payment info dentro de default');

              const paymentStatus = payment?.status; // Aquí buscarías el estado del pago
              const paymentStatusDetail = payment.status_detail;
              const paymentReason = payment?.charges_details?.[0]?.metadata?.reason; // Este campo puede tener la razón de la tarifa (aunque normalmente no es la razón del rechazo del pago, sino del cobro)

              // console.log('Estado del pago:', paymentStatus);
              // console.log('Estado del pago:', paymentStatusDetail);
              // console.log('Razón del rechazo (si está disponible):', paymentReason);

              if (billingDetailsUser) {
                const { firstName, lastName, phone, country, address, postalCode, dni } =
                  billingDetailsUser ?? {};

                // Email al usuario
                await fetch(`${process.env.APP_URL}/api/users/email/service-payment-incomplete`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    title: payment?.metadata?.title,
                    email: payment.metadata.user_email,
                    priceArg: payment?.metadata?.price,
                    courseId: payment?.metadata?.course_id,
                    firstName,
                    lastName,
                    countryCode: phone?.countryCode,
                    number: phone?.number,
                    country,
                    address,
                    postalCode,
                    dni,
                  }),
                });

                // Email al administrador
                await fetch(
                  `${process.env.APP_URL}/api/users/email/service-payment-incomplete-admin`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      title: payment?.metadata?.title,
                      email: payment.metadata.user_email,
                      priceArg: payment?.metadata?.price,
                      courseId: payment?.metadata?.course_id,
                      firstName,
                      lastName,
                      countryCode: phone?.countryCode,
                      number: phone?.number,
                      country,
                      address,
                      postalCode,
                      dni,
                    }),
                  }
                );

                // console.log('📩 Correos de pago NO aprobado enviados');

                return NextResponse.json(
                  { message: 'Notificación de pago NO aprobado procesada', success: true },
                  { status: 200 }
                );
              }

              // ⛔️ IMPORTANTE: Esto evita que siga al siguiente `case` si no había billingDetailsUser
              return NextResponse.json(
                { message: 'No se encontraron detalles de facturación', success: false },
                { status: 404 }
              );
          }
        }

        {
          /* ---------------------------  SUSCRIPCIONES  -----------------------------------------  */
        }

      case 'subscription_preapproval': {
        const subscriptionId = body.data.id;

        if (body.action === 'payment.created') {
          // aca va a pasar todo lo que sucede si la compra se efectua correctamente
          // console.log('action: payment.created, luego se actualiza a action: updated');
          return NextResponse.json(
            { message: 'Notificación de creación de pago recibida', success: true },
            { status: 200 }
          );
        }

        // Remueve el campo suscription del usuario cuando el usuario cancela su suscripcion
        if (body.action === 'updated') {
          // console.log(
          //   `[${new Date().toISOString()}] 🔔 Webhook recibido: action=${
          //     body.action
          //   }, subscriptionId=${subscriptionId}`
          // );

          try {
            const response = await fetch(
              `https://api.mercadopago.com/preapproval/${subscriptionId}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!response.ok) {
              // console.error('Error al obtener detalles de la suscripción:', response.statusText);
              return NextResponse.json(
                { error: 'Error al obtener detalles de la suscripción' },
                { status: 500 }
              );
            }

            const subscriptionDetails = await response.json();

            const { status, external_reference } = subscriptionDetails;

            // console.log(
            //   `[${new Date().toISOString()}] 📦 Estado de suscripción: status=${status}, subscriptionId=${subscriptionId}`
            // );

            let externalReference;
            try {
              externalReference = JSON.parse(external_reference);
            } catch (parseError) {
              // console.error('Error parsing external_reference:', parseError);
              return NextResponse.json({ error: 'Invalid external_reference' }, { status: 400 });
            }

            // console.log('externalReference', externalReference);

            const userEmail = externalReference?.userEmail;
            const name = externalReference?.name;
            const userId = externalReference?.userId;

            const billingDetailsUser = (await billingDetails
              .findOne({ userId: userId })
              .lean()) as IBillingDetails | null;

            if (!billingDetailsUser) {
              // console.error('Billing details not found for the user');
              return NextResponse.json({ error: 'Billing details not found' }, { status: 404 });
            }

            // console.log('billingDetailsUser', billingDetailsUser);

            const { firstName, lastName, phone, country, address, postalCode, dni } =
              billingDetailsUser;
            // console.log('status', status);

            if (status === 'authorized') {
              // Check if this is a renewal by looking at previous orders
              console.log('log antes del existingOrders del authorized');

              // Verificar si ya existe una orden para esta suscripción
              const existingOrder = await suscriptionOrderModel.findOne({
                'serviceDetail.id': subscriptionId,
                status: 'Pagado',
              });

              if (existingOrder) {
                // console.log(
                //   `Orden para suscripción ${subscriptionId} ya existe, omitiendo procesamiento`
                // );
                return NextResponse.json(
                  { message: 'Orden ya procesada', success: true },
                  { status: 200 }
                );
              }

              // console.log('log despues del  if (existingOrders.length > 0) {');

              const order = {
                userId: externalReference.userId,
                username: externalReference.username,
                price: subscriptionDetails?.auto_recurring.transaction_amount,
                currency: 'AR',
                orderTitle: subscriptionDetails.reason,
                status: 'Pagado',
                termsAndConditions: true,
                email: userEmail,
                postalCode,
                dni,
                phone,
                country,
                address,
                firstName,
                lastName,
                paymentMethod: 'Service',
                serviceDetail: {
                  id: subscriptionId,
                  type: 'MercadoPago',
                },
              };

              const newOrder = new suscriptionOrderModel(order);
              await newOrder.save();
              // console.log('log 1');

              // Enviar emails de forma secuencial para mejor control
              try {
                // Email al administrador
                await fetch(
                  `${process.env.APP_URL}/api/users/email/suscription-payment-confirmation-admin`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userEmail: userEmail,
                      suscriptionId: subscriptionId,
                      name: name,
                      reason: subscriptionDetails?.reason,
                      price: subscriptionDetails?.auto_recurring.transaction_amount,
                      currencyId: subscriptionDetails?.auto_recurring.currency_id,
                      status: subscriptionDetails?.status,
                      createdAt: subscriptionDetails?.date_created,
                      nextPaymentDate: subscriptionDetails?.next_payment_date,
                      frequencyType: subscriptionDetails?.auto_recurring.frequency_type,
                    }),
                  }
                );

                // Email al comprador
                await fetch(
                  `${process.env.APP_URL}/api/users/email/suscription-payment-confirmation-buyer`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userEmail: userEmail,
                      name: name,
                      reason: subscriptionDetails?.reason,
                      price: subscriptionDetails?.auto_recurring.transaction_amount,
                      currencyId: subscriptionDetails?.auto_recurring.currency_id,
                      status: subscriptionDetails?.status,
                      createdAt: subscriptionDetails?.date_created,
                      nextPaymentDate: subscriptionDetails?.next_payment_date,
                    }),
                  }
                );

                // Webhook a Make
                await fetch(`${process.env.WEBHOOK_MAKE}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(order),
                });

                // console.log('Emails enviados correctamente');
              } catch (error) {
                console.error('Error al enviar emails:', error);
              }

              // console.log('externalReference test 503', externalReference);

              const orderDate = new Date();
              const endDate = new Date(orderDate); // copiamos la fecha

              const nameLower = externalReference.name.toLowerCase();

              if (nameLower.includes('mensual')) {
                endDate.setMonth(endDate.getMonth() + 1);
              } else if (nameLower.includes('semestral')) {
                endDate.setMonth(endDate.getMonth() + 6);
              } else if (nameLower.includes('anual')) {
                endDate.setFullYear(endDate.getFullYear() + 1);
              } else {
                return NextResponse.json(
                  { message: 'Tipo de suscripción no reconocido.' },
                  { status: 400 }
                );
              }

              const resp = await userModel.findByIdAndUpdate(
                externalReference.userId,
                {
                  $set: {
                    'suscription.type': externalReference.name,
                    'suscription.isActive': true,
                    'suscription.orderDate': new Date(),
                    'suscription.endDate': endDate,
                    'suscription.status': 'active',
                  },
                },
                { new: true } // te devuelve el user actualizado
              );

              //console.log(externalReference.userId, 'externalReference.userId');
              //console.log('Suscripción activa:', resp);

              // --------------------------- LOGICA DE DISCORD ------------------------------------------  acaa //
              // Fecha actual
              const now = new Date();

              const completedCourses = await getCompletedCoursesCount(userId);
              const rolIdExpired = getRoleIdForExpiredSuscriptions(name);
              const suscriptionRolId = getRoleIdForSubscription(name);
              // Clonamos la fecha para no modificar la original
              const vencimiento = new Date(now);

              const resPost = await fetch(`${process.env.APP_URL}/api/discord/rol-schema-subs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: userId,
                  sub: {
                    type: name,
                    rol: {
                      id: suscriptionRolId,
                      status: 'claimed',
                      orderDate: now.toISOString(),
                      rolNumber: name.includes('Suscripcion basic')
                        ? completedCourses < 3
                          ? 1
                          : 2
                        : 0,
                    },
                    rolVencido: {
                      id: rolIdExpired,
                      status: 'notClaimed',
                      orderDate: vencimiento.toISOString(),
                    },
                  },
                }),
              });

              if (resPost.status === 409) {
                // Armamos el cuerpo final con las fechas correctas
                console.log('entrooo');

                const bodySubRolDiscord = {
                  userId: userId,
                  sub: {
                    type: name,
                    rol: {
                      id: suscriptionRolId,
                      status: 'claimed',
                      orderDate: now.toISOString(),
                      rolNumber: name.includes('Suscripcion basic')
                        ? completedCourses < 3
                          ? 1
                          : 2
                        : 0,
                    },
                    rolVencido: {
                      id: rolIdExpired,
                      status: 'notClaimed',
                      orderDate: vencimiento.toISOString(),
                    },
                  },
                };

                const resPut = await fetch(`${process.env.APP_URL}/api/discord/rol-schema-subs`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(bodySubRolDiscord),
                });
                const dataPut = await resPut.json();
                console.log('res put front', dataPut);
              }

              console.log(resPost, 'respost');

              const userRol = await Rol.findOne({ userId: userId });

              if (!userRol) {
                return NextResponse.json(
                  { message: 'No se encontró un modelo para este usuario' },
                  { status: 404 }
                );
              }

              // recuperamos el rol id de la suscripcion anterior antes de que se actualice
              const oldActiveSubscriptionRoleId = userRol.sub?.rol?.id;
              // console.log(oldActiveSubscriptionRoleId);

              // Obtener el discordId del usuario específico al que se le está asignando el curso
              const userDiscordId = await getDiscordIdForUser(userId);
              // console.log(userDiscordId, 'userDiscordId para el usuario:', userId);

              // Solo intentamos asignar el rol si el usuario tiene un discordId y está en el servidor
              if (userDiscordId) {
                //  console.log('✅ Usuario tiene Discord ID, verificando si está en el servidor...');

                // chequeamos si el usuario esta en el servidor
                const isUserInServer = await isUserInGuild(userDiscordId);
                // console.log('¿Usuario está en el servidor?', isUserInServer);

                if (isUserInServer) {
                  // console.log(
                  //   '✅ Usuario está en el servidor, obteniendo rol para la suscripcion:',
                  //   name
                  // );

                  // * Rol de curso vencido existente
                  // console.log(
                  //   'removiendo el rol del curso vencido y asignandolo en cualquier suscripcion'
                  // );

                  const parts = name.split('-');
                  const subscriptionType = parts[1]?.trim(); // "mensual"

                  // console.log('subscriptionType', subscriptionType);

                  try {
                    await syncCoursesRolesInSusByUserId(userId, subscriptionType);
                  } catch (err) {
                    console.error('❌ Error al sincronizar roles de cursos', err);
                  }

                  // recuperamos el rol de la nueva suscripcion asignada
                  const newSubscriptionRoleId = await getRoleIdForSubscription(name);
                  // Remover el rol anterior si existe y es diferente al nuevo
                  if (
                    oldActiveSubscriptionRoleId &&
                    newSubscriptionRoleId &&
                    oldActiveSubscriptionRoleId !== newSubscriptionRoleId
                  ) {
                    const hasOldRole = await userHasRole(
                      userDiscordId,
                      oldActiveSubscriptionRoleId
                    );

                    if (hasOldRole) {
                      const removed = await removeSubscriptionRoleFromUser(
                        userDiscordId,
                        oldActiveSubscriptionRoleId
                      );
                      if (removed) {
                        console.log(`✅ Rol anterior (${oldActiveSubscriptionRoleId}) removido`);
                      } else {
                        console.warn(
                          `⚠️ No se pudo remover el rol anterior (${oldActiveSubscriptionRoleId})`
                        );
                      }
                    }
                  }

                  //console.log('Rol anterior:', oldActiveSubscriptionRoleId);
                  //console.log('Rol nuevo:', newSubscriptionRoleId);

                  // LOGICA DE SUSCRIPCION MENSUAL CON 3 O MAS CURSOS COMPLETADOS
                  if (name === 'Suscripcion basic - mensual' && completedCourses >= 3) {
                    // console.log(
                    //   '🎯 Usuario con más de 3 cursos completados, aplicando upgrade de rol'
                    // );

                    const threeCompletedCoursesRol =
                      process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES;

                    const expiredRolesToRemove = [
                      process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
                      process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON_VENCIDO,
                      process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND_VENCIDO,
                    ];

                    try {
                      // Asignar nuevo rol por completar cursos
                      if (threeCompletedCoursesRol) {
                        const assigned = await assignSuscriptionRoleToUser(
                          userDiscordId,
                          threeCompletedCoursesRol
                        );
                        // console.log(`✅ Rol "${threeCompletedCoursesRol}" asignado:`, assigned);
                      }

                      // Remover todos los roles vencidos relevantes
                      for (const expiredRole of expiredRolesToRemove) {
                        if (expiredRole) {
                          const removed = await removeSubscriptionRoleFromUser(
                            userDiscordId,
                            expiredRole
                          );
                          // console.log(`🧹 Rol vencido "${expiredRole}" removido:`, removed);
                        }
                      }
                    } catch (error) {
                      console.error(
                        '❌ Error durante la asignación/remoción de roles por 3 cursos:',
                        error
                      );
                    }
                  }

                  const subscriptionRoles = [
                    {
                      name: 'Suscripcion basic',
                      roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL,
                    },
                    {
                      name: 'Suscripcion icon',
                      roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON,
                    },
                    {
                      name: 'Suscripcion diamond',
                      roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND,
                    },
                  ];

                  // logica para asignar todos los roles de los cursos y remover los vencidos, si tiene diamond
                  // if (name.includes('diamond')) {
                  //   console.log('tiene diamonddd');
                  //   await syncDiamondRolesByUserId(userId);
                  // }

                  if (
                    newSubscriptionRoleId &&
                    !(name === 'Suscripcion basic - mensual' && completedCourses >= 3)
                  ) {
                    // console.log(
                    //   '✅ Asignando rol',
                    //   newSubscriptionRoleId,
                    //   'al usuario',
                    //   userDiscordId
                    // );

                    // Asignamos el rol al usuario
                    const suscriptionRoleAssigned = await assignSuscriptionRoleToUser(
                      userDiscordId,
                      newSubscriptionRoleId
                    );

                    // Obtenemos el nombre base de la suscripción, ej: 'Suscripcion basic'
                    const currentSubscriptionBaseName = name.split(' - ')[0];
                    // console.log('currentSubscriptionBaseName', currentSubscriptionBaseName);

                    // Removemos los roles vencidos de suscripciones activas que no coincidan
                    for (const role of subscriptionRoles) {
                      if (role.name !== currentSubscriptionBaseName) {
                        const removed = await removeSubscriptionRoleFromUser(
                          userDiscordId,
                          role.roleId as string
                        );
                        // console.log(`🧹 Rol ${role.name} eliminado:`, removed);
                      }
                    }

                    const basicExpiredRol =
                      process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO;

                    const removedBasic = await removeSubscriptionRoleFromUser(
                      userDiscordId,
                      basicExpiredRol as string
                    );

                    const iconExpiredRol = process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON_VENCIDO;

                    const removedIcon = await removeSubscriptionRoleFromUser(
                      userDiscordId,
                      iconExpiredRol as string
                    );

                    const diamondExpiredRol = process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND_VENCIDO;

                    const removed = await removeSubscriptionRoleFromUser(
                      userDiscordId,
                      diamondExpiredRol as string
                    );

                    if (suscriptionRoleAssigned) {
                      console.log('✅ Rol asignado exitosamente en Discord');
                    } else {
                      console.error('❌ No se pudo asignar el rol en Discord');
                    }
                  } else {
                    console.error('❌ No se encontró un ID de rol para la suscripcion:', name);
                  }
                } else {
                  console.log('⚠️ El usuario no está en el servidor de Discord');
                }
              } else {
                console.log('⚠️ El usuario no tiene una cuenta de Discord conectada');
              }

              // --------------------------- FIN LOGICA DE DISCORD ------------------------------------------ //
            }

            // -------------------------- REJECTED  -------------------------------------- (Rejected sucede cuando vence la suscripcion y no se renueva)
            else if (status === 'rejected') {
              // console.log("externalReference", externalReference);

              const userEmail = externalReference?.userEmail;
              const name = externalReference?.name;
              const userName = externalReference?.username;

              // console.log(`Subscription ${subscriptionId} is cancelled for ${payer_email}`);

              const promises = [
                fetch(`${process.env.APP_URL}/api/users/email/mercadopago-suscription-rejected`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userEmail: userEmail,
                    name: name,
                    reason: subscriptionDetails?.reason,
                    price: subscriptionDetails?.auto_recurring.transaction_amount,
                    currencyId: subscriptionDetails?.auto_recurring.currency_id,
                  }),
                }),
                fetch(
                  `${process.env.APP_URL}/api/users/email/mercadopago-suscription-rejected-admin`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      username: userName,
                      userEmail: userEmail,
                      name: name,
                      reason: subscriptionDetails?.reason,
                      price: subscriptionDetails?.auto_recurring.transaction_amount,
                      currencyId: subscriptionDetails?.auto_recurring.currency_id,
                    }),
                  }
                ),
              ];

              await Promise.all(promises);

              // -----------  LOGICA DE DISCORD -------------- //

              const user = await userModel.findById(userId);

              if (user) {
                const discordId = user.discordId;
                console.log('Discord ID:', discordId);

                const discordRoleId = getRoleIdForSubscription(name); // ID del rol a remover, le pasamos el type para saber el tipo de suscripcion
                const userDiscordId = user.discordId; // Suponiendo que el modelo de usuario tiene el campo discordId

                //console.log(userDiscordId, 'userDiscordI');
                //console.log(name, 'type de la suscripcion');
                //console.log(userId, 'userId desde el externalreference');

                // utilizamos la validacion para que typescript no rompa si es null o undefined ambas variables
                if (!userDiscordId || !discordRoleId) {
                  // console.log('ID de usuario o rol de Discord no disponible');
                  return NextResponse.json({
                    message: 'ID de usuario o rol de Discord no disponible',
                    status: 400,
                    success: false,
                  });
                }

                const success = await removeRoleFromUser(userDiscordId, discordRoleId);

                if (!success) {
                  // console.log('No se pudo remover el rol de Discord');
                  return NextResponse.json({
                    message: 'No se pudo remover el rol de Discord',
                    status: 500,
                    success: false,
                  });
                }

                // Actualizar campo discordConnected a false en la base de datos
                const updatedUser = await userModel.findByIdAndUpdate(
                  userId,
                  { discordConnected: false },
                  { new: true }
                );

                // console.log('Role removed successfully');

                if (!updatedUser) {
                  return new Response('User not found', { status: 404 });
                }

                return NextResponse.json({
                  message: 'Suscripción actualizada correctamente',
                  status: 200,
                  success: true,
                });
              } else {
                console.log('Usuario no encontrado');
              }

              // -----------  FIN DE LOGICA DE DISCORD -------------- //
            }

            // -------------------------- CANCELLED O EXPIRED -------------------------------------- (Cuando el usuario cancela la suscripcion desde su cuenta de mercadopago)
            else if (status === 'cancelled' || status === 'expired') {
              const { userEmail, name, userName, userId } = externalReference;
              const completedCourses = await getCompletedCoursesCount(userId);

              // const userEmail = externalReference?.userEmail;
              // const name = externalReference?.name;
              // const userName = externalReference?.username;
              // console.log(body, 'body dentro del cancelled');
              // console.log(subscriptionDetails, 'subscriptiondetails dentro del cancelled');
              // console.log(body.status, 'body stats dentro del cancelled');

              await userModel.findByIdAndUpdate(userId, {
                suscription: {
                  status: 'expired',
                },
              });

              try {
                // Email al usuario
                await fetch(
                  `${process.env.APP_URL}/api/users/email/mercadopago-suscription-cancelled`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userEmail: userEmail,
                      name: name,
                      reason: subscriptionDetails?.reason,
                      price: subscriptionDetails?.auto_recurring.transaction_amount,
                      currencyId: subscriptionDetails?.auto_recurring.currency_id,
                    }),
                  }
                );

                // Email al administrador
                await fetch(
                  `${process.env.APP_URL}/api/users/email/mercadopago-suscription-cancelled-admin`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      username: userName,
                      userEmail: userEmail,
                      name: name,
                      reason: subscriptionDetails?.reason,
                      price: subscriptionDetails?.auto_recurring.transaction_amount,
                      currencyId: subscriptionDetails?.auto_recurring.currency_id,
                    }),
                  }
                );

                // console.log('Emails de cancelación enviados correctamente');
              } catch (error) {
                console.error('Error al enviar emails de cancelación:', error);
              }


              // * ACTUALIZAMOS LA SUB STATUS A EXPIRED
              const updateSubRol = await Rol.updateOne(
                { userId },
                {
                  $set: {
                    'sub.rol.status': 'expired',
                  },
                }
              );

              console.log('subscripcion pasada a expired');

              // -----------  LOGICA DE DISCORD -------------- //

              const user = await userModel.findById(userId);

              if (user) {
                const discordId = user.discordId;
                // console.log('Discord ID:', discordId);

                const discordRoleId = getRoleIdForSubscription(name); // ID del rol a remover, le pasamos el type para saber el tipo de suscripcion
                const userDiscordId = user.discordId; // Suponiendo que el modelo de usuario tiene el campo discordId

                //console.log(userDiscordId, 'userDiscordI');
                //console.log(name, 'type de la suscripcion');
                //console.log(userId, 'userId desde el externalreference');

                // utilizamos la validacion para que typescript no rompa si es null o undefined ambas variables
                if (!userDiscordId || !discordRoleId) {
                  // console.log('ID de usuario o rol de Discord no disponible');
                  return NextResponse.json({
                    message: 'ID de usuario o rol de Discord no disponible',
                    status: 400,
                    success: false,
                  });
                }

                if (name === 'Suscripcion basic - mensual' && completedCourses >= 3) {
                  // console.log('entrooo');
                  const threeCompletedCoursesRol =
                    process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES;

                  const removed = await removeSubscriptionRoleFromUser(
                    userDiscordId,
                    threeCompletedCoursesRol as string
                  );

                  const basicExpiredRol =
                    process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO;

                  const assigneExpiredRol = await assignSuscriptionRoleToUser(
                    userDiscordId,
                    basicExpiredRol as string
                  );
                }

                const success = await removeSubscriptionRoleFromUser(userDiscordId, discordRoleId);

                if (!success) {
                  // console.log('No se pudo remover el rol de Discord');
                  return NextResponse.json({
                    message: 'No se pudo remover el rol de Discord',
                    status: 500,
                    success: false,
                  });
                }

                // * ASIGNAMOS ROLES VENCIDOS A LAS SUSCRIPCIONES
                console.log('name', name);
                try {
                  console.log('name', name);
                  await assignExpiredRoleBySubscriptionType(userDiscordId, name);
                } catch (error) {
                  // console.error('Error al asignar rol expirado:', error);
                  return NextResponse.json({
                    message: 'No se pudo asignar el rol expirado en Discord',
                    status: 500,
                    success: false,
                    discordError: true,
                  });
                }

                //* REMOVEMOS LOS ROLES Y ASIGNAMOS ROLES VENCIDOS A LOS CURSOS SI SE CANCELA LA SUSCRIPCION
                const roles = await Rol.find({
                  userId,
                  courses: {
                    $elemMatch: {
                      orderDate: { $exists: true },
                      status: 'claimed',
                    },
                  },
                })
                  .select('courses.rolId courses.title courses.status courses.source')
                  .lean();

                //console.log('userId', userId);

                for (const rol of roles) {
                  for (const course of rol.courses) {
                    const { rolId, title, status, source } = course;
                    console.log('status', status);
                    // removemos el rol del curso en discord
                    const rolIdExpired = getRoleIdForExpiredCourses(title);
                    console.log(rolIdExpired, 'rold id expired');
                    if (!rolId || !rolIdExpired) continue;
                    try {
                      console.log('entro');
                      const removed = await removeRoleFromUser(userDiscordId, rolId);
                      if (status === 'claimed' && source === 'subscription') {
                        console.log('entrooo');
                        const assigned = await assignRoleToUser(userDiscordId, rolIdExpired);
                        await delay(2000);
                        if (assigned) {
                          await Rol.updateOne(
                            { discordId: userDiscordId, 'courses.title': title },
                            {
                              $set: {
                                'courses.$.status': 'expired',
                              },
                            }
                          );
                        }
                      }
                    } catch (error) {
                      console.log('no se pudieron remover los roles vencidos');
                    }
                  }
                }

                // Actualizar campo discordConnected a false en la base de datos
                const updatedUser = await userModel.findByIdAndUpdate(
                  userId,
                  { discordConnected: false },
                  { new: true }
                );

                console.log('userId', userId);




                // console.log(updateSubRol.modifiedCount);

                // console.log('Role removed successfully');

                if (!updatedUser) {
                  return new Response('User not found', { status: 404 });
                }

                return NextResponse.json({
                  message: 'Suscripción actualizada correctamente',
                  status: 200,
                  success: true,
                });
              } else {
                console.log('Usuario no encontrado');
              }

              // -----------  FIN DE LOGICA DE DISCORD -------------- //

              return NextResponse.json(
                { message: 'Notificación de cancelación procesada', success: true },
                { status: 200 }
              );
            }

            if (status !== 'authorized' && status !== 'rejected' && status !== 'cancelled') {
              // console.log('Estado no relevante:', status);
              return NextResponse.json(
                { message: `Estado de suscripción ignorado: ${status}`, success: false },
                { status: 200 }
              );
            }
          } catch (error) {
            // console.error('Error en el proceso de actualización de suscripción:', error);
            return NextResponse.json(
              { error: 'Error procesando la actualización de suscripción' },
              { status: 500 }
            );
          }
        }

        // console.log(`Subscription event received: ${subscriptionId}`);
        return NextResponse.json(
          { message: 'Evento de suscripción recibido', success: true },
          { status: 200 }
        );
      }

      default:
        // console.log(`Unhandled event type: ${body.type}`);
        return NextResponse.json(
          { message: `Tipo de evento no manejado: ${body.type}`, success: false },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
