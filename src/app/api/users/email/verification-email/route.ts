import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import Welcome from '@/models/welcomeEmailModel';
// https://www.youtube.com/watch?v=QyGJLm55EDk
// https://github.com/bwestwood11/verification-email-token-authjs

import { smtpTransportHostinger as smtpTransport } from '@/lib/smtpTransports';

export async function POST(req: Request) {
  const { AUTH_EMAIL } = process.env;

  const body = await req.json();

  const { email, username } = body;

  const token = crypto.randomUUID();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

  const domain = `${process.env.APP_URL}`;
  const confirmationLink = `${domain}/verify-email?token=${token}`;
  await connectDB();

  try {
    let newEmailWelcome = new Welcome({
      email,
      username,
      token,
      expires: new Date(expires),
    });

    newEmailWelcome = await newEmailWelcome.save();

    let mailOptions: any = {
      from: AUTH_EMAIL,
      to: email,
      subject: `Bienvenido ${username}`,
      html: `

     <head>

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


  <section style="max-width: 42rem; padding: 2rem 1.5rem; margin: 0 auto; background-color: white; color: black;">
       <header>
  <a href="/">
    <img src="https://res.cloudinary.com/drlottfhm/image/upload/v1731995579/logox_posz7x.png" alt="logo finanflix"  />
  </a>
</header>

    <main style="margin-top: 2rem;">
      <br>
      <div style="display: flex; gap:15px; padding-top: 10px;">
        <h1 style="font-weight: bold; font-size: 1.1rem; ">¡Bienvenido a FinanFlix! Empezá tu camino de
          aprendizaje financiero hoy mismo.</h1>
      </div>

      <div style="margin-top: 0.5rem; line-height: 1.75; color: #4a5568; font-size: 1.1rem; line-height: 1.8rem;">

        <p>Estás a un paso de convertirte en un experto en finanzas y expandir tus conocimientos.
          <br> <strong>Hacé clic abajo para confirmar tu cuenta y comenzar a aprender 👇</strong>
        </p>

        <a href="${confirmationLink}" style="display: inline-block; text-decoration: none; cursor: pointer; ">
          <div style="cursor: pointer; padding: 0.3rem 1.5rem; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.05em; color:
                          white; text-transform: capitalize; background-color: #3182ce; border: none; border-radius: 0.5rem; cursor: pointer; transition:
                          background-color 0.3s, transform 0.3s;">
            CONFIRMAR CUENTA
          </div>
        </a>
      </div>

      <br>
      <br>
      <div style=" font-size: 1.1rem;">
        <strong>IMPORTANTE:</strong> <span style="font-weight: bold; color: red;">El token de activación es
          válido solo por 1 hora, así que asegurate de completar el proceso dentro de este período.</span>
      </div>
      <br>
      <hr>

      <div style="font-family: 'Arial', sans-serif; border-radius: 10px;">

        <h2 style="font-size: 1.3rem;">GUÍA RÁPIDA PARA EMPEZAR A APRENDER EN FINANFLIX</h2>
        <div style="font-size:1.1rem;">

          <p>Empezá a aprender y aprovechá al máximo tu experiencia en la plataforma. 👊</p>
          <p><strong>¿Querés algunos consejos para empezar?</strong></p>

          <ul style="list-style: none; margin: 0; padding: 0;">
            <li>
              <strong>1. Iniciá sesión en tu cuenta</strong> <br>
              <div style="padding-top: 5px;"> Completa tu perfil con todos tus datos.
              </div>

            </li>
            <li style="line-height: 1.5rem;">
              <strong> 2. Cumplimiento de misiones diarias</strong> <br>
              <div style="padding-top: 5px;">Recuerda que hay desafíos disponibles que te permitirán ganar
                puntos y mejorar tu experiencia.
              </div>

            </li>
            <li style="line-height: 1.5rem;">
              <strong>3. Construí tu reputación</strong> <br>
              <div style="padding-top: 5px;">Si completás los cursos, ganarás puntos y obtendrás grandes
                beneficios. Además, si te contratan, hacé lo que mejor sabés hacer, cumplí con los plazos y
                horarios,<br> y esforzate por impresionar. ¡De esta manera, atraerás a estudiantes de todo
                el mundo!
              </div>
            </li>

          </ul>
        </div>
        <hr>

    </main>
    <footer style="margin-top: 1.5rem; font-size: 1rem; position: relative; top: 15px;">
      <p> Si necesitás ayuda para empezar, no dudes en enviarnos un correo a <a
          href="mailto:info@finanflix.com">contacto@finanflix.com</a> y estaremos encantados de asistirte.
      </p>

      <p style="color: #1e232b;">
        De acuerdo con las regulaciones de seguridad, este correo confirma tu cuenta para ayudar a prevenir
        cualquier riesgo de seguridad. Si tenés alguna inquietud, no dudes en contactarnos.
      </p>

      <div style="font-size:1.1rem; font-size: 1rem;">
        <p> ¡Gracias por ser parte de la comunidad de FinanFlix! A nuestro equipo le encanta compartir tus logros,
          así que asegurate de etiquetarnos en las redes sociales!
        </p>
      </div>
      <p style=" color: #1e232b;">
        Equipo de FinanFlix
      </p>

      <p style="margin-top: 0.75rem; color: #1e232b; font-size: 1rem; font-style: italic;"> © 2025 FinanFlix - Todos
        los Derechos Reservados. </p>
    </footer>

  </section>
            `,
    };

    await smtpTransport.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: 'Bienvenido a Finanflix. Por favor confirme su email y logueese',
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
