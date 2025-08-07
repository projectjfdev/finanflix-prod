'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Upload, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { InputText } from '@/components/Inputs/InputText';

import levelData from '@/utils/DataJson/level.json';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardSuccessfulCreation } from '@/components/CardSuccessfulCreation/CardSuccessfulCreation';
import { createCourse } from '@/utils/Endpoints/coursesEndpoint';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ICategory } from '@/interfaces/category';
import { getCategories } from '@/utils/Endpoints/adminEndpoints';
import { useCategories } from '@/hooks/useCategories';

interface LessonTypes {
  [sectionIndex: number]: {
    [lessonIndex: number]: string;
  };
}

interface Lesson {
  _id: string; // O cualquier otra propiedad que tenga cada lección
  title: string; // Ejemplo de propiedad adicional
}

const courses = [
  'DeFi Avanzado',
  'Curso de Trading Pro',
  'Analisis fundamental',
  'Trading Avanzado',
  'Curso Analisis Tecnico de 0 a 100',
  'Halving Bundle',
  'NFTs Revolution',
  'Trading Pro',
  'AT - O-100',
  "NFT's",
  'Finanzas Personales',
  'Guia DeFi-nitiva',
  'Curso StartZero',
  'Curso de bolsa argentina',
  'Curso de Bootstrap',
  'Trading avanzado',
  'Analisis tecnico',
];

