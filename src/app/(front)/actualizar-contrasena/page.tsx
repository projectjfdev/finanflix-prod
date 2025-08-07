'use client';

import { InputText } from '@/components/Inputs/InputText';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
//changes22asd
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertMessage } from '@/utils/AlertMessage/AlertMessage';
import { resetPassword } from '@/utils/Endpoints/authEndpoints';
import { Loading } from '@/utils/Loading/Loading';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import { CheckCircle, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';

interface FormData {
  newPassword: string;
  newPasswordConfirm: string;
}

interface ApprovedProps {
  message: string;
  success: boolean;
}

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const router = useRouter();
  const [messageRes, setMessageRes] = useState<ApprovedProps>();
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: Record<string, any>) => {
    try {
      setloading(true);

      const resp = await resetPassword({
        token: token,
        email: email,
        ...data,
      });

      if (resp.success) {
        toast("Contraseña Restablecida!'", {
          description: 'Se ha restablecido la contraseña de manera exitosa.',
          icon: <CheckCircle className="text-green-500" />,
          duration: 10000,
        });

        setShowModal(true);
        localStorage.setItem('hasUpdatedPassword ', 'true');
      }

      // console.log('resp', resp);
      setMessageRes(resp);
      setloading(false);

      reset();
    } catch (error) {
      console.error('Error al enviar contraseña:', error);
    }
  };

  const onClose = () => {
    return setShowModal(false);
  };

  // useEffect(() => {
  //   localStorage.setItem('hasUpdatedPassword ', 'true');
  // }, []);

  return (
    <Card className="flex justify-center items-center my-10 py-10 px-10 ">
      {/* <LoadingFinanflix /> */}

      <div className="border px-20 py-10 dark:bg-background bg-white rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 ">
          <MediumTitle
            className="text-2xl md:text-3xl dark:text-white text-black"
            title="Restablece tu contraseña 🔒"
          />
          <p className="text-sm md:text-lg pb-4 relative bottom-2 dark:text-white text-black">
            ingresa tu nueva contraseña para proteger tu cuenta
          </p>
          <Label className="dark:text-white text-black" htmlFor="newPassword">
            Contraseña *{' '}
          </Label>
          <Input
            className="rounded-sm dark:bg-card bg-background"
            {...register('newPassword', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres',
              },
            })}
            type="password"
          />
          {errors.newPassword?.message && (
            <span className="text-red-600 mb-4">{errors.newPassword?.message}</span>
          )}
          <Label className="dark:text-white text-black" htmlFor="newPasswordConfirm">
            Confirmar contraseña *{' '}
          </Label>
          <Input
            className="rounded-sm dark:bg-card bg-background"
            {...register('newPasswordConfirm', {
              validate: value => {
                const { newPasswordConfirm } = getValues();
                if (newPasswordConfirm !== value) {
                  return 'Las contraseñas no coinciden';
                }
              },
            })}
            type="password"
          />
          {errors.newPasswordConfirm?.message && (
            <span className="text-red-600 mb-4">{errors.newPasswordConfirm?.message}</span>
          )}
          {loading ? (
            <Button
              className="flex items-center gap-4  py-6 bg-secondary hover:bg-secondary"
              type="submit"
              disabled
            >
              <Loading color="white" size={'20px'} /> Actualizando contraseña...
            </Button>
          ) : (
            <Button
              className="flex items-center gap-4 py-6 bg-primary hover:bg-secondary"
              type="submit"
            >
              Actualizar contraseña
            </Button>
          )}

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
              <Card className="w-full max-w-xl space-y-5 py-7 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-fit cursor-pointer py-1"
                  onClick={() => onClose()}
                >
                  <X className="h-7 w-7" />
                  <span className="sr-only">Closes</span>
                </Button>

                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-bold text-center">
                    ¡Contraseña restablecida exitosamente!
                  </CardTitle>
                </CardHeader>
                <CheckCircle className="w-full h-12 text-green-500 " />
                <CardContent className="flex flex-col items-center gap-3 px-5">
                  {messageRes && (
                    <Alert
                      className={`mt-4 border ${
                        messageRes.success ? 'border-green-500' : 'border-red-500'
                      }`}
                    >
                      {/* <RocketIcon className="h-4 w-4" /> */}
                      <AlertTitle
                        className={messageRes.success ? 'text-green-500' : 'text-red-500'}
                      >
                        {messageRes.success ? 'Éxito' : 'Algo falló'}
                      </AlertTitle>
                      <AlertDescription>{messageRes.message}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>

                <CardFooter className="justify-center">
                  <Button onClick={() => router.push('/login')}>Iniciar Sesion</Button>
                </CardFooter>
              </Card>
            </div>
          )}
          {messageRes && (
            <Alert
              className={`mt-4 border ${
                messageRes.success ? 'border-green-500' : 'border-red-500'
              }`}
            >
              {/* <RocketIcon className="h-4 w-4" /> */}
              <AlertTitle className={messageRes.success ? 'text-green-500' : 'text-red-500'}>
                {messageRes.success ? 'Eliminado' : 'Algo falló'}
              </AlertTitle>
              <AlertDescription>{messageRes.message}</AlertDescription>
            </Alert>
          )}
          {messageRes?.success && (
            <Button type="button" variant="link" onClick={() => router.push('/login')}>
              Iniciar sesión
            </Button>
          )}
        </form>
      </div>
      <Toaster />
    </Card>
  );
};

export default ResetPassword;
