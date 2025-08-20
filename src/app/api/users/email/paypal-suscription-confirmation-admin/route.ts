import nodemailer from 'nodemailer';
import { connectDB } from '@/lib/dbConfig';
import { NextResponse } from 'next/server';
//import { smtpTransportGmail as smtpTransport } from '@/lib/smtpTransports';
import { smtpTransportHostinger as smtpTransport } from '@/lib/smtpTransports';

export async function POST(req: Request) {
  const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

  const body = await req.json();

  // buyerId: session?.user?._id.toString(),
  // buyerUsername: session?.user?.username,
  // sellerUsername: course.userId.username,
  // email: "projectfinanflix@gmail.com",

  const { suscriptionTitle, buyerUsername, buyerId, email, price, frequency, frequencyType } = body;

  const domain = `${process.env.APP_URL}/dashboard/orders`;

  await connectDB();

  try {
    let mailOptions: any = {
      from: AUTH_EMAIL,
      to: AUTH_EMAIL,
      subject: `${buyerUsername} ha comprado una Suscripción en Finanflix`,
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
                padding: 8px 16px;
               
            }
        }
    </style>
</head>

<section style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 50px 0 120px 0; width: 100%;">
    <div  style="max-width: 600px; margin: 20px auto 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div class="email-header" style="background-color: #181343; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${buyerUsername} ha comprado una Suscripción en Finanflix</h1>
        </div>
    
        <div class="email-content" style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">ID del cliente:  <b>${buyerId}</b> </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Nombre del cliente: <b>${buyerUsername}</b> </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Email del cliente:  <span style="font-weight: 700;"><b>${email}</b></span>  </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Suscripción abonada: <b>${suscriptionTitle}</b> </p>
             <p style="font-size: 16px; color: #555555; line-height: 1.5;">Meses Suscripto: <b>${frequency}</b> </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Tipo de suscripción: <b>${frequencyType}</b> </p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Precio en dolares de la Suscripción abonada: <b>$${price} USD</b> </p>
             <div>
                  <div style="padding-bottom: 20px;" class="email-body">
                    <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.5;">
                     Para obtener más detalles sobre la orden, haz clic en el botón de abajo
                    </p>
                  </div>
                </div>
                <div>
                  <div style="text-align: center;">
                    <a href=${domain}
                      style="background-color: #4C2FBA; color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 16px;">Ver detalles</a>
                  </div> 
                </div>
        </div>
    </div>
    
    </section>
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
