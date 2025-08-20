'use client';

import { InputText } from '@/components/Inputs/InputText';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import 'moment/locale/es';
import { Form } from '@/components/ui/form';
import { ArrowLeft, Book, Check, Upload } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { useIntervalClick } from '@/hooks/useIntervalClick';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { getOnboardingInfo, updateUser } from '@/utils/Endpoints/configUserEndpoints';
import OnboardingModalUpdate from '@/components/Modal/OnboardingModalUpdate';
import { Loading } from '@/utils/Loading/Loading';
import { Label } from '@/components/ui/label';
import { courseToClaim } from '@/utils/Endpoints/coursesEndpoint';
import { Toaster, toast } from 'sonner';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import { SuccessModal } from '@/components/SuccessModal/SuccesModal';
import { Separator } from '@/components/ui/separator';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';
import { useRouter } from 'next/navigation';
import FooterVisibilitySetter from '@/components/Footer/FooterVisibilitySetter';
import { hasSubscription } from '@/utils/HasSubscription';

interface InfoOboardingProps {
  connectedToDiscord: boolean;
  perfilCompleted: boolean;
  preferences: boolean;
}

interface Imessage {
  message: string;
  success: boolean;
}

export default function Setting() {
  const { data: session, update } = useSession();
  const [sessionAvailable, setSessionAvailable] = useState(false);
  const [picture, setPicture] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageRes, setMessageRes] = useState<Imessage>();
  const [taskProgress, setTaskProgress] = useState<InfoOboardingProps>();
  const { isResendDisabled, setIsResendDisabled, setTimer, timer } = useIntervalClick();
  // const [confirmDeleteValue, setConfirmDeleteValue] = useState("");
  const [isSigningOut, setIsSigninOut] = useState(false)

  const router = useRouter();

  moment.locale('es'); // Establece el idioma globalmente
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 500;


  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB en bytes

      if (selectedFile.size > maxSizeInBytes) {
        alert('El archivo supera el límite de 4 MB. Por favor, selecciona otro archivo.');
        e.target.value = ''; // Limpia el input
      } else {
        const reader = new FileReader();
        reader.onload = event => {
          setPicture(event.target?.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const getInfo = async () => {
    const res = await getOnboardingInfo();
    setTaskProgress(res.data);
  };
  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setSessionAvailable(true);
    }
  }, [session]);

  const form = useForm();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    if (sessionAvailable && session?.user) {
      setValue('firstName', session?.user?.firstName || '');
      setValue('lastName', session?.user.lastName || '');
      setValue('tel', session?.user.tel || '');
    }
  }, [sessionAvailable, session, setValue]);

  const onSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      if (picture) {
        const res = await updateUser(`/api/users/${session?.user?._id}`, {
          ...data,
          profileImage: picture,
        });
        update({ ...res?.updateUser });
      }
      // TODO: ESTO CREO Q ESTA MAL, ESTA HACIENDO DOBLE PETICION SI HAY PICTURE
      const res = await updateUser(`/api/users/${session?.user?._id}`, {
        ...data,
      });
      update({ ...res?.updateUser });
      setLoading(false);
      setMessageRes(res);

      if (res.success) {
        setIsResendDisabled(true);
        setTimer(10);
        toast.success('¡Perfil actualizado!', {
          description: 'Tu información se ha guardado correctamente.',
        });
      }
    } catch (error) {
      // console.error('Error catch al modificar usuario:', error);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigninOut(true)
    await signOut({
      callbackUrl: '/',
    });
  };

  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open); // Cierra el modal
  };

  const handleClaim = async (c: string) => {
    const res = await courseToClaim({ courseTitle: c });

    if (res.success) {
      // Mostrar notificación de éxito
      toast.success('¡Curso recuperado!', {
        description:
          "El curso se ha recuperado con éxito. Ingresa a 'Mi Aprendizaje' para poder acceder a tu curso. ",
        action: {
          label: 'Ir a Mis Cursos',
          onClick: () => {
            // Aquí se redirige a una página de soporte
            window.open('/mis-cursos');
          },
        },
      });
    } else {
      // Mostrar notificación de error si el curso no se encuentra
      toast.error('', {
        description:
          'El curso que intentas reclamar no está disponible en nuestra plataforma., por favor contacta con soporte y solucionaremos tu problema.',
        action: {
          label: 'Ir a soporte',
          onClick: () => {
            // Aquí se redirige a una página de soporte
            window.open('https://soporte-finanflix.vercel.app/', '_blank');
          },
        },
      });
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  return (
    <>
      <div className='pb-[101px] md:hidden'></div>
      <div className="min-h-screen pb-16 md:pb-0">
        {/* SECCION FOTO DE PERFIL  */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {taskProgress?.preferences && (
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <MediumTitle
                    className="dark:text-white text-black text-xl font-semibold"
                    title="Tu cuenta"
                  />
                  <Separator className="w-10 border-1 my-2" />
                </div>
                <Button
                  size="xl"
                  className="py-4 px-6 md:px-10 text-white hover:bg-secondary text-xs md:text-sm font-poppins hover:text-[#A7A7A7]"
                  type={'button'}
                  onClick={() => setIsModalOpen(true)}
                >
                  PREFERENCIAS
                </Button>
              </div>
            )}

            {/* FOTO DE PERFIL */}

            <div className="hidden md:flex flex-col lg:flex-row gap-5 md:mt-5 px-3 md:px-0 md:mb-4 ">
              <div className="lg:w-[25%]">
                <h3 className="text-lg md:text-xl ">Foto de perfil</h3>
                <p className="font-poppins pt-4 text-[#A7A7A7] text-[15px] ">
                  Sube una imagen clara y de buena resolución que te represente, ya sea una foto
                  tuya, un avatar o un logo. Asegúrate de que la imagen sea apropiada y de formato
                  cuadrado (recomendamos 400x400 píxeles)
                </p>
              </div>
              {/* IMAGE CARD */}
              <Card className="flex flex-col lg:w-[75%] p-10 max-h-max">
                <input
                  type="file"
                  id="imgUpload"
                  data-max-size="5120"
                  className="hidden dark:bg-card bg-card "
                  accept=".jpg, .png, .jpeg"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col justify-center items-center lg:flex-row gap-4">
                  {picture ? (
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                      <Image
                        src={picture}
                        alt="selecciona una imagen para editar perfil"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-[75px] h-[75px] rounded-full overflow-hidden">
                      <Image
                        src={
                          session?.user?.profileImage?.url ||
                          'https://res.cloudinary.com/drlottfhm/image/upload/v1750703606/noImgProfile_nkbhbr.png'
                        }
                        alt="avatar-profile Finanflix"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <Card className="dark:bg-background flex items-center  justify-between p-4  w-[80%]">
                    <label
                      htmlFor="imgUpload"
                      className="cursor-pointer flex items-center space-x-4"
                    >
                      <div className="bg-white p-2 rounded-md w-[40px] h-[40px] flex items-center justify-center">
                        <Upload color="black" size={16} />
                      </div>
                      <p className="font-poppinstext-[15px]">
                        <span className="font-poppins dark:text-white text-black text-[15px]">
                          Hace click acá
                        </span>{' '}
                        para cargar tu foto PNG, JPG (Max. 4Mb)
                      </p>
                    </label>
                  </Card>
                </div>
              </Card>
            </div>

            {/* BANNER AZUL */}
            {/* <div className="dark:bg-[#4C2FBA] h-[200px] w-screen ml-[calc(-50vw+50%)] md:hidden relative bottom-[150px] z-[50]"></div> */}

            <div className="relative md:hidden">
              <div className="dark:bg-[#4C2FBA] h-[200px] w-screen ml-[calc(-50vw+50%)] md:hidden relative bottom-[150px] z-[50] flex items-center justify-center ">
                {/* Contenedor flex para flecha y texto */}
                <div className="w-full flex items-center relative px-4">
                  <ArrowLeft
                    className="z-[55] cursor-pointer dark:hover:text-[#a7a7a7]"
                    onClick={() => router.push('/')}
                  />
                  {/* Este div ocupa todo el ancho y centra el texto */}
                  <div className="flex-grow flex justify-center">
                    <p className="text-white text-xl font-semibold z-[55] mr-6">Tu cuenta</p>
                  </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-[136px] w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg z-[60]">
                  <Image
                    src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703606/noImgProfile_nkbhbr.png"
                    alt="Avatar"
                    className="w-full h-full object-cover relative"
                    fill
                  />
                </div>
              </div>
            </div>

            {/* SECCION DATOS PERSONALES */}

            <div className="flex flex-col lg:flex-row md:pt-0 gap-5 px-3 lg:px-0">
              <div className="lg:w-[25%] hidden md:flex md:flex-col">
                <h3 className="text-lg md:text-xl">Datos personales</h3>
                <p className="font-poppins pt-4 text-[#A7A7A7] text-[15px]">
                  Completa tus datos personales para personalizar tu experiencia en FINANFLIX. Esta
                  información nos ayuda a ofrecerte contenido y recomendaciones adaptadas a tus
                  intereses.
                </p>
              </div>

              <div className="lg:w-[75%] flex flex-col relative bottom-5 md:bottom-0">
                <div className="flex flex-row gap-4 ">
                  <div className="w-full">
                    <Label
                      className="dark:text-white text-black  font-groteskBook20 font-semibold text-xs md:text-sm"
                      htmlFor="firstName"
                    >
                      Nombre *
                    </Label>
                    <InputText
                      className="rounded-lg dark:bg-card bg-card py-6 "
                      type="text"
                      errors={errors?.firstName?.message}
                      name="firstName"
                      register={register('firstName', {
                        required: 'El nombre es obligatorio',
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
                      placeholder="Ingresa tu Nombre"
                    />
                  </div>

                  <div className="w-full">
                    <Label
                      className="dark:text-white text-black font-groteskBook20 font-semibold text-xs md:text-sm"
                      htmlFor="lastName"
                    >
                      Apellido *
                    </Label>

                    <InputText
                      className="rounded-lg dark:bg-card bg-card py-6 "
                      type="text"
                      errors={errors?.lastName?.message}
                      name="lastName"
                      register={register('lastName', {
                        required: 'El apellido es obligatorio',
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
                      placeholder="Ingresa tu Apellido"
                    />
                  </div>
                </div>
                <div className="w-full py-3">
                  <Label
                    className="dark:text-white text-black font-groteskBook20 font-semibold text-xs md:text-sm"
                    htmlFor="tel"
                  >
                    Celular
                  </Label>
                  <InputText
                    className="rounded-lg dark:bg-card bg-card py-6 "
                    type="text"
                    errors={errors?.tel?.message}
                    name="tel"
                    register={register('tel', {
                      pattern: {
                        value: /^\+?[0-9]{7,15}$/, // Para números sin código de país: value -> /^[0-9]{7,15}$/,
                        message: 'El número de celular no es válido',
                      },
                    })}
                    placeholder="Ingresa tu Celular"
                  />
                </div>
              </div>
            </div>

            {/* FECHA DE CREACION DE CUENTA MOBILE */}

            <div className="md:hidden px-3 pb-3">

              <Card className="flex flex-col gap-3 p-5 justify-between items-center rounded-[13px]">
                <p className=" dark:text-white text-black  text-base font-groteskBook20">
                  Fecha de creación de la cuenta
                </p>

                <div className='w-full text-center' >
                  <p className="text-[#A7A7A7] font-poppins text-sm w-full bg-[#363657] p-3 rounded-[13px]">
                    {moment(session?.user?.createdAt).format('MMMM DD, YYYY')} ({session?.user?.email})
                  </p>
                  <p className="text-[#A7A7A7] font-poppins text-sm"></p>
                </div>
              </Card>
              <div className="pt-3 lg:pt-0 dark:text-white text-black w-full text-center">
                <Button
                  disabled={isSigningOut}
                  type='button'
                  size="xl"
                  className="w-full mx-auto  py-4 px-16 bg-transparent  border-[1px] border-[#FFFFFF4D] text-[#908D8D] hover:bg-primary hover:text-white text-xs md:text-sm font-poppins"
                  onClick={handleSignOut}
                >
                  {isSigningOut ? 'CERRANDO SESIÓN...' : 'CERRAR SESIÓN'}
                </Button>
              </div>
            </div>

            <div className="flex md:flex-col lg:flex-row md:gap-5 pb-1 w-full md:w-auto ">
              <div className="md:ml-0 md:w-[25%]" />
              <div className="lg:w-[75%] w-full text-center md:text-start md:w-fit px-3 md:px-0">
                {isResendDisabled ? (
                  <Button
                    size="xl"
                    className="py-4 px-5 md:px-24 text-white hover:bg-secondary hover:text-white text-xs md:text-sm font-poppins w-full mx-auto md:mx-0 md:w-auto whitespace-normal"
                    disabled={isResendDisabled}
                  >
                    Espera {timer} segundos para volver a actualizar
                  </Button>
                ) : loading ? (
                  <Button
                    size="xl"
                    className="py-4 px-24 text-white hover:bg-secondary hover:text-white text-xs md:text-sm font-poppins w-full mx-auto md:w-auto"
                    disabled
                  >
                    <Loading size="20px" color="white" />
                    <span className="mr-2" />
                    GUARDANDO...
                  </Button>
                ) : (
                  <Button
                    size="xl"
                    className="py-4 px-16 md:px-24 text-white hover:bg-secondary hover:text-white text-xs md:text-sm font-poppins w-full mx-auto md:w-auto"
                    type="submit"
                  >
                    ACTUALIZAR
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>

        {/* SECCION DATOS DE TU CUENTA */}

        <div className="flex flex-col lg:flex-row gap-5 mt-4 px-3 lg:px-0">
          <div className="hidden md:flex md:flex-col lg:w-[25%]">
            <h3 className="text-lg md:text-xl">Datos de tu cuenta</h3>
            <p className="font-poppins pt-4 text-[#A7A7A7] text-[15px] ">
              Tené el control de tu cuenta. Salí de tu sesión cuando sea necesario.
            </p>
          </div>

          <div className="hidden md:flex md:flex-col xl:w-[75%]">
            <Card className="flex flex-col gap-6 px-5 py-10 justify-between">
              <div>
                <p className="font-bold dark:text-white text-black  text-lg font-groteskBook20">
                  Fecha de creación de la cuenta:
                </p>

                <div className="py-2">
                  <p className="text-[#A7A7A7] font-poppins">
                    {moment(session?.user?.createdAt).format('MMMM DD, YYYY')}
                  </p>
                  <p className="text-[#A7A7A7] font-poppins">{session?.user?.email}</p>
                </div>
              </div>

              <div className="pt-3 lg:pt-0 dark:text-white text-black ">
                <Button
                  size="xl"
                  className="py-4 px-10 md:px-16 bg-transparent  border-[1px] border-[#FFFFFF4D] text-[#908D8D] hover:bg-primary hover:text-white text-xs md:text-sm font-poppins"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? 'CERRANDO SESIÓN...' : 'CERRAR SESIÓN'}
                </Button>
              </div>
            </Card>
            {hasSubscription(session) && (
              <Card className="flex items-center gap-2 bg-primary  text-white  px-4 mt-7 md:mt-3 py-2 text-xs md:text-base">
                <Check className="h-4 w-4 md:h-7 md:w-7" />
                <span>
                  Usuario Suscripto a <strong>{session.user.suscription.type}</strong>
                </span>
              </Card>
            )}
          </div>
        </div>
        {session?.user?.coursesToClaim && session?.user?.coursesToClaim?.length > 0 && (
          <Card className="mt-6 p-6 rounded-lg max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <Book className="text-primary" size={24} />
              <h5 className="text-2xl font-semibold dark:text-white text-black">
                Recupera tus Cursos Comprados
              </h5>
            </div>
            <p className="my-4 text-gray-400 text-sm leading-relaxed">
              Dado que estás utilizando nuestra nueva plataforma, hemos guardado los cursos que
              compraste en el pasado. Haz clic en los botones a continuación para reclamar los
              cursos que ya adquiriste y empezar a disfrutar de ellos sin perder tu progreso.
            </p>

            <div className="flex flex-col gap-4">
              {session?.user?.coursesToClaim?.map((c: string) => (
                <div
                  key={c}
                  className="flex items-center justify-between dark:bg-background bg-background p-3 rounded-md "
                >
                  <span className="text-lg dark:text-white text-black">{c}</span>
                  <Button
                    className="text-white bg-primary focus:ring-2 focus:ring-primary rounded-lg py-2 px-4"
                    onClick={() => handleClaim(c)}
                  >
                    Reclamar
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
        <Toaster />
        <OnboardingModalUpdate isOpen={isModalOpen} onOpenChange={handleCloseModal} />
      </div>
      <FooterColorSetter color="bg-[#F3F4F6]" />
      {isMobile && <FooterVisibilitySetter hidden={true} />}
    </>
  );
}
