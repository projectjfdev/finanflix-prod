import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
//import { smtpTransportGmail as smtpTransport } from '@/lib/smtpTransports';
import { smtpTransportHostinger as smtpTransport } from '@/lib/smtpTransports';

export async function POST(req: Request) {
  const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

  const body = await req.json();

  const { userEmail, name, reason, price, currencyId } = body;

  await connectDB();

  try {
    let mailOptions: any = {
      from: AUTH_EMAIL,
      to: userEmail,
      subject: `Tu suscripción ha sido cancelada - "${reason}"`,
      html: `
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Suscripción cancelada!</title>
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
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">¡Suscripción cancelada!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 30px;" class="email-content">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 10px;">
                    <img src="https://res.cloudinary.com/drlottfhm/image/upload/v1732240542/pngwing.com_rrug2p.png"
                      alt="Icono de Pago" width="100" height="100" style="max-width: 100%; height: auto;">
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 20px;" class="email-body">
                    <p style="margin: 10px 0 0; color: #666666; font-size: 16px; line-height: 1.5;">A continuación, te compartimos los detalles de la orden cancelada.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 20px;" class="email-body">
                    <h2 style="margin: 0; color: #333333; font-size: 20px;">Informacion de la suscripción:</h2>
                    <ul style="margin: 10px 0 0; padding-left: 20px; color: #000; font-size: 16px; line-height: 1.5;">
                      <li>Titulo de la Suscripción: <b>${name}</b></li>
                      <li>Duracion del Suscripción: <b>${reason} mes o meses</b></li>
                      <li>Precio: <b>$${price} ${currencyId}</b></li>
                    </ul>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

           <tr>
            <td
              style="padding: 20px; text-align: center; color: #999999; font-size: 14px; border-top: 1px solid #eeeeee; ">
              <p style="margin: 0 0 10px;">Síguenos en redes sociales:</p>
              <a target="_blank" href="https://twitter.com/finanflix"
              style="display: inline-block; margin: 0 5px; text-decoration: none; color: #585858;">Twitter</a>
              <a target="_blank" href="https://www.youtube.com/finanflix"
              style="display: inline-block; margin: 0 5px; text-decoration: none; color: #585858;">Youtube</a>
              <a target="_blank" href="https://www.instagram.com/finanflix.ok"
              style="display: inline-block; margin: 0 5px; text-decoration: none; color: #585858;">Instagram</a>
              <a target="_blank" href="https://discord.gg/yNKR8gR6PP"
                style="display: inline-block; margin: 0 5px; text-decoration: none; color: #585858;">Discord</a>
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
    // console.log('Email sent: ', info.response);

    return NextResponse.json(
      {
        success: true,
        message: 'El email de la creación de la orden fue enviado al comprador',
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
