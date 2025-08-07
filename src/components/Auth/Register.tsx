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
                <Label htmlFor="username" className='text-xs md:text-sm'>Nombre de usuario *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger onClick={handleClickTooltip}>
                      <CircleAlert size={15} color="#f03300" className='hidden md:flex' />
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
                  required: 'El nombre es requerido',
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
              <Label htmlFor="firstName" className='text-xs md:text-sm'>Nombre *</Label>
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
                    value: /^[a-zA-Z\s]+$/,
                    message: 'El nombre de usuario solo puede contener letras y espacios',
                  },
                })}
                placeholder="Ingresa tu nombre"
              />
              <Label htmlFor="lastName" className='text-xs md:text-sm'>Apellido *</Label>

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
                    value: /^[a-zA-Z\s]+$/,
                    message: 'El apellido de usuario solo puede contener letras y espacios',
                  },
                })}
                placeholder="Ingresa tu apellido"
              />
            </div>
            {/* Email */}
            <Label htmlFor="email" className='text-xs md:text-sm'>Email:</Label>
            <InputText
              className=" rounded-xl dark:bg-card bg-background "
              type="email"
              errors={errors?.email?.message}
              // label="Email:"
              register={register('email', {
                required: 'Email Address is required',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              name="email"
              placeholder="harold@gmail.com"
            />
            {/* Explicación del patrón:
            ^: Inicio de la cadena.
            \+?: Permite un símbolo + opcional al inicio (para código de país).
            [0-9]: Acepta solo números.
            {7,15}: El número debe tener entre 7 y 15 dígitos (estos valores pueden ajustarse según lo que necesites). */}

            {/* <Label htmlFor="tel">Número de celular *</Label>
            <InputText
              className="dark:bg-card bg-background"
              type="text"
              errors={errors?.tel?.message}
              // label="Número de celular *"
              name="tel"
              register={register(
                "tel"
                //   {
                //   required: "Por favor, ingresa un número de celular",
                //   pattern: {
                //     value: /^\+?[0-9]{7,15}$/, // Para números sin código de país: value -> /^[0-9]{7,15}$/,
                //     message: "El número de celular no es válido",
                //   },
                // }
              )}
              placeholder="+5422155555"
            /> */}
            {/* Password */}
            <Label htmlFor="password" className='text-xs md:text-sm'>Contraseña *</Label>
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
            <Label htmlFor="cPassword" className='text-xs md:text-sm'>Confirmar Contraseña *</Label>
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
                    return 'Password must match';
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
              <Link href={'/terminos-y-condiciones'} className="text-blue-500 hover:text-primary">
                Términos de servicio
              </Link>{' '}
              y
              <Link href={'/terminos-y-condiciones'} className="text-blue-500 hover:text-primary">
                {' '}
                Política de privacidad
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

          <Button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            // className=" flex items-center gap-4  py-6 relative  dark:hover:bg-[rgba(240, 52, 0, 1)] mb-2"
            className=" flex items-center gap-4  py-6 relative  dark:hover:bg-transparent   mb-2 bg-transparent border border-[#B7B7B7] rounded-[5px]"
          >
            <div className=" font-bold flex items-center gap-4 py-6  ">
              <div className="md:absolute md:left-[100px] ">
                <Image
                  src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703454/google-logo_sx8mz4.png"
                  height={25}
                  width={25}
                  alt="imagen de google"
                  className='w-5 h-5 md:w-6 md:h-6'
                />
              </div>
              <p className="text-white font-bold  mr-[9px] text-xs md:text-sm dark:hover:text-[#D3D3D3] ">GOOGLE</p>
            </div>
          </Button>
        </form>
      )}
    </Card>
  );
};
