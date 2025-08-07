'use client';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { InputText } from '@/components/Inputs/InputText';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createLiveLesson } from '@/utils/Endpoints/liveLessonEndpoint';
import { CardSuccessfulCreation } from '@/components/CardSuccessfulCreation/CardSuccessfulCreation';
import { useCategories } from '@/hooks/useCategories';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import moment from 'moment';

export default function NuevaClaseEnVivoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { categories } = useCategories();

  const form = useForm();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
  } = useForm();

  const lessonDate = watch('lessonDate');

  const onSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);
    const newData = {
      ...data,
      // thumbnail: picture || '',
    };
    try {
      const res = await createLiveLesson(newData);
      if (res.success) {
        setIsApproved(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error al valuar:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-4 md:ml-8 w-full">
      <div className="text-2xl mb-3 font-poppins">
        <MediumTitle className="dark:text-white text-black" title="Crear una clase en vivo" />
      </div>
      <Card className="dark:bg-background border-none bg-white rounded-xl shadow-xl dark:text-white text-black">
        {!isApproved ? (
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4  gap-3 border border-solid border-gray-[500] shadow-md px-5 py-3 mt-3 rounded-2xl "
            >
              <div className="w-full md:w-5/6">
                <Label htmlFor="title">
                  Título <span className="text-red-600">*</span>
                </Label>
                <InputText
                  type="text"
                  errors={errors?.title?.message}
                  placeholder="Título del curso"
                  className=" dark:bg-card bg-background rounded-lg"
                  register={register('title')}
                  name="title"
                />
              </div>

              <div className="space-y-2 w-full md:w-5/6">
                <Label className="dark:text-white text-black" htmlFor="classDescription">
                  Descripción de la clase <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  className="resize-y w-full h-[200px] dark:bg-card bg-background rounded-[13px] "
                  {...register('description')}
                />
              </div>
              <div className="space-y-2 mt-4">
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col justify-between gap-5 pb-">
                        <Label>
                          Categoría de la clase <span className="text-red-600">*</span>
                        </Label>
                        <Select onValueChange={field.onChange}>
                          <FormControl className="w-full md:w-5/6 dark:bg-card bg-background rounded-[13px]">
                            <SelectTrigger>
                              <SelectValue placeholder={'Selecciona una categoria'} />
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
              </div>
              <div className="space-y-2 mt-4 w-fit">
                <Label className="text-base">Fecha de la clase en vivo</Label>
                <div className="flex flex-col gap-2 bg-background dark:bg-card rounded-lg p-4 my-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    {lessonDate ? (
                      moment(lessonDate).format('MMMM DD, YYYY')
                    ) : (
                      <span>Sin fecha</span>
                    )}
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
              </div>

              <div className="space-y-2">
                <Label className="pt-3" htmlFor="videoUrl">
                  Link de la clase en vivo <span className="text-red-600">*</span>
                </Label>
                <InputText
                  className="dark:bg-card bg-background w-full md:w-5/6"
                  type="text"
                  errors={errors?.videoUrl?.message}
                  placeholder="https://vimeo.com/1022325100"
                  register={register('videoUrl')}
                  name="videoUrl"
                />
              </div>
              <div className="w-full md:w-1/2 lg:w-2/6 pb-5">
                {!isLoading ? (
                  <Button type="submit" className="text-white w-full font-semibold">
                    Crear clase en vivo
                  </Button>
                ) : (
                  <Button disabled className="text-white w-full">
                    Creando...
                  </Button>
                )}
              </div>
            </form>
          </Form>
        ) : (
          <CardSuccessfulCreation
            title="¡Clase Creada con Éxito!"
            text="Tu clase ha sido creada y ya se encuentra publicada. ¿Qué te
            gustaría hacer ahora?"
            textRedirectBtn="Ir a las clases en vivo"
            redirectNew="/dashboard/nueva-clase-en-vivo"
            redirectSeeAll="/dashboard/clases-en-vivo"
          />
        )}
      </Card>
    </div>
  );
}