export default function NuevoCursoPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { categories } = useCategories();
  const [picture, setPicture] = useState<any>(null);
  const [lessonTypes, setLessonTypes] = useState<LessonTypes>({});

  const sectionBackgrounds = [
    'bg-[#282838]',
    'bg-[#282838]',
    'bg-[#282838]',
    'bg-[#282838]',
    'bg-[#282838]',
  ];

  const sectionDarkBackgrounds = ['bg-background'];

  useEffect(() => {
    setProgress((step - 1) * (100 / 3));
  }, [step]);

  const form = useForm();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    watch,
  } = useForm();

  const {
    fields: sections,
    append: addSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: 'sections',
  });

  const handleLessonTypeChange = (sectionIndex: number, lessonIndex: number, type: string) => {
    setLessonTypes((prev: LessonTypes) => ({
      ...prev,
      [sectionIndex]: {
        ...prev[sectionIndex],
        [lessonIndex]: type,
      },
    }));
  };

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

  const handleRemoveLesson = (sectionIndex: number, lessonIndex: number) => {
    const currentLessons = watch(`sections.${sectionIndex}.lessons`);
    const updatedLessons = currentLessons.filter(
      (_: Lesson, index: number) => index !== lessonIndex
    );
    setValue(`sections.${sectionIndex}.lessons`, updatedLessons);
  };

  const onSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);
    const newData = {
      ...data,
      thumbnail: picture || '',
    };
    try {
      const res = await createCourse(newData);
      // if (res.success) {
      //   setCourseCreated(true);
      // }
      if (res.success) {
        setIsLoading(false);
        // const timer = setTimeout(() => {
        //   router.push('/dashboard');
        // }, 3000);
        // return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error al valuar:', error);
    }
  };

  const renderStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex-shrink-0 dark:bg-background bg-white h-full w-full  ">
            <div className="flex flex-col md:px-5 h-full">
              <header className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold w-full  text-center md:text-start mb-4">
                  Información básica
                </h2>
              </header>
              <ScrollArea className="h-full">
                <Card className="dark:bg-background bg-white p-0 h-full mb-10 dark:shadow-gray-950 shadow-gray-200 shadow-2xl   ">
                  <CardContent className="px-5">
                    <Card className="grid gap-3 mt-7 dark:bg-[#1A1A23] px-3 rounded-lg py-5 bg-white dark:text-white text-black ">
                      <CardContent>
                        <div className="flex gap-2 items-center">
                          <Label htmlFor="title">
                            Título<span className="text-red-600">*</span>
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="bg-primary p-1 rounded-md cursor-default text-white py-1 px-3 text-xs">
                                  ¿ Curso actual ?
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                {courses.map((course, index) => (
                                  <span key={index} className="text-white">
                                    {course}
                                    <br />
                                  </span>
                                ))}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <InputText
                          type="text"
                          errors={errors?.title?.message}
                          placeholder="Título del curso"
                          className="w-5/6 dark:bg-card bg-background rounded-lg"
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
                      </CardContent>
                      <div>
                        <Label htmlFor="subtitle">
                          Subtítulo<span className="text-red-600">*</span>
                        </Label>
                        <InputText
                          type="text"
                          errors={errors?.subtitle?.message}
                          placeholder="Subtítulo del curso"
                          className="dark:bg-card bg-background w-5/6"
                          register={register('subtitle', {
                            maxLength: {
                              value: 30,
                              message: 'The subtitle is too long',
                            },
                            minLength: {
                              value: 2,
                              message: 'The subtitle must be at least 2 characters long',
                            },
                          })}
                          name="subtitle"
                        />
                      </div>
                    </Card>
                    <Card className="grid gap-3 mt-5 md:mt-10 dark:bg-[#1A1A23] px-3 rounded-lg py-5 bg-white dark:text-white text-black">
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
                                    <SelectValue placeholder={'Selecciona una categoria'} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories?.map(category => (
                                    <SelectItem
                                      key={category._id.toString()}
                                      title={category.name}
                                      value={category.name}
                                      defaultValue="Elige una categoría"
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
                    </Card>
                    <Card className="grid gap-3 mt-5 md:mt-10 dark:bg-[#1A1A23] px-3 rounded-lg py-5 bg-white dark:text-white text-black">
                      <CardContent>
                        <FormField
                          control={control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col justify-between gap-5 ">
                                <Label>
                                  Nivel del curso
                                  <span className="text-red-600">*</span>
                                </Label>
                                <Select onValueChange={field.onChange}>
                                  <FormControl className="w-5/6 dark:bg-card bg-background rounded-[13px]">
                                    <SelectTrigger>
                                      <SelectValue placeholder={'Selecciona un nivel'} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {levelData.level.map(level => (
                                      <SelectItem
                                        key={level.title}
                                        title={level.title}
                                        value={level.title}
                                        defaultValue="Elegí un nivel"
                                      >
                                        <div className="flex items-center">
                                          <span>{level.title}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </ScrollArea>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex-shrink-0 w-full h-full overflow-hidden">
            <ScrollArea className="h-full">
              <div className="w-full md:max-w-7xl mx-auto">
                <div className="w-full h-full dark:bg-background md:px-6 bg-white flex flex-col">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold  text-center md:text-start mb-4">
                      Información avanzada
                    </h3>
                  </div>
                  <Card className="flex flex-col md:px-6 dark:bg-background bg-white pt-7 ">
                    <div className="grid w-full">
                      <div className="grid gap-8 md:grid-cols-1">
                        <Card className="dark:bg-[#1A1A23] bg-white h-fit mx-3 md:mx-0 py-3 dark:text-white text-black">
                          <CardContent className="px-3 pt-3 ">
                            <div className="space-y-4 ">
                              <div className="">
                                <Label className="text-base">
                                  Imagen del Curso
                                  <span className="text-red-600">*</span>
                                </Label>
                                <p className="text-[10.49px] font-poppins py-2 text-muted-foreground mb-4">
                                  Sube la imagen de tu curso aquí. Requisitos importantes: 1200x600
                                  píxeles o relación 12:8. Formatos compatibles: .jpg, .jpeg o .png.
                                </p>
                                <div className="flex items-start justify-center pb-3">
                                  {picture ? (
                                    <div className="flex justify-center relative">
                                      <Image
                                        src={picture}
                                        alt="selecciona una imagen"
                                        width={50}
                                        height={50}
                                        className="object-cover w-1/2 rounded-md"
                                      />
                                      <label
                                        htmlFor="thumbnail"
                                        className="absolute left-2 bottom-2 dark:bg-white cursor-pointer rounded-md "
                                      >
                                        <Upload className="h-8 w-8 text-muted-foreground p-1 " />

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
                                  ) : (
                                    <label
                                      htmlFor="thumbnail"
                                      className="flex flex-col items-center justify-center w-1/2 h-30 border-2 border-dashed rounded-lg cursor-pointer dark:bg-card hover:bg-muted/70 transition-colors"
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground text-center">
                                          <span className="font-semibold">Click to upload</span> or
                                          drag and drop
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
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="flex flex-col mx-3 md:mx-0 dark:bg-[#1A1A23] px-3 py-3  dark:text-white text-black">
                          <Label className="pt-3" htmlFor="trailer">
                            Link del trailer
                          </Label>
                          <InputText
                            className="dark:bg-card bg-background "
                            type="text"
                            errors={errors?.trailer?.message}
                            placeholder="https://vimeo.com/1022325100"
                            register={register('trailer')}
                            name="trailer"
                          />
                        </Card>
                        <Card className="flex flex-col mx-3 md:mx-0 px-3 dark:bg-[#1A1A23] bg-white mb-7 pt-3 pb-7  dark:text-white text-black">
                          <CardContent className="w-full h-full border-none">
                            <div className="h-full">
                              <div className="h-full">
                                <div className="py-3 ">
                                  <Label className="text-base ">
                                    Descripción del curso
                                    <span className="text-red-600">*</span>
                                  </Label>
                                </div>
                                <Textarea
                                  className="resize-y w-full h-[200px] dark:bg-card bg-background rounded-[13px] "
                                  {...register('description', {
                                    minLength: {
                                      value: 10,
                                      message: 'La descripción debe tener al menos 10 caracteres',
                                    },
                                  })}
                                />
                                <span className="text-red-600 mb-4">
                                  {errors?.description?.message as string}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </div>
        );
      case 3:
        return (
          <div className="w-full dark:bg-background bg-white h-full overflow-hidden flex flex-col">
            <header className="flex flex-col gap-1 pb-4 px-4 md:px-6">
              <h3 className="text-xl md:text-2xl font-semibold text-center md:text-start pb-4">
                Añadir Secciones del curso
              </h3>

              <Card className="dark:bg-background bg-white">
                <CardContent>
                  <p className="font-poppins text-sm md:text-base w-full text-center md:text-start md:w-3/4 py-3 dark:text-white text-black">
                    En esta sección podrás organizar tu curso de manera estructurada, agregando
                    secciones y lecciones internas. Esto te permitirá segmentar y dividir el
                    contenido de forma clara y profesional, facilitando la navegación y el
                    aprendizaje de los estudiantes.
                  </p>
                </CardContent>
              </Card>
            </header>
            <ScrollArea className="flex-grow rounded-lg border p-2 md:p-4 shadow-2xl">
              <div className="flex flex-col gap-4 md:gap-5">
                {sections.map((section, sectionIndex) => {
                  const sectionBgColor =
                    sectionBackgrounds[sectionIndex % sectionBackgrounds.length];
                  const sectionDarkBgColor =
                    sectionDarkBackgrounds[sectionIndex % sectionDarkBackgrounds.length];
                  return (
                    <Card
                      key={section.id}
                      className="dark:bg-[#1A1A23] bg-white dark:text-white text-black"
                    >
                      <div
                        className={`flex flex-col dark:${sectionBgColor} ${sectionDarkBgColor} px-2 md:px-3 rounded-[13px]`}
                      >
                        <span className="font-poppins font-semibold text-sm md:text-base px-2 md:px-3 pt-3">
                          Sección {sectionIndex + 1}
                        </span>
                        <div className="border pb-3 px-2 md:px-3">
                          <div className="pb-3">
                            <Label className="text-sm md:text-base">
                              Ingrese el título de la sección{' '}
                              <span className="text-red-600">*</span>
                            </Label>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <Input
                              {...register(`sections.${sectionIndex}.title`, {
                                required: true,
                              })}
                              placeholder="Ingrese el título de la sección"
                              className="flex-1 dark:bg-background bg-white rounded-[13px] text-sm md:text-base"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeSection(sectionIndex)}
                              className="ml-2 hover:bg-secondary"
                            >
                              <Trash className="text-red-500 hover:text-white w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                          </div>
                          <div className="space-y-3 md:space-y-4">
                            {watch(`sections.${sectionIndex}.lessons`)?.map(
                              (_: Lesson, lessonIndex: number) => (
                                <div key={lessonIndex} className="border px-2 md:px-3 rounded">
                                  <Separator className="dark:bg-[#818181] my-2 md:my-3"></Separator>
                                  <p className="pb-2 md:pb-3 text-sm md:text-base">
                                    Lección {lessonIndex + 1}{' '}
                                    <span className="text-red-600">*</span>
                                  </p>
                                  <div className="flex justify-between gap-3 md:gap-5 items-center">
                                    <Input
                                      {...register(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.title`,
                                        { required: true }
                                      )}
                                      placeholder="Ingrese el título de la lección"
                                      className="flex-1 dark:bg-background bg-white text-sm md:text-base"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() => handleRemoveLesson(sectionIndex, lessonIndex)}
                                      className="ml-2"
                                    >
                                      <Trash className="text-red-500 hover:text-white w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                  </div>
                                  <div className="py-2 md:py-3">
                                    <Select
                                      onValueChange={value => {
                                        setValue(
                                          `sections.${sectionIndex}.lessons.${lessonIndex}.type`,
                                          value
                                        );
                                        handleLessonTypeChange(sectionIndex, lessonIndex, value);
                                      }}
                                      defaultValue="none"
                                    >
                                      <SelectTrigger className="w-full dark:text-[#A7A7A7] dark:bg-background bg-white rounded-[13px] text-sm md:text-base">
                                        <SelectValue placeholder="Seleccionar tipo de contenido" />
                                      </SelectTrigger>
                                      <SelectContent className="rounded-[13px]">
                                        <SelectItem value="none" disabled>
                                          Selecciona tu contenido
                                        </SelectItem>
                                        <SelectItem value="videoUrl">Video</SelectItem>
                                        <SelectItem value="textContent">PDF</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {lessonTypes[sectionIndex]?.[lessonIndex] ===
                                  undefined ? null : lessonTypes[sectionIndex]?.[lessonIndex] ===
                                    'textContent' ? (
                                    <>
                                      <div className="pb-3">
                                        <Button
                                          onClick={() =>
                                            window.open(
                                              'https://pdf-ms-final.vercel.app/',
                                              '_blank'
                                            )
                                          }
                                        >
                                          Subir PDF
                                        </Button>
                                      </div>
                                      <Input
                                        {...register(
                                          `sections.${sectionIndex}.lessons.${lessonIndex}.textContent`
                                        )}
                                        placeholder="Ingrese la URL del PDF"
                                        className="dark:bg-background bg-white mb-2 md:mb-3 text-sm md:text-base"
                                      />
                                    </>
                                  ) : (
                                    <Input
                                      {...register(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`
                                      )}
                                      placeholder="Ingrese la URL del video (Vimeo)"
                                      className="dark:bg-background bg-white mb-2 md:mb-3 text-sm md:text-base"
                                    />
                                  )}
                                  <Input
                                    {...register(
                                      `sections.${sectionIndex}.lessons.${lessonIndex}.downloadableFile`
                                    )}
                                    placeholder="URL del material descargable para el usuario (opcional / en formato PDF)"
                                    className="dark:bg-background bg-white py-2 md:py-3 text-sm md:text-base"
                                  />
                                  <div className="mt-2 flex items-center gap-2">
                                    <Controller
                                      name={`sections.${sectionIndex}.lessons.${lessonIndex}.isFree`}
                                      control={control}
                                      defaultValue={false}
                                      render={({ field }) => (
                                        <Checkbox
                                          id={`isFree-${sectionIndex}-${lessonIndex}`}
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      )}
                                    />

                                    <label
                                      htmlFor={`isFree-${sectionIndex}-${lessonIndex}`}
                                      className="text-sm md:text-base"
                                    >
                                      Clase gratuita
                                    </label>
                                  </div>
                                </div>
                              )
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setValue(`sections.${sectionIndex}.lessons`, [
                                  ...(watch(`sections.${sectionIndex}.lessons`) || []),
                                  { title: '', videoUrl: '' },
                                ])
                              }
                              className="mt-2 text-sm md:text-base"
                            >
                              <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Añadir Lección
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSection({ title: '', lessons: [] })}
                  className="mt-4 mx-4 md:mx-20 lg:mx-80 dark:bg-card bg-white font-poppins hover:text-[#A7A7A7] py-4 md:py-5 lg:py-7 text-sm md:text-base"
                >
                  <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Añadir Sección
                </Button>
              </div>
            </ScrollArea>
          </div>
        );
      case 4:
        return (
          <div className="h-full overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex-1 flex-col gap-5">
                <header className="border-b flex flex-col gap-4">
                  <h3 className="text-2xl font-semibold md:space-y-3 pb-3 text-center md:text-start md:pl-6 md:pb-4">
                    Publicación del Curso
                  </h3>
                </header>
                <main className="p-6">
                  <div className="flex flex-col md:flex-row w-full md:justify-around gap-5 ">
                    <Card className="dark:bg-background bg-white dark:shadow-gray-950 shadow-gray-200 shadow-2xl md:w-1/2 dark:text-white text-black ">
                      <CardContent className="p-6 ">
                        <div className="space-y-3">
                          <div>
                            <h4 className="mb-2 text-lg font-semibold">Mensaje Bienvenida</h4>
                            <div className="w-full h-1/2">
                              <div>
                                <Label className="mb-2 block text-sm" htmlFor="welcome">
                                  Programa un mensaje de bienvenida.{' '}
                                  <span className="text-red-600">*</span>
                                </Label>
                                <Textarea
                                  className="resize-none w-full h-[150px] p-3 dark:bg-card bg-background "
                                  {...register('welcomeMessage', {
                                    maxLength: {
                                      value: 1000,
                                      message:
                                        'El mensaje de bienvenida no puede tener más de 1000 caracteres',
                                    },
                                    minLength: {
                                      value: 10,
                                      message:
                                        'El mensaje de bienvenida debe tener al menos 10 caracteres',
                                    },
                                  })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-background bg-white dark:shadow-gray-950 shadow-gray-200 shadow-2xl md:w-1/2 dark:text-white text-black ">
                      <CardContent className="p-6 ">
                        <h4 className="mb-2 text-lg font-semibold">
                          Mensaje al Finalizar el Curso
                        </h4>

                        <div>
                          <label className="mb-2 block text-sm" htmlFor="congrats">
                            Programa un mensaje automatico de felicitacion.{' '}
                            <span className="text-red-600">*</span>
                          </label>
                          <Textarea
                            className="resize-none w-full h-[150px] p-3 dark:bg-card bg-background"
                            {...register('completedMessage', {
                              maxLength: {
                                value: 1000,
                                message:
                                  'El mensaje de felicitaciones no puede tener más de 1000 caracteres',
                              },
                              minLength: {
                                value: 10,
                                message:
                                  'El mensaje de felicitaciones debe tener al menos 10 caracteres',
                              },
                            })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="dark:bg-background bg-white dark:shadow-gray-950 shadow-gray-200 shadow-2xl mt-6 md:mt-10 p-6 dark:text-white text-black">
                    <div>
                      <div>
                        <div className="flex items-center py-3">
                          <Controller
                            name="isVisibleToSubscribers"
                            control={control}
                            defaultValue={[]} // Inicia como un array vacío
                            render={({ field }) => (
                              <Checkbox
                                id="isVisibleToSubscribers"
                                checked={field.value.includes('Suscripción basic')}
                                onCheckedChange={value =>
                                  field.onChange(
                                    value
                                      ? [...field.value, 'Suscripción basic']
                                      : field.value.filter((v: string) => v !== 'Suscripción basic')
                                  )
                                }
                              />
                            )}
                          />
                          <label
                            htmlFor="isVisibleToSubscribers"
                            className="text-sm font-medium ml-2 cursor-pointer hover:opacity-80"
                          >
                            Visible para Suscriptores Basic
                          </label>
                        </div>
                        <div className="flex items-center py-3">
                          <Controller
                            name="isVisibleToSubscribers"
                            control={control}
                            defaultValue={[]} // Inicia como un array vacío
                            render={({ field }) => (
                              <Checkbox
                                id="suscripcionIcon"
                                checked={field.value.includes('Suscripción icon')}
                                onCheckedChange={value =>
                                  field.onChange(
                                    value
                                      ? [...field.value, 'Suscripción icon']
                                      : field.value.filter((v: string) => v !== 'Suscripción icon')
                                  )
                                }
                              />
                            )}
                          />
                          <label
                            htmlFor="suscripcionIcon"
                            className="text-sm font-medium ml-2 cursor-pointer hover:opacity-80"
                          >
                            Visible para Suscriptores Icon
                          </label>
                        </div>
                        <div className="flex items-center py-3">
                          <Controller
                            name="isVisibleToSubscribers"
                            control={control}
                            defaultValue={[]} // Inicia como un array vacío
                            render={({ field }) => (
                              <Checkbox
                                id="suscripcionDiamond"
                                checked={field.value.includes('Suscripción diamond')}
                                onCheckedChange={value =>
                                  field.onChange(
                                    value
                                      ? [...field.value, 'Suscripción diamond']
                                      : field.value.filter(
                                          (v: string) => v !== 'Suscripción diamond'
                                        )
                                  )
                                }
                              />
                            )}
                          />
                          <label
                            htmlFor="suscripcionDiamond"
                            className="text-sm font-medium ml-2 cursor-pointer hover:opacity-80"
                          >
                            Visible para Suscriptores Diamond
                          </label>
                        </div>
                      </div>

                      <p className="mb-2 block text-sm text-gray-500 ">
                        * Marca las casillas correspondientes si este curso es visible para usuarios
                        que han comprado una suscripción, ya sea mensual, semestral o anual.
                      </p>
                    </div>
                  </Card>
                  <Card className="dark:bg-background bg-white dark:shadow-gray-950 shadow-gray-200 shadow-2xl mt-6 md:mt-10 dark:text-white text-black">
                    <div className="flex items-center py-3 ml-6">
                      <Controller
                        name="outOfSale"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="outOfSale"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <label
                        htmlFor="outOfSale"
                        className="text-sm font-medium ml-2 cursor-pointer hover:opacity-80"
                      >
                        Curso fuera de venta
                      </label>
                    </div>
                  </Card>
                  <Card className="dark:bg-background bg-white dark:shadow-gray-950 shadow-gray-200 shadow-2xl mt-6 md:mt-10 dark:text-white text-black">
                    <div className="flex items-center py-3 ml-6">
                      <Controller
                        name="isOnlyForSubscribers"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="isOnlyForSubscribers"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <label
                        htmlFor="isOnlyForSubscribers"
                        className="text-sm font-medium ml-2 cursor-pointer hover:opacity-80"
                      >
                        Curso habilitado solamente para suscriptores
                      </label>
                    </div>
                  </Card>
                  <Card className="dark:bg-background bg-white dark:shadow-gray-950 shadow-gray-200 shadow-2xl mt-6 md:mt-10 dark:text-white text-black">
                    <div className="grid gap-4 md:grid-cols-2 h-1/2 p-6">
                      <div>
                        <h4 className="mb-2 text-lg font-semibold">Precio Final</h4>
                        <Label className="text-base">
                          Precio final en dólares <span className="text-red-600">*</span>
                        </Label>
                        <InputText
                          placeholder="USD 200"
                          className="dark:bg-card bg-background"
                          type="number"
                          name="price"
                          errors={errors?.price?.message}
                          register={register('price')}
                        />
                      </div>
                    </div>
                  </Card>
                </main>
              </div>
            </ScrollArea>
          </div>
        );
      case 5:
        return (
          // TODO: ESTA CARD SOLO SE DISPARA SI SE CREO EL CURSO CORRECTAMNETE
          isLoading ? (
            <div className="flex justify-start items-center">Guardando...</div>
          ) : (
            <CardSuccessfulCreation
              title="¡Curso Creado con Éxito!"
              text="Tu curso ha sido creado y está listo para ser publicado. ¿Qué te gustaría hacer ahora?"
              textRedirectBtn="Ir a cursos"
              redirectNew="/dashboard/nuevo-curso"
              redirectSeeAll="/dashboard/cursos"
            />
          )
        );
      default:
        return null;
    }
  };
  return (
    <div className="w-full dark:bg-background  rounded-3xl mx-2 md:mx-8 ">
      <div>
        <MediumTitle
          title="Crear nuevo curso"
          className="dark:text-white text-black bg-background"
        />
      </div>
      <div className="flex flex-col gap-5 ">
        <div className="rounded-lg   ">
          <main>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border border-solid dark:border-gray-800 border-gray-300 shadow-md mt-3 rounded-3xl dark:bg-background bg-white"
              >
                <div className="flex flex-col justify-between">
                  <div className="pt-4 px-5">
                    <Progress value={progress} className="h-2 dark:bg-[#D9D9D9] bg-[#D9D9D9]" />
                  </div>

                  <div className="py-2 w-full">
                    <div className="flex items-center justify-between border-b w-full">
                      {step !== 5 && (
                        <nav className="flex gap-2 pb-4 md:gap-6 px-2 md:px-4 overflow-x-auto w-full justify-start items-start">
                          {[
                            'Información básica',
                            'Información Avanzada',
                            'Clases',
                            'Publicar Curso',
                          ].map((label, index) => (
                            <Button
                              key={label}
                              onClick={() => setStep(index + 1)}
                              className={`relative text-[10px] md:text-sm h-8 md:h-10 shadow-none dark:hover:text-white hover:text-black hover:bg-transparent bg-transparent rounded-none border-b-2 border-transparent px-1 md:px-4 pb-1 md:pb-3 pt-1 md:pt-2 font-medium whitespace-nowrap ${
                                step === index + 1
                                  ? 'border-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {label}
                              {step === index + 1 && (
                                <span className="hidden md:flex ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                                  {index + 1}/4
                                </span>
                              )}
                            </Button>
                          ))}
                        </nav>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-[calc(100vh-250px)] md:h-[calc(100vh-200px)]">
                  <div className="flex-grow overflow-y-auto px-4 py-2">{renderStep(step)}</div>
                  <div className="flex gap-3 md:gap-5 p-3 md:p-4 mt-auto">
                    {step !== 5 && (
                      <Button
                        variant="outline"
                        type="button"
                        className="text-[#908D8D] text-xs md:text-sm font-bold font-groteskLight rounded-full w-full h-9 md:h-14  px-2 md:px-0 py-3"
                        onClick={() => setStep(prevStep => Math.max(prevStep - 1, 1))}
                        disabled={step === 1}
                      >
                        Volver
                      </Button>
                    )}
                    <Button
                      type={step === 5 ? 'submit' : 'button'}
                      className="text-white text-xs md:text-sm font-bold font-groteskLight py-5 rounded-full w-full h-9 md:h-14 px-2 md:px-0 "
                      style={{ display: step === 5 ? 'none' : 'flex' }}
                      onClick={() => {
                        setStep(prevStep => Math.min(prevStep + 1, 5));
                      }}
                    >
                      {step < 4 ? 'Continuar' : 'Guardar'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </main>
        </div>
      </div>
    </div>
  );
}
