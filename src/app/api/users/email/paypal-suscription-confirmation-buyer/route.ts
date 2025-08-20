import nodemailer from 'nodemailer';
import { connectDB } from '@/lib/dbConfig';
import { NextResponse } from 'next/server';
//import { smtpTransportGmail as smtpTransport } from '@/lib/smtpTransports';
import { smtpTransportHostinger as smtpTransport } from '@/lib/smtpTransports';

export async function POST(req: Request) {
  const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

  const body = await req.json();

  const { suscriptionTitle, payerName, email, price, frequency, frequencyType } = body;

  const domain = `${process.env.APP_URL}`;

  await connectDB();

  try {
    let mailOptions: any = {
      from: AUTH_EMAIL,
      to: email,
      subject: `Confirmación de Compra de Curso - Detalles de Orden - "${suscriptionTitle}"`,
      html: `
      <head>
  <style>
    @media (max-width: 480px) {
      .email-content h2 {
        font-size: 20px;
      }

      .email-content p {
        font-size: 14px;
      }

      .email-footer a {
        font-size: 14px;
        padding: 10px 20px;
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
              <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: white;">¡Felicitaciones, ${
                payerName || ''
              }!</h1>
              <p style="margin: 5px 0 0; font-size: 16px; color:white;">Has adquirido una suscripción en Finanflix</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 30px;" class="email-content">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">

                <tr>
                  <td style="padding-bottom: 20px;" class="email-body">
                    <p style="margin: 10px 0 0; color: #666666; font-size: 16px; line-height: 1.5;">Gracias por tu
                      compra. A continuación, te proporcionamos los detalles de tu compra.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 20px;" class="email-body">
                    <h2 style="margin: 0; color: #333333; font-size: 20px;">Detalles de la Compra:</h2>

                    <ul style="margin: 10px 0 0; padding-left: 20px; color: #000; font-size: 16px; line-height: 1.5;">
                      <li>Título de la Suscripción: <b>${suscriptionTitle}</b></li>
                      <li>Duración de la Suscripción: <b>${frequency} mes o meses</b></li>
                      ${
                        frequencyType !== 'mensual'
                          ? `<li>Importe abonado: <b>$${price}</b></li>`
                          : `<li>Importe a abonar próximo mes: <b>$${price}</b></li>`
                      }
                      <li>Importe abonado: <b>$${price}</b></li>
                      <li>Tipo de suscripcion: <b>${frequencyType}</b></li>
                    </ul>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 20px;" class="email-body">
                    <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.5;">
                      Para obtener más detalles sobre tu compra, haz clic en el botón de abajo.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <a href=${domain}
                      style="background-color: #4C2FBA; color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 16px;">Ver
                      detalles</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 20px;" class="email-body">
              <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.5; text-align: center;">Si tienes
                alguna
                duda, contáctanos a info@finanflix.com </p>
            </td>
          <tr>

          <tr style="padding-bottom: 20px;">
            <td style="text-align: center; padding-bottom: 20px">
              <a href="mailto:info@finanflix.com" class="cta-button"
                style="background-color: #4C2FBA; color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 16px;">Contactar</a>
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
      `,
    };

    const info = await smtpTransport.sendMail(mailOptions);
    // console.log("Email sent: ", info.response);

    return NextResponse.json(
      {
        success: true,
        message: 'Email enviado correctamente a admin Finanflix',
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
