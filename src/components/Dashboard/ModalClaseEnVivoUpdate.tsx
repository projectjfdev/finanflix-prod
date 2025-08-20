'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Toaster, toast } from 'sonner';
import { InputText } from '../Inputs/InputText';
// import Image from 'next/image';
import { Pencil, CheckCircle, Upload } from 'lucide-react';
import { useIntervalClick } from '@/hooks/useIntervalClick';
import { Loading } from '@/utils/Loading/Loading';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { ILiveLesson } from '@/interfaces/liveLesson';
import { updateLiveLessonById } from '@/utils/Endpoints/liveLessonEndpoint';
import { getCategories } from '@/utils/Endpoints/adminEndpoints';
import moment from 'moment';

interface Props {
  liveLesson: ILiveLesson;
}
const ModalClaseEnVivoUpdate = ({ liveLesson }: Props) => {
  // const [picture, setPicture] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isResendDisabled, setIsResendDisabled, setTimer, timer } = useIntervalClick();
  const [hasToastShown, setHasToastShown] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: liveLesson,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const lessonDate = watch('lessonDate');

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        // console.error('Unexpected data format for categories:', res.data);
        setCategories([]);
      }
    } catch (error) {
      // console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setCategories([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // const handleFileChange = (e: any) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = event => {
  //       setPicture(event.target?.result);
  //     };
  //     reader.readAsDataURL(selectedFile);
  //   }
  // };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // let payload;

      // if (picture) {
      //   // Si hay una nueva imagen, incluye el campo `thumbnail`
      //   payload = {
      //     ...data,
      //     thumbnail: picture,
      //   };
      // } else {
      //   // Si no hay una nueva imagen, excluye el campo `thumbnail`
      //   const { thumbnail, ...restData } = data; // Excluir `thumbnail`
      //   payload = { ...restData };
      // }

      const res = await updateLiveLessonById(liveLesson._id.toString(), data);

      if (res.success) {
        setIsResendDisabled(true);
        setTimer(10);
        if (!hasToastShown) {
          toast('¡Clase en vivo actualizada con éxito!', {
            icon: <CheckCircle className="text-green-500" />,
          });
          setHasToastShown(true);
        }
        const timer = setTimeout(() => {
          window.location.reload();
        }, 3000);
        return () => clearTimeout(timer);
      }

      setIsSubmitting(false);
    } catch (error) {
      // console.error('Error updating course:', error);
      toast.error('Error al actualizar el curso');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      setHasToastShown(false);
    };
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="mt-2">
        <Pencil className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent
        width="w-full md:max-w-lg "
        className="overflow-y-scroll custom-scrollbar dark:bg-background bg-white overflow-x-hidden"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 overflow-y-auto">
            <div className="ml-1">
              <Label htmlFor="title">
                Título<span className="text-red-600">*</span>
              </Label>
              <InputText
                type="text"
                errors={errors?.title?.message}
                placeholder="Título del curso"
                className="w-5/6 dark:bg-card bg-background rounded-lg"
                register={register('title')}
                name="title"
              />

              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col justify-between gap-5 pb-3">
                      <Label>
                        Categoría del curso
                        <span className="text-red-600">*</span>
                      </Label>
                      <Select onValueChange={field.onChange}>
                        <FormControl className="w-5/6 dark:bg-card bg-background rounded-[13px]">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                liveLesson.category
                                  ? liveLesson.category
                                  : 'Selecciona una categoria'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map(category => (
                            <SelectItem
                              key={category._id.toString()}
                              title={category.name}
                              value={category.name}
                              defaultValue="Choose a Category"
                            >
                              <div className="flex items-center">
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormItem>
                )}
              />
              {/* <div className="dark:bg-[#1A1A23]  bg-background h-fit md:mx-0  rounded-xl">
                <div className="px-6 pt-3 ">
                  <div className="">
                    <Label className="text-base">
                      Miniatura de la clase en vivo
                      <span className="text-red-600">*</span>
                    </Label>
                    <p className="text-[10.49px] font-poppins py-2 text-muted-foreground mb-4">
                      Sube la imagen de tu clase en vivo aquí. Requisitos importantes: 1200x600
                      píxeles o relación 12:8. Formatos compatibles: .jpg, .jpeg o .png.
                    </p>
                    <div className="flex items-start justify-center pb-3 mb-2">
                      {picture ? (
                        <div className="flex justify-center relative">
                          <Image
                            src={picture}
                            alt="selecciona una imagen"
                            width={350}
                            height={200}
                            className="object-cover w-1/2 rounded-md"
                          />
                          <label
                            htmlFor="thumbnail"
                            className="absolute left-2 bottom-2 dark:bg-white cursor-pointer rounded-md "
                          >
                            <Upload className="h-8 w-8 text-muted-foreground p-1" />
                            <input
                              type="file"
                              id="thumbnail"
                              data-max-size="5120"
                              className="hidden"
                              accept=".jpg, .png, .jpeg"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="flex justify-center relative">
                          <Image
                            src={liveLesson?.thumbnail?.url}
                            alt="selecciona una imagen"
                            width={350}
                            height={200}
                            className="object-cover w-1/2 rounded-md"
                          />
                          <label
                            htmlFor="thumbnail"
                            className="absolute left-2 bottom-2 dark:bg-white cursor-pointer rounded-md "
                          >
                            <Upload className="h-8 w-8 text-muted-foreground p-1" />
                            <input
                              type="file"
                              id="thumbnail"
                              data-max-size="5120"
                              className="hidden"
                              accept=".jpg, .png, .jpeg"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div> */}
              <div>
                <div className="pb-2">
                  <Label className="text-base ">
                    Descripción de la clase en vivo
                    <span className="text-red-600">*</span>
                  </Label>
                </div>
                <Textarea
                  className="resize-y h-36  dark:bg-card bg-background rounded-[13px] w-80 mb-2 "
                  {...register('description', {
                    minLength: {
                      value: 10,
                      message: 'La descripción debe tener al menos 10 caracteres',
                    },
                  })}
                />
                <span className="text-red-600 mb-4">{errors?.description?.message as string}</span>
              </div>
              <Label className="text-base">Fecha de la clase en vivo</Label>
              <div className="flex flex-col gap-2 bg-backgroind dark:bg-card rounded-lg p-4 my-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {lessonDate ? moment(lessonDate).format('MMMM DD, YYYY') : <span>Sin fecha</span>}
                </p>
                <Controller
                  name="lessonDate"
                  control={control}
                  render={({ field }) => (
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      defaultMonth={field.value ?? undefined}
                    />
                  )}
                />
              </div>
              <Label className="pt-3" htmlFor="videoUrl">
                Link de la clase en vivo <span className="text-red-600">*</span>
              </Label>
              <InputText
                className="dark:bg-card bg-background w-5/6"
                type="text"
                errors={errors?.videoUrl?.message}
                placeholder="https://vimeo.com/1022325100"
                register={register('videoUrl')}
                name="videoUrl"
              />
              <div>
                {isResendDisabled ? (
                  <Button className="w-full" disabled={isResendDisabled}>
                    Esperá {timer} segundos si necesitas volver a actualizar
                  </Button>
                ) : isSubmitting ? (
                  <Button type="button" className="w-full" disabled>
                    <Loading size="20px" color="white" />
                    <span className="mr-2" />
                    Actualizar
                  </Button>
                ) : (
                  <Button className="w-full">Actualizar</Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
      <Toaster />
    </Sheet>
  );
};

export default ModalClaseEnVivoUpdate;
