import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Loading } from '@/utils/Loading/Loading';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle, MailCheck } from 'lucide-react';
import { Input } from '../ui/input';
import { sendEmailResetYourPassword } from '@/utils/Endpoints/emailEndpoints';
import { Toaster, toast } from 'sonner';

interface FormData {
  email: string;
}

const FormForgotPassword = () => {
  const [messageRes, setMessageRes] = useState({ message: '', success: null });
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [loading, setloading] = useState(false);
  const [timer, setTimer] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: Record<string, any>) => {
    try {
      setloading(true);
      const resp = await sendEmailResetYourPassword(data);

      if (resp.success) {
        toast('Compruebe su correo', {
          description:
            'Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña.',
          icon: <CheckCircle className="text-green-500" />,
          duration: 10000,
        });
      }
      setMessageRes(resp);
      setIsResendDisabled(true);
      setTimer(5);
      setloading(false);
      reset();
    } catch (error) {
      console.error('Error al enviar contraseña:', error);
    }
  };

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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 pb-5"
      >
        <div className="flex flex-col items-start w-full xl:w-1/4  relative">
          <Input
            className="dark:bg-card bg-background"
            type="email"
            {...register('email', {
              required: 'El email es requerido para recuperar tu acceso',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Ingresa un email válido',
              },
            })}
            placeholder="Tu correo electrónico"
            name="email"
          />
          {errors?.email && (
            <span className="text-red-600 text-sm text-start absolute top-full  mt-1 ">
              {errors.email.message}
            </span>
          )}
        </div>

        {loading ? (
          <Button type="submit" disabled>
            <Loading size={'20px'} /> Enviando email...
          </Button>
        ) : (
          <Button
            className="rounded-full hover:bg-secondary"
            type="submit"
            size="lg"
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `Posibilidad de reenviar en ${timer} segundos` : 'Recuperar acceso'}
          </Button>
        )}
      </form>

      <div className="flex justify-center mb-10">
        {messageRes.message && (
          <Alert
            className={`relative w-full max-w-4xl px-6 py-4 mt-5 dark:bg-background bg-white dark:text-white text-black rounded-lg  border ${
              messageRes.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            } flex items-center gap-4`}
          >
            <div className="w-full flex flex-col justify-center">
              <AlertTitle
                className={`font-semibold w-full text-lg ${
                  messageRes.success ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <div className="flex items-center justify-center gap-5 w-full">
                  <div
                    className={`p-2 rounded-full w-fit ${
                      messageRes.success
                        ? 'dark:bg-card bg-white text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <MailCheck className="h-5 w-5" />
                  </div>

                  <p className="text-xl dark:text-white text-black">
                    {messageRes.success ? 'Correo enviado con éxito' : 'Error al enviar el correo'}
                  </p>
                </div>
              </AlertTitle>

              <AlertDescription className="text-sm  mt-1 leading-relaxed dark:text-white text-black">
                {messageRes.message}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default FormForgotPassword;
