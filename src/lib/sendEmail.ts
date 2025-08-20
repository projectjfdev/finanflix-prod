
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


   const transport = nodemailer.createTransport({
   // Usamos el servicio de Gmail para el transporte
     host: 'smtp.gmail.com',  // El host SMTP de Gmail
    port: 587,  // Puerto 587 es para conexiones TLS (recomendado para Gmail)
   secure: false, // Se establece a false porque usaremos STARTTLS
    auth: {
       user: process.env.AUTH_EMAIL,  // Tu correo de Gmail
      pass: process.env.AUTH_PASSWORD,  // Tu contraseña o contraseña de aplicación
    },
    tls: {
      rejectUnauthorized: false, // Para evitar errores con certificados no válidos
    },
  } as SMTPTransport.Options);


  type SendEmailDTO = {
    to:string;
    subject: string;
    message: string;
  }

  export const sendEmail = async (dto: SendEmailDTO) =>{
    const {subject,message,to} = dto


    return await transport.sendMail({
        from: "Finanflix Admin Ticket Web",
        to:to,
        subject,
        html: message,
        text: message,
    })
  }