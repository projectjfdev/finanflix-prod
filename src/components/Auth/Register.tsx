'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { InputText } from '../Inputs/InputText';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { CircleAlert, Mail, Router } from 'lucide-react';
import { Card } from '../ui/card';
import { registerUser, sendVerificationEmail } from '@/utils/Endpoints/authEndpoints';
import BigTitle from '../BigTitle/BigTitle';

import Link from 'next/link';
import { Label } from '../ui/label';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';

export const Register: React.FC = () => {
  const [messageRes, setMessageRes] = useState({
    message: '',
    success: null,
    email: '',
  });
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    tel: '',
  });
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleClickTooltip = (e: any) => {
    e.preventDefault();
  };

  const onSubmit = async (data: Record<string, any>) => {
    try {
      const res = await registerUser('/api/auth/register', data);
      // reset();

      if (res?.success) {
        // if (res?.message === "User successfully registered") {
        toast(`Welcome`, {
          description: 'Disfruta de de la experiencia Finanflix 2.0',
          action: {
            label: 'Logueate',
            onClick: () => console.log('Undo'),
          },
        });
        setUserData({
          email: data.email,
          username: data.username,
          tel: data.tel,
        });
        // Envio de email
        const emailBody = {
          email: data.email,
          username: data.username,
          tel: data.tel,
        };

        await sendVerificationEmail(emailBody);
      }
      setMessageRes(res);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  const handleResendEmail = async () => {
    try {
      const resEmail = await sendVerificationEmail(userData);
      // console.log('resEmail', resEmail);
      if (resEmail?.success) {
        toast('Verificacion de email enviada', {
          description: 'Revisa tu bandeja de entrada.',
        });
        // Deshabilitar el botón de reenvío y comenzar el temporizador
        setIsResendDisabled(true);
        setTimer(10); // 60 segundos
      } else {
        toast('Error', { description: 'Failed to resend verification email.' });
      }
    } catch (error) {
      console.error('Error al reenviar email de verificación:', error);
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
    <Card className="mt-5">
      {messageRes?.success ? (
        <div className="text-center">
          <div className="flex justify-center">
            <Mail className=" p-2 text-white" size={50} />
          </div>
          <h2 className="text-xl my-6">Verifica tu dirección de correo electrónico</h2>
          <p className="font-poppins relative bottom-2 text-sm pr-5 text-[#A7A7A7] ">
            Hemos enviado un enlace de verificación a
          </p>
          {userData.email ? (
            <p className="font-medium text-lg">{userData?.email}</p>
          ) : (
            <LoadingFinanflix />
          )}
          <p className="my-6 font-poppins relative text-sm px-3 text-[#A7A7A7]">
            Simplemente haz clic en el enlace de ese correo para completar tu registro. Si no lo
            ves, es posible que debas{' '}
            <span className="font-bold text-white">revisar tu carpeta de spam.</span>
          </p>
          <p className="mb-4 font-poppins relative bottom-2 text-[13px] pr-5 text-[#A7A7A7] ">
            ¿Aún no encuentras el correo? No hay problema.
          </p>
          {/* TODO: Implementar reenvio de email */}
          <div className="flex flex-col">
            <Button
              onClick={handleResendEmail}
              disabled={isResendDisabled}
              className="mb-4 text-white font-bold  mr-[9px] text-[11px] "
            >
              {isResendDisabled
                ? `REENVIAR EN ${timer}s`
                : 'REENVIAR NOTIFICACIÓN POR CORREO ELECTRÓNICO'}
            </Button>
            <Button
              onClick={() => router.push('/')}
              disabled={isResendDisabled}
              className="mb-4 text-white font-bold  mr-[9px] text-[11px] "
            >
              INICIO
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 md:gap-2 px-5 py-5 dark:bg-background "
        >
          <div className="dark:text-white text-black">
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
                className="pb-3 pt-[21px] ml-3 md:ml-0 text-2xl md:text-[31.73px]"
                title="Crea tu cuenta"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <Label htmlFor="username" className="text-xs md:text-sm">
                  Nombre de usuario *
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger onClick={handleClickTooltip}>
                      <CircleAlert size={15} color="#f03300" className="hidden md:flex" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="dark:text-white text-white text-xs md:text-sm break-words">
                        Este será tu nombre de usuario único y no podrás cambiarlo por razones de
                        seguridad, así que tómate un momento para elegirlo con cuidado.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <InputText
                className="dark:bg-[#282844] bg-background"
                type="text"
                errors={errors?.username?.message}
                // label="Nombre de usuario *"
                name="username"
                register={register('username', {
                  required: 'El nombre de usuario es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre de usuario no puedo tener más de 20 caracteres',
                  },
                  maxLength: {
                    value: 20,
                    message: 'El nombre de usuario debe tener al menos 2 caracteres',
                  },
                })}
                placeholder="Crea un nombre de usuario único"
              />
            </div>

            <div>
              <Label htmlFor="firstName" className="text-xs md:text-sm">
                Nombre
              </Label>
              <InputText
                className="dark:bg-[#282844] bg-background"
                type="text"
                errors={errors?.firstName?.message}
                // label="Nombre *"
                name="firstName"
                register={register('firstName', {
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 20,
                    message: 'El nombre no puede tener más de 20 caracteres',
                  },
                  pattern: {
                    value: /^[a-zA-ZñÑ\s]+$/,
                    message: 'El nombre de usuario solo puede contener letras y espacios',
                  },
                })}
                placeholder="Ingresa tu nombre"
              />
              <Label htmlFor="lastName" className="text-xs md:text-sm">
                Apellido
              </Label>

              <InputText
                className="rounded-xl dark:bg-card bg-background"
                type="text"
                errors={errors?.lastName?.message}
                // label="Apellido *"
                name="lastName"
                register={register('lastName', {
                  minLength: {
                    value: 2,
                    message: 'El apellido debe tener al menos 2 caracteres',
                  },
                  maxLength: {
                    value: 20,
                    message: 'El apellido no puede tener más de 20 caracteres',
                  },
                  pattern: {
                    value: /^[a-zA-ZñÑ\s]+$/,
                    message: 'El apellido de usuario solo puede contener letras y espacios',
                  },
                })}
                placeholder="Ingresa tu apellido"
              />
            </div>
            {/* Email */}
            <Label htmlFor="email" className="text-xs md:text-sm">
              Email:
            </Label>
            <InputText
              className=" rounded-xl dark:bg-card bg-background "
              type="text"
              errors={errors?.email?.message}
              // label="Email:"
              register={register('email', {
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Ingresa una dirección de correo electrónico válida',
                },
              })}
              name="email"
              placeholder="harold@gmail.com"
            />

            {/* Password */}
            <Label htmlFor="password" className="text-xs md:text-sm">
              Contraseña *
            </Label>
            <InputText
              className="dark:bg-card bg-background"
              errors={errors.password?.message}
              // label="Password *"
              name="password"
              register={register('password', {
                required: 'Contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
              })}
              type="password"
              placeholder="********"
            />

            {/* Confirmar Password */}
            <Label htmlFor="cPassword" className="text-xs md:text-sm">
              Confirmar Contraseña *
            </Label>
            <InputText
              className="dark:bg-card bg-background"
              //  type={showPassConfirm === false ? "text" : "password"}
              errors={errors.cPassword?.message}
              // label="Confirm Password *"
              name="cPassword"
              register={register('cPassword', {
                validate: value => {
                  const { password } = getValues();
                  if (password !== value) {
                    return 'Las contraseñas deben coincidir';
                  }
                },
              })}
              type="password"
              placeholder="********"
            />
            <p className={`${!messageRes?.success ? 'text-red-500' : 'text-green-500'}`}>
              {messageRes?.message}
            </p>

            <p className="text-center font-poppins text-xs md:text-sm  pt-2 mx-9 text-[#A7A7A7] ">
              Al iniciar sesión o registrarse, aceptas nuestros{' '}
              <Link
                href={'/terminos-y-condiciones'}
                target="_blank"
                className="text-blue-500 hover:text-primary"
              >
                Términos y condiciones
              </Link>
            </p>
          </div>

          <Button
            className=" flex items-center gap-4 py-6 text-[white] text-[16px] hover:bg-secondary "
            type="submit"
          >
            <p className="text-xs md:text-sm">REGISTRARSE</p>
          </Button>
          <div className="flex justify-center items-center gap-2  ">
            <hr className="h-[2px] w-10  bg-[#666666]"></hr>{' '}
            <p className="dark:text-[#D3D3D3] text-black text-xs md:text-sm ">O registrate con </p>{' '}
            <hr className="h-[2px] w-10 text-white bg-[#666666]"></hr>
          </div>
          {/* Google Button */}
          <button onClick={() => signIn('google', { callbackUrl: '/' })} className="w-full border border-[#B7B7B7] flex items-center justify-center gap-x-3 py-3  rounded-[5px] text-xs sm:text-sm font-medium hover:bg-gray-800">
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
            <span className='relative top-[1px] '>GOOGLE</span>
          </button>
        </form>
      )}
    </Card>
  );
};
