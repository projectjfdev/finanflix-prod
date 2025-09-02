import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

import { Toaster, toast } from 'sonner';
import levelData from '@/utils/DataJson/level.json';
import { ICourse } from '@/interfaces/course';
import { InputText } from '../Inputs/InputText';
import Image from 'next/image';
import {
  Pencil,
  CheckCircle,
  Upload,
  Plus,
  Trash,
  Video,
  FileText,
  GripVertical,
} from 'lucide-react';
import { updateCourseById } from '@/utils/Endpoints/coursesEndpoint';
import { useIntervalClick } from '@/hooks/useIntervalClick';
import { Loading } from '@/utils/Loading/Loading';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Card } from '../ui/card';
import { getCategories } from '@/utils/Endpoints/adminEndpoints';
import { Checkbox } from '../ui/checkbox';
// import { useCategories } from "@/hooks/useCategories";

interface Props {
  course: ICourse;
}

interface LessonTypes {
  [sectionIndex: number]: {
    [lessonIndex: number]: string;
  };
}

interface Lesson {
  id: string;
  title: string;
}

const ModalCourseUpdate = ({ course }: Props) => {
  const [picture, setPicture] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isResendDisabled, setIsResendDisabled, setTimer, timer } = useIntervalClick();
  const [hasToastShown, setHasToastShown] = useState(false);
  const [lessonTypes, setLessonTypes] = useState<LessonTypes>({});

  const [isOpen, setIsOpen] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);

  // const { categories } = useCategories();

  // const fetchCategories = async () => {
  //   try {
  //     const res = await getCategories();
  //     setCategories(res.data);
  //     console.log(res);

  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //     toast.error("Failed to load categories");
  //   }
  // };

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

  const sectionBackgrounds = [
    'bg-[#282838]',
    'bg-[#282838]',
    'bg-[#282838]',
    'bg-[#282838]',
    'bg-[#282838]',
  ];

  const sectionDarkBackgrounds = ['bg-background'];

  const form = useForm({
    defaultValues: course,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const sectionsArray = useFieldArray({
    control,
    name: 'sections',
  });

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = event => {
        setPicture(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      let payload;

      if (picture) {
        // Si hay una nueva imagen, incluye el campo `thumbnail`
        payload = {
          ...data,
          thumbnail: picture,
        };
      } else {
        // Si no hay una nueva imagen, excluye el campo `thumbnail`
        const { thumbnail, ...restData } = data; // Excluir `thumbnail`
        payload = { ...restData };
      }

      const res = await updateCourseById(course._id.toString(), payload);

      if (res.success) {
        setIsResendDisabled(true);
        setTimer(10);
        if (!hasToastShown) {
          toast('¡Curso actualizado con éxito!', {
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

  const handleLessonTypeChange = (sectionIndex: number, lessonIndex: number, type: string) => {
    setLessonTypes((prev: LessonTypes) => ({
      ...prev,
      [sectionIndex]: {
        ...prev[sectionIndex],
        [lessonIndex]: type,
      },
    }));
  };

  const handleRemoveLesson = (sectionIndex: number, lessonIndex: number) => {
    const currentLessons = watch(`sections.${sectionIndex}.lessons`);
    const updatedLessons = currentLessons.filter((_: any, index: number) => index !== lessonIndex);
    setValue(`sections.${sectionIndex}.lessons`, updatedLessons);
  };

  const handleDragEnd = (sectionIndex: any, fromIndex: any, toIndex: any) => {
    const updatedSections = [...sectionsArray.fields];
    const lessons = updatedSections[sectionIndex].lessons;

    // Reorder lessons within the specific section
    const [movedLesson] = lessons.splice(fromIndex, 1);
    lessons.splice(toIndex, 0, movedLesson);

    // Update the field array
    sectionsArray.update(sectionIndex, {
      ...updatedSections[sectionIndex],
      lessons,
    });
  };

  useEffect(() => {
    return () => {
      setHasToastShown(false);
    };
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="p-5">
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
                register={register('title', {
                  maxLength: {
                    value: 80,
                    message: 'El título es demasiado largo. Máximo 80 caracteres',
                  },
                  // minLength: {
                  //   value: 2,
                  //   message: 'El título debe tener al menos dos caracteres',
                  // },
                })}
                name="title"
              />
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
                    value: 100,
                    message: 'El subtítulo no puede pasar de los 100 caracteres',
                  },
                  // minLength: {
                  //   value: 2,
                  //   message: 'El subtítulo debe tener al menos 2 caracteres',
                  // },
                })}
                name="subtitle"
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
                                course.category ? course.category : 'Selecciona una categoria'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category: any) => (
                              <SelectItem
                                key={category._id.toString()}
                                title={category.name}
                                value={category.name}
                              >
                                <div className="flex items-center">
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-categories">No categories available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col justify-between gap-5 mb-6 ">
                      <Label>
                        Nivel del curso
                        <span className="text-red-600">*</span>
                      </Label>
                      <Select onValueChange={field.onChange}>
                        <FormControl className="w-5/6 dark:bg-card bg-background rounded-[13px]">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={course.level ? course.level : 'Selecciona un nivel'}
                            />
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

              <div className="flex items-center py-3 mb-4">
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

              <div className="flex items-center py-3 mb-4">
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
                  Habilitar curso solamente para suscriptores
                </label>
              </div>

              <div className="dark:bg-[#1A1A23]  bg-background h-fit md:mx-0  rounded-xl">
                <div className="px-6 pt-3 ">
                  <div className="">
                    <Label className="text-base">
                      Miniatura del Curso
                      <span className="text-red-600">*</span>
                    </Label>
                    <p className="text-[10.49px] font-poppins py-2 text-muted-foreground mb-4">
                      Sube la imagen de tu curso aquí. Requisitos importantes: 1200x600 píxeles o
                      relación 12:8. Formatos compatibles: .jpg, .jpeg o .png.
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
                            src={course?.thumbnail?.url}
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
              </div>
              <Label className=" text-base mt-2" htmlFor="trailer">
                Link del trailer
              </Label>
              <InputText
                className="dark:bg-card bg-background  w-5/6 rounded-lg"
                type="text"
                errors={errors?.trailer?.message}
                placeholder="https://vimeo.com/1022325100"
                register={register('trailer')}
                name="trailer"
              />
              <div>
                <div className="pb-2">
                  <Label className="text-base ">
                    Descripción del curso
                    <span className="text-red-600">*</span>
                  </Label>
                </div>
                <Textarea
                  className="resize-y h-36  dark:bg-card bg-background rounded-[13px] w-80 mb-2 "
                  {...register('description', {
                    // minLength: {
                    //   value: 10,
                    //   message: 'La descripción debe tener al menos 10 caracteres',
                    // },
                  })}
                />
                <span className="text-red-600 mb-4">{errors?.description?.message as string}</span>
              </div>
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
              <Label className="mb-2 block text-base" htmlFor="welcome">
                Programa un mensaje de bienvenida. <span className="text-red-600">*</span>
              </Label>
              <Textarea
                className="resize-none w-full h-[150px] p-3 dark:bg-card bg-background "
                {...register('welcomeMessage', {
                  maxLength: {
                    value: 1000,
                    message: 'El mensaje de bienvenida no puede tener más de 1000 caracteres',
                  },
                  // minLength: {
                  //   value: 10,
                  //   message: 'El mensaje de bienvenida debe tener al menos 10 caracteres',
                  // },
                })}
              />
              <label className="mb-2 mt-2 block text-base" htmlFor="congrats">
                Programa un mensaje automatico de felicitacion.{' '}
                <span className="text-red-600">*</span>
              </label>
              <Textarea
                className="resize-none w-full h-[150px] p-3 dark:bg-card bg-background"
                {...register('completedMessage', {
                  maxLength: {
                    value: 1000,
                    message: 'El mensaje de felicitaciones no puede tener más de 1000 caracteres',
                  },
                  // minLength: {
                  //   value: 10,
                  //   message: 'El mensaje de felicitaciones debe tener al menos 10 caracteres',
                  // },
                })}
              />
              <Separator className="bg-gray-200 my-4" />
              <Label className="mb-2 block text-base">Secciones y lecciones</Label>
              <Separator className="bg-gray-200 my-4" />

              <div className="flex flex-col gap-4 md:gap-5">
                {sectionsArray.fields.map((section, sectionIndex) => {
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
                              onClick={() => sectionsArray.remove(sectionIndex)}
                              className="ml-2 hover:bg-secondary"
                            >
                              <Trash className="text-red-500 hover:text-white w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                          </div>
                          <div className="space-y-3 md:space-y-4">
                            {watch(`sections.${sectionIndex}.lessons`)?.map(
                              (lesson: any, lessonIndex: number) => (
                                <div
                                  key={lesson._id}
                                  className="border px-2 md:px-3 rounded"
                                  draggable
                                  onDragStart={e =>
                                    e.dataTransfer.setData(
                                      'text/plain',
                                      JSON.stringify({
                                        sectionIndex,
                                        lessonIndex,
                                      })
                                    )
                                  }
                                  onDragOver={e => e.preventDefault()}
                                  onDrop={e => {
                                    const { sectionIndex: fromSection, lessonIndex: fromIndex } =
                                      JSON.parse(e.dataTransfer.getData('text/plain'));
                                    if (fromSection === sectionIndex) {
                                      handleDragEnd(sectionIndex, fromIndex, lessonIndex);
                                    }
                                  }}
                                >
                                  <Separator className="dark:bg-[#818181] my-2 md:my-3"></Separator>
                                  <div className="flex justify-between">
                                    <p className="pb-2 md:pb-3 text-sm md:text-base flex items-center cursor-move">
                                      <GripVertical size={15} /> Lección {lessonIndex + 1}{' '}
                                      <span className="text-red-600">*</span>
                                    </p>
                                    <div>
                                      {watch(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                                      ) === 'videoUrl' ? (
                                        <div className="flex gap-2">
                                          <Video />
                                          <span>Video</span>
                                        </div>
                                      ) : watch(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                                      ) === 'textContent' ? (
                                        <div className="flex gap-2">
                                          <FileText />
                                          <span>PDF</span>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
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
                                  { title: '', videoUrl: '' } as any,
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
                  onClick={() => sectionsArray.append({ title: '', lessons: [] })}
                  className="dark:bg-card bg-white hover:text-[#A7A7A7] text-sm md:text-base"
                >
                  <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Añadir Sección
                </Button>
              </div>
              <Separator className="bg-gray-200 my-4" />
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

export default ModalCourseUpdate;
