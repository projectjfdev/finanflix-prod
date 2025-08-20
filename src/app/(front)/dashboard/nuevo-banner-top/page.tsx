'use client';

import { useState } from 'react';
import { Calendar, Router, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import moment from 'moment';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from '@/components/Inputs/InputText';
import Image from 'next/image';
import { createBannerTop } from '@/utils/Endpoints/bannersEndpoints';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface Props {
  message: string;
  success: null | boolean;
}

export default function BannerTop() {
  const [picture, setPicture] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState<Props>();
  const router = useRouter();

  const form = useForm();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm();

  const handleFileChangeImg = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = event => {
        setPicture(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);
    const newData = {
      ...data,
      image: picture || '',
    };
    reset();
    try {
      const res = await createBannerTop(newData);
      setIsApproved(res);
      setIsLoading(false);

      if (res.success) {
        const timer = setTimeout(() => {
          router.push('/');
        }, 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error al valuar:', error);
      setIsLoading(false);
    }
  };
  const isActive = watch('isActive');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const title = watch('title');
  const description = watch('description');
  const cta = watch('cta');

  return (
    <div className="w-full ml-4 md:ml-8">
      <div className="text-2xl font-poppins mb-3">
        <MediumTitle
          className="dark:text-white text-black"
          title="Configuracion Banner Promocional"
        />
      </div>

      <Card className="mx-auto dark:bg-background bg-white  overflow-x-scroll md:overflow-hidden  rounded-2xl shadow-xl ">
        <CardContent className="space-y-6 ml-3 md:ml-5">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-5/6">
              <div className="pt-6">
                <Label className="dark:text-white text-black" htmlFor="title">
                  Título del Banner <span className="text-gray-500">(opcional)</span>
                </Label>
                <InputText
                  type="text"
                  errors={errors?.title?.message}
                  placeholder="Título del banner"
                  className=" dark:bg-card bg-background rounded-lg"
                  register={register('title', {
                    maxLength: {
                      value: 80,
                      message: 'El título es demasiado largo. Máximo 80 caracteres',
                    },
                    minLength: {
                      value: 2,
                      message: 'El título debe tener al menos dos caracteres',
                    },
                  })}
                  name="title"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-white text-black " htmlFor="description">
                  Descripción del Banner <span className="text-gray-500">(opcional)</span>
                </Label>
                <Textarea
                  className="resize-y w-full h-[200px] dark:bg-card bg-background rounded-[13px] "
                  {...register('description', {
                    minLength: {
                      value: 10,
                      message: 'La descripción debe tener al menos 10 caracteres',
                    },
                  })}
                />
              </div>
              {errors && (
                <span className="text-red-600 ">{errors?.description?.message as string}</span>
              )}
              <div className="my-3">
                <Label className="dark:text-white text-black" htmlFor="title">
                  CTA (Título del boton de redirección){' '}
                  <span className="text-gray-500">(opcional)</span>
                </Label>
                <InputText
                  type="text"
                  errors={errors?.cta?.message}
                  placeholder="Acceder ahora"
                  className=" dark:bg-card bg-background rounded-lg"
                  register={register('cta', {
                    maxLength: {
                      value: 20,
                      message: 'El título del boton no puede exceder los 20 caracteres',
                    },
                  })}
                  name="cta"
                />
                <Label htmlFor="cta-text" className="dark:text-white text-black">
                  Redirección
                </Label>
                <p className="text-gray-500">
                  <span className="text-secondary font-semibold">¡Importante!</span> Si la
                  redirección es interna dentro de la página, debe comenzar con <code>/</code>{' '}
                  seguido de la URL. Por ejemplo: <code>/mis-cursos</code>. Para redirecciones
                  externas fuera de Finanflix, la URL debe comenzar con <code>https://</code>. Por
                  ejemplo: <code>https://discord.com/</code>.
                </p>

                <InputText
                  type="text"
                  errors={errors?.redirect?.message}
                  placeholder="URL interna o externa"
                  className=" dark:bg-card bg-background rounded-lg"
                  register={register('redirect')}
                  name="redirect"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-5 md:gap-5 md:space-x-4 pb-3 ">
                <div className="space-y-2 flex flex-col md:flex-row md:items-center gap-3">
                  <Label className="dark:text-white text-black">Fecha de Inicio</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal  dark:bg-card py-3 dark:text-white text-black"
                      >
                        <Calendar className="mr-2 h-4 w-4  " />
                        {startDate ? (
                          moment(startDate).format('MMMM DD, YYYY')
                        ) : (
                          <span>dd/mm/aaaa</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <CalendarComponent
                            className=" dark:text-white text-black  "
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        )}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 flex flex-col md:flex-row md:items-center gap-3  ">
                  <Label className="dark:text-white text-black">Fecha de Fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal  dark:bg-card py-3 dark:text-white text-black"
                      >
                        <Calendar className="mr-2 h-4 w-4 dark:text-white text-black" />
                        {endDate ? (
                          moment(endDate).format('MMMM DD, YYYY')
                        ) : (
                          <span>dd/mm/aaaa</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark:text-white text-black">
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        )}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Card className="p-5 dark:bg-background bg-white shadow-md mb-3 w-fit">
                <p className="text-sm  dark:text-white text-black">
                  {startDate && endDate
                    ? `Válido desde ${moment(startDate).format('MMMM DD, YYYY')} hasta ${moment(
                        endDate
                      ).format('MMMM DD, YYYY')}`
                    : 'Fechas no especificadas'}
                </p>
              </Card>
              <Card className="flex items-center space-x-2 w-fit p-5 shadow-md dark:bg-background bg-white ">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <Label className="dark:text-white text-black" htmlFor="isActive">
                  Activar Banner
                </Label>
              </Card>

              <Card className="flex items-center space-x-2 w-fit p-5 shadow-md dark:bg-background bg-white">
                <Controller
                  name="clickeable"
                  control={control}
                  render={({ field }) => (
                    <Switch id="clickeable" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <Label className="dark:text-white text-black" htmlFor="clickeable">
                  Clickeable
                </Label>
              </Card>

              {/* VISTA PREVIA BANNER  */}
              <div className="space-y-2 py-3  ">
                <Label className="dark:text-white text-black">Vista Previa</Label>
                <Card
                  className={`p-4 ${
                    isActive ? 'border border-primary text-white' : 'dark:bg-card'
                  }`}
                >
                  {picture ? (
                    <div className="relative flex justify-center">
                      <div className="relative w-full h-[240px] md:h-[480px]">
                        {/* Background Image */}
                        <Image
                          className="rounded-[28px] w-full object-cover"
                          src={picture}
                          alt="Carousel image Ginanflix"
                          fill
                        />

                        {/* Overlay for better text visibility */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[28px]"></div>

                        {/* Text on the left, vertically centered */}
                        <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center text-left p-8 md:p-12 w-2/3">
                          <h3 className="font-bold text-white text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4">
                            {title}
                          </h3>
                          <p className="text-white text-base md:text-xl">{description}</p>
                          {cta && (
                            <Button className="bg-white mt-3 w-1/2 text-black px-4 py-2 md:px-6 md:py-4 rounded-full font-medium dark:hover:bg-slate-300 font-poppins hover:bg-gray-100 transition-colors text-sm md:text-sm">
                              {cta}
                            </Button>
                          )}
                        </div>

                        {/* Image upload button (top left) */}
                        <label
                          htmlFor="thumbnail"
                          className="absolute top-4 left-4 bg-white bg-opacity-75 cursor-pointer rounded-md p-2 flex items-center shadow-md z-50"
                        >
                          <Upload className="h-6 w-6 md:h-8 md:w-8 text-black" />
                          <input
                            type="file"
                            id="thumbnail"
                            data-max-size="5120"
                            className="hidden"
                            accept=".jpg, .png, .jpeg"
                            onChange={handleFileChangeImg}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="thumbnail"
                      className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg cursor-pointer dark:bg-card hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground text-center">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                      </div>
                      <input
                        type="file"
                        id="thumbnail"
                        data-max-size="5120"
                        className="hidden"
                        accept=".jpg, .png, .jpeg"
                        onChange={handleFileChangeImg}
                      />
                    </label>
                  )}
                </Card>
              </div>

              <div className="pb-6 ">
                {isApproved && (
                  <Alert
                    className={`mt-4 border ${
                      isApproved.success ? 'border-green-500' : 'border-red-500'
                    }`}
                  >
                    {/* <RocketIcon className="h-4 w-4" /> */}
                    <AlertTitle className={isApproved.success ? 'text-green-500' : 'text-red-500'}>
                      {isApproved.success ? 'Creado' : 'Algo falló'}
                    </AlertTitle>
                    <AlertDescription>{isApproved.message}</AlertDescription>
                  </Alert>
                )}

                {isLoading ? (
                  <Button className="ml-auto text-white" disabled>
                    Guardando...
                  </Button>
                ) : (
                  <Button className="ml-auto text-white">Guardar Cambios</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
