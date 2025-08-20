import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import Reset from '@/models/resetPasswordModel';
import userModel from '@/models/userModel';
//import { smtpTransportGmail as smtpTransport } from '@/lib/smtpTransports';
import { smtpTransportHostinger as smtpTransport } from '@/lib/smtpTransports';

// https://www.youtube.com/watch?v=QyGJLm55EDk
// https://github.com/bwestwood11/verification-email-token-authjs

export async function POST(req: Request) {
  const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

  const body = await req.json();

  const { email } = body;

  const token = crypto.randomUUID();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

  const domain = `${process.env.APP_URL}`;
  const redirectToResetPassword = `${domain}/actualizar-contrasena?token=${token}&email=${email}`;
  await connectDB();

  try {
    let newResetPassword = new Reset({
      email,
      token,
      expires: new Date(expires),
    });

    const existingUser = await userModel.findOne({
      email: email,
    });

    if (!existingUser)
      return NextResponse.json(
        {
          message: `${email} no se encuentra registrado en nuestra plataforma`,
        },
        {
          status: 404,
        }
      );

    newResetPassword = await newResetPassword.save();

    let mailOptions: any = {
      from: AUTH_EMAIL,
      to: email,
      subject: `Reset password Finanflix`,
      html: `
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Actualizar Clave Finanflix</title>

  <style>
     ul li {
        padding: 10px 0;
     }

     .header-img-mobile {
        display: none;
     }

     @media only screen and (max-width: 600px) {
        hr {
           margin-top: 20px;
        }

        .header-img-mobile {
           height: 45px !important;
           display: block;
           margin-right: 15px !important;
           margin-top: 25px !important;
        }

        .header-img {
           display: none;
        }
     }
  </style>
</head>

<section
  style="
     max-width: 42rem;
     padding: 2rem 1.5rem;
     margin: 0 auto;
     background-color: #e1e5e8;
     color: black;
  "
>
  <main style="margin-top: 2rem">
     <div
        style="
           max-width: 32rem;
           margin: 2.5rem auto;
           background-color: white;
           padding: 2rem;
           border-radius: 0.75rem;
           box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
              0 1px 2px 0 rgba(0, 0, 0, 0.06);
        "
     >
        <div id="primary" class="content-area" style="text-align: center">
                 <img src="https://res.cloudinary.com/drlottfhm/image/upload/v1731995579/logox_posz7x.png" alt="logo finanflix"  />
           <h1 style="font-size: 2.25rem; font-weight: 500">
              ¡Bienvenido a nuestra nueva plataforma!
           </h1>
           <p style="color: #64748b">
           Es hora de activar tu cuenta y descubrir todo lo que nuestra nueva plataforma tiene para ofrecer. Actualiza tu contraseña ahora y empieza a disfrutar de la experiencia.
           </p>
        </div>

        <div style="margin-top: 2rem; color: #4a5568;">
          <p>Hola Bienvenido ${email} </p>
          <p>Te damos la bienvenida a la nueva plataforma de Finanflix. Hemos trabajado para mejorar tu experiencia y hacerla aún más completa en el mundo del trading. Algunas de las novedades que encontrarás son:</p>
          <ul style="list-style-type: none; padding-left: 0;">
              <li>✅ Interfaz fácil de usar y muy intuitiva</li>
              <li>✅ Contenido actualizado con nuevas estrategias de trading</li>
              <li>✅ Herramientas interactivas para practicar y mejorar</li>
              <li>✅ Comunidad de traders más conectada</li>
          </ul>
          <p>Nos pone muy contentos que estés con nosotros en esta nueva etapa. ¡Esperamos que disfrutes de la plataforma y comiences un nuevo camino con nosotros!</p>
      </div>
      
        <div style="margin-top: 2.5rem">
           <a
              href="${redirectToResetPassword}"
              style="
                 text-decoration: none;
                 cursor: pointer;
                 width: 100%;
                 padding: 0.75rem;
                 font-weight: 500;
                 color: white;
                 background-color: #1a1448;
                 border-radius: 0.5rem;
                 border: 1px solid #4f46e5;
                 display: inline-flex;
              
                text-align: center;
                 gap: 0.5rem;
                 transition: background-color 0.2s, box-shadow 0.2s;
              "
           >
           
              <span style="width: 100%;" >Actualiza la contraseña para reactivar la cuenta.</span>
           </a>
        </div>

        <br />
        <hr />

        <div style="font-family: 'Arial', sans-serif; border-radius: 10px">
           <footer
              style="
                 color: #949ca0;
                 margin-top: 1.5rem;
                 font-size: 1rem;
                 position: relative;
                 top: 15px;
                 text-align: center;
              "
           >
              <p>
                 ¿Tienes preguntas sobre la nueva plataforma? Escríbenos a
                 <a href="mailto:info@finanflix.com">info@finanflix.com</a> y
                 estaremos encantados de ayudarte.
              </p>

              <p>
                ¿Tienes problemas con recuperar el usuario? Envia un ticket a
                <a href="https://soporte-finanflix.vercel.app">Soporte</a> y
                solucionaremos tus problemas.
             </p>

              <div style="font-size: 1.1rem; font-size: 1rem">
                 <p>
                    ¡Gracias por ser parte de la evolución de Finanflix! Comparte tu
                    experiencia con la nueva plataforma en redes sociales y etiquétanos.
                 </p>
              </div>
              <p>El equipo de Finanflix</p>
              <p
                 style="
                    margin-top: 0.75rem;
                    font-size: 1rem;
                    font-style: italic;
                 "
              >
                 © 2025 Finanflix - Todos los derechos reservados.
              </p>
           </footer>
        </div>
     </div>
  </main>
</section>
      `,
    };

    const info = await smtpTransport.sendMail(mailOptions);
    // console.log("Email sent: ", info.response);

    return NextResponse.json(
      {
        success: true,
        message:
          'Se ha enviado un correo electrónico a su bandeja de entrada con instrucciones para restablecer su contraseña. Si no lo ves, comprueba tu carpeta de correo no deseado. Tenga en cuenta que dispone de 1 hora para restablecer su contraseña antes de que caduque el enlace.',
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
