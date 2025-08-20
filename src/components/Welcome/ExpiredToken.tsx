'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { IEmailWelcome } from '@/interfaces/email';
import { sendVerificationEmail, getEmailByToken } from '@/utils/Endpoints/authEndpoints';
import { Card } from '../ui/card';

// Pasó más de una hora y el token expiro
// Ejemplo: -> http://localhost:3000/verify-email?token=8e7d6756-6327-4682-abad-7c5d7e00a840

export const ExpiredToken = () => {
  const [data, setData] = useState<IEmailWelcome>();
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const myUrl = window.location.href;
  const token = myUrl.split('=');

  useEffect(() => {
    const fetchDataWelcome = async () => {
      const res = await getEmailByToken(token[1]);

      setData(res.email);
    };
    fetchDataWelcome();
  }, []);

  // Reenvio de email
  const handleResendEmail = async () => {
    try {
      if (data) {
        const resEmail = await sendVerificationEmail({
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
        });
        // console.log("resEmail", resEmail);
        if (resEmail?.success) {
          toast('Verificación de email enviada', {
            description: 'Revisa tu bandeja de entrada',
          });
          // Deshabilitar el botón de reenvío y comenzar el temporizador
          setIsResendDisabled(true);
          setTimer(5);
        } else {
          toast('Error', {
            description: 'Failed to resend verification email.',
          });
        }
      }
    } catch (error) {
      console.error('Error al reenviar email de verificación:', error);
    }
  };

  // Efecto para que el estado se setee cada 1 segundo durante 1 minuto
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled]);

  return (
    <Card className="shadow-lg flex flex-col items-center justify-center border ">
      <div className="pb-10 flex items-center pt-10">
        <Card className="max-w-xl px-5 text-center  shadow-xl border flex flex-col items-center justify-center gap-3 h-96 md:h-80 py-10 dark:text-white text-black ">
          <div className="max-w-md">
            <div className="text-5xl font-dark font-bold flex justify-center">
              <strong> Token Expirado </strong>
            </div>
            <br />
            <p className="text-center text-lg  font-light leading-normal flex justify-center">
              Por favor reenvía el email de verificación.
            </p>
            <br />
            <p className="mb-8 text-center">
              Parece que hay un problema con tu token de usuario, ya que parece estar expirado. Si
              crees que esto es un error, por favor contactá al soporte. <strong>¡Gracias!</strong>
            </p>
          </div>
          <div className="max-w-lg"></div>

          <div className="flex justify-center ">
            <Button onClick={handleResendEmail} disabled={isResendDisabled}>
              {isResendDisabled ? `Reenviar en ${timer}s` : 'Reenviar Email de Verificación'}
            </Button>
          </div>
        </Card>
      </div>

      {isResendDisabled && (
        <p className="text-center text-green-500">Te hemos enviado un email a tu correo</p>
      )}
    </Card>
  );
};
