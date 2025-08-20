'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import BigTitle from '../BigTitle/BigTitle';
import { InputText } from '../Inputs/InputText';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import { Bot, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { sendVerificationEmail } from '@/utils/Endpoints/authEndpoints';
import './Login.css';
import { Input } from '../ui/input';
import { Loading } from '@/utils/Loading/Loading';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';

interface FormData {
  email: string;
  password: string;
}

interface LoginProps {
  switchToRegister?: () => void;
}

export const Login = ({ switchToRegister }: LoginProps) => {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({ email: '', username: '' });
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.ok) {
        toast(`Ingreso exitoso!`, {
          description: 'Bienvenido a Finanflix!',
          className: 'flex items-center justify-between bg-[#F3F4F6] text-black p-4',
          action: (
            <button
              className="flex items-center justify-center text-white rounded-full"
              style={{ marginLeft: '10px' }}
              onClick={() => toast.dismiss()}
            >
              <CheckCircle className="text-green-500 mr-2 " />
            </button>
          ),
        });

        // No reseteamos isLoading aquí para mantener el botón en estado de carga
        const timer = setTimeout(() => {
          router.push('/');
        }, 4000);
        return () => clearTimeout(timer);
      } else {
        // Si no es exitoso, reseteamos isLoading
        setIsLoading(false);

        if (res?.status === 403) {
          setError('Validate your account');
          await sendVerificationEmail({
            email: formData.email,
            username: 'alumno',
          });
        } else if (res?.status === 401) {
          setError('Email o contraseña incorrecto');
        }
      }
      setUserData({ email: formData.email, username: 'alumno' });
    } catch (error) {
      // console.error('Error al iniciar sesión:', error);
      setError('An error occurred while trying to log in. Please try again.');
      setIsLoading(false);
    }
  };

  // const handleDiscordLogin = () => {
  //   signIn('discord'); // Esto abrirá el flujo de autenticación de Discord
  // };

  const handleResendEmail = async () => {
    try {
      const resEmail = await sendVerificationEmail(userData);

      if (resEmail?.success) {
        toast('Verificación de email enviada', {
          description: 'Revisa tu bandeja de entrada.',
        });
        setIsResendDisabled(true);
        setTimer(10);
      } else {
        toast('Error', { description: 'Failed to resend verification email.' });
      }
    } catch (error) {
      console.error('Failed to resend verification email.', error);
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
    <>
      <Card className="mt-5">
        <div className="dark:border-card ">
          {error === 'Validate your account' ? (
            <Card className="w-full max-w-md">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-primary rounded-full p-3">
                      <Mail className="text-primary-foreground" size={32} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">Verifica tu correo electrónico</h2>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Hemos enviado un enlace de verificación a
                    </p>
                    {userData.email ? (
                      <p className="font-medium text-lg">{userData?.email}</p>
                    ) : (
                      <LoadingFinanflix />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solo haz clic en el enlace de ese correo para completar tu registro. Si no lo
                    ves, es posible que necesites{' '}
                    <span className="font-semibold">revisar tu carpeta de spam</span>.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ¿Aún no encuentras el correo? No te preocupes.
                  </p>
                  <Button
                    className="w-full"
                    onClick={handleResendEmail}
                    disabled={isResendDisabled || !userData.email}
                  >
                    {isResendDisabled ? `Reenviar en ${timer}s` : 'Reenviar correo de verificación'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form
              className="flex flex-col gap-2 px-5 py-5 dark:bg-background "
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* DIV sin clase QUE CONTIENE PARA DARTE UTILIDAD AL FLEX PADRE */}
              <div>
                <div className="flex justify-center">
                  <Image
                    src={
                      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703510/logof_iwnccv.png'
                    }
                    className=" lg:flex w-[200px]"
                    alt="Finanflix Logo"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="text-center pb-5">
                  <BigTitle
                    className="pb-3 pt-[21px] ml-3 md:ml-0 text-2xl md:text-[31.73px] dark:text-white text-black"
                    title="Inicia sesión"
                  />
                </div>

                <p className="text-xs text-[#A7A7A7] font-poppins pb-3">
                  Es necesario haberse registrado y estar verificado antes de que puedas continuar.
                </p>

                <Label className="dark:text-white text-black text-xs md:text-sm" htmlFor="email">
                  Email
                </Label>
                <InputText
                  className=" border-none dark:bg-card bg-background dark:text-white text-black"
                  type="email"
                  errors={errors?.email?.message}
                  register={register('email', {
                    required: 'El correo electrónico es obligatorio',
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: 'Ingresa una dirección de correo electrónico válida',
                    },
                  })}
                  name="email"
                  placeholder="Introduce tu correo electrónico"
                />
                <Label className="dark:text-white text-black text-xs md:text-sm" htmlFor="password">
                  Contraseña
                </Label>
                <Input
                  className="dark:bg-card dark:text-white bg-background text-black my-2"
                  {...register('password', {
                    required: 'Contraseña es requerida',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres',
                    },
                  })}
                  type="password"
                  placeholder="********"
                />
                {errors?.password?.message && (
                  <span className="text-red-600 mb-4">{errors?.password?.message}</span>
                )}
                {error && <span className="text-red-600 mb-4">{error}</span>}
              </div>
              <Button
                className="flex items-center justify-center gap-4 py-6 text-white text-[16px] dark:hover:bg-[rgba(240, 52, 0, 1)] disabled:bg-secondary disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center h-full relative bottom-[10px]">
                    <span className="flex items-center">
                      <span className="dot animate-dot text-[40px] font-bold">.</span>
                      <span className="dot animate-dot animation-delay-100 text-[40px] font-bold">
                        .
                      </span>
                      <span className="dot animate-dot animation-delay-200 text-[40px] font-bold">
                        .
                      </span>
                    </span>
                  </span>
                ) : (
                  <p className="text-xs md:text-sm">INGRESAR</p>
                )}
              </Button>

              <div>
                <Link href="/recuperar-contrasena">
                  <Button
                    variant="link"
                    className="text-center text-xs md:text-sm w-full dark:hover:text-gray-300 dark:text-white text-black hover:text-primary hover:no-underline"
                    type="button"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </Link>
              </div>

              <div className="flex justify-center items-center gap-2  ">
                <hr className="h-[2px] w-10  bg-[#666666]"></hr>{' '}
                <p className="dark:text-[#D3D3D3] text-black text-xs ">O ingresa con </p>{' '}
                <hr className="h-[2px] w-10 text-white bg-[#666666]"></hr>
              </div>

              {/* <Button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="flex items-center justify-center gap-3 w-full py-6 mb-2 bg-transparent border border-[#B7B7B7] rounded-[5px] hover:bg-gray-800"
              >
                <Image
                  src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703454/google-logo_sx8mz4.png"
                  height={24}
                  width={24}
                  alt="Logo de Google"
                  className="w-4 h-4"
                />
                <p className="text-white font-bold text-xs md:text-sm">GOOGLE</p>
              </Button> */}

              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full border border-[#B7B7B7] flex items-center justify-center gap-x-3 py-3  rounded-[5px] text-xs sm:text-sm font-medium hover:bg-gray-800"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 533.5 544.3"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.2H272v95h146.9c-6.3 33.9-25 62.5-53.2 81.8v68.1h85.8c50.2-46.3 82-114.6 82-194.7z"
                    fill="#4285F4"
                  />
                  <path
                    d="M272 544.3c71.6 0 131.7-23.7 175.7-64.2l-85.8-68.1c-23.8 16-54.1 25.4-89.9 25.4-69.1 0-127.6-46.6-148.4-109.3h-89.6v68.9C77.7 480.5 168.5 544.3 272 544.3z"
                    fill="#34A853"
                  />
                  <path
                    d="M123.6 328.1c-10.8-32.1-10.8-66.9 0-99l-89.6-68.9c-39.1 77.6-39.1 168.3 0 245.9l89.6-68z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M272 107.7c37.4-.6 73.5 13.2 101.1 38.7l75.4-75.4C403.4 24.5 341.4 0 272 0 168.5 0 77.7 63.8 34 159.2l89.6 68.9C144.4 154.3 202.9 107.7 272 107.7z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="relative top-[1px] ">GOOGLE</span>
              </button>

              <div className="text-xs text-[#D1D1D1] font-poppins py-2 text-center">
                No tenes una cuenta todavia? Hace click{' '}
                <Link
                  onClick={switchToRegister}
                  className="text-[#702DFF] dark:hover:text-[#2d65ff]"
                  href={''}
                >
                  aca
                </Link>
              </div>
            </form>
          )}
        </div>
      </Card>
      <Toaster />
    </>
  );
};
