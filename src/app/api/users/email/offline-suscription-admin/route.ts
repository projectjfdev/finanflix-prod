import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
//import { smtpTransportGmail as smtpTransport } from '@/lib/smtpTransports';
import { smtpTransportHostinger as smtpTransport } from '@/lib/smtpTransports';

export async function POST(req: Request) {
  const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

  const body = await req.json();

  const {
    title,
    email,
    suscriptionId,
    bank,
    priceArg,
    countryCode,
    phone,
    firstName,
    lastName,
    country,
    address,
    postalCode,
    dni,
  } = body;

  const domain = `${process.env.APP_URL}/suscription/orders`;

  /**
   *
   * @param {string} bankUSD - Cuenta bancaria en dólares (USD). Ejemplo: "123-456-7890".
   * @param {string} bankAR - Cuenta bancaria en pesos argentinos (AR). Ejemplo: "987-654-3210".
   * @param {"USD" | "AR"} bank - Moneda de la cuenta bancaria utilizada para el pago.
   *                              Puede ser "USD" (dólares) o "AR" (pesos).
   */

  await connectDB();

  try {
    let mailOptions: any = {
      from: AUTH_EMAIL,
      to: AUTH_EMAIL,
      subject: `Notificación de Solicitud de Pago Offline en ${bank} – Finanflix `,
      html: `
<!DOCTYPE html>
<html lang="es">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Notificación de Solicitud de Pago Offline – Finanflix</title>
   <style>
      @media screen and (max-width: 600px) {
         .email-container {
            width: 100% !important;
         }

         .email-content {
            padding: 20px !important;
         }

         .email-header h1 {
            font-size: 20px !important;
         }

         .email-body h2 {
            font-size: 18px !important;
         }

         .email-body p,
         .email-body li {
            font-size: 14px !important;
         }

         .cta-button {
            font-size: 14px !important;
            padding: 10px 20px !important;
         }
      }
   </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
   <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
      style="max-width: 600px;" class="email-container">
      <tr>
         <td style="background-color: #ffffff;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
               <tr>
                  <td style="padding: 20px; text-align: center; background-color: #4C2FBA;" class="email-header">
                     <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Notificacion de venta - Finanflix</h1>
                  </td>
               </tr>
               <tr>
                  <td style="padding: 30px 30px;" class="email-content">
                     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                           <td style="text-align: center; padding-bottom: 30px;">
                              <img
                                 src="https://res.cloudinary.com/drlottfhm/image/upload/v1732240542/pngwing.com_rrug2p.png"
                                 alt="Icono de Notificación" width="100" height="100" style="max-width: 100%; height: auto;">
                           </td>
                        </tr>
                        <tr>
                           <td style="padding-bottom: 20px;" class="email-body">
                              <h2 style="margin: 0; color: #333333; font-size: 20px;">Datos del comprador - Finanflix</h2>
                              <p style="margin: 10px 0 0; color: #666666; font-size: 16px; line-height: 1.5;">Se ha recibido una nueva nueva orden de compra. A continuación, los detalles:</p>
                           </td>
                        </tr>

                        <tr>
                           <td style="padding-bottom: 20px;" class="email-body">
                              <ul style="margin: 10px 0 0; padding-left: 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                                 <li>ID de la suscripción  abonada: <b>${suscriptionId}</b></li>
                                 <li>Precio de la suscripción  vendida: <b>$${priceArg}</b></li>
                                 <li>Título de la suscripción  vendida: <b>${title}</b></li>
                                 <li>Email del Cliente:<b>${email}</b></li>
                                 <li>Nombre del Cliente: <b> ${firstName} </b></li>
                                 <li>Apellido del Cliente: <b> ${lastName} </b></li>
                                 <li>Teléfono: <b> ${countryCode}${phone} </b></li>
                                 ${country && `<li>Pais:<b>${country}</b></li>`}
                                 ${address && `<li>Dirección:<b>${address}</b></li>`}
                                 ${postalCode && `<li>Código Postal:<b>${postalCode}</b></li>`}
                                 ${dni && `<li>DNI:<b>${dni}</b></li>`}          
                              </ul>
                           </td>
                        </tr>

                        <tr>
                           <td style="padding-bottom: 20px;" class="email-body">
                              <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.5;">Para ver más información sobre esta compra y gestionar los pagos pendientes, haz clic en el botón de abajo.</p>
                           </td>
                        </tr>
                        <tr>
                           <td style="text-align: center;">
                              <a href=${domain} class="cta-button"
                                 style="background-color: #4C2FBA; color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 16px;">Administrar Pagos</a>
                           </td>
                        </tr>
                     </table>
                  </td>
               </tr>
               <tr>
                  <td
                     style="background-color: #f8f8f8; padding: 20px; text-align: center; color: #999999; font-size: 14px; border-top: 1px solid #eeeeee; ">
                     <p style="margin: 0 0 10px;">Este es un mensaje automático. Por favor, no responda a este correo.</p>
                     <p style="margin: 10px 0 0;">© 2025 Finanflix. Todos los derechos reservados.</p>
                  </td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</body>
</html>
            `,
    };

    const info = await smtpTransport.sendMail(mailOptions);
    // console.log("Email sent: ", info.response);

    return NextResponse.json(
      {
        success: true,
        message: 'El email de la creación de la orden fue enviado al administrador',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
