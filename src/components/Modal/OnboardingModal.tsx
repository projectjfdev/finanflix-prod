'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { toast, Toaster } from 'sonner';
import { createUserPreferences } from '@/utils/Endpoints/configUserEndpoints';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useSession } from 'next-auth/react';
import { Checkbox } from '../ui/checkbox';
import { areasOptions, availabilityOptions, dataStudyTime } from '@/utils/DataJson/dataPreferences';

interface OnboardingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ApprovedProps {
  message: string;
  success: null | boolean;
}

export default function OnboardingModal({ isOpen, onOpenChange }: OnboardingModalProps) {
  const { data: session } = useSession();
  const [studyTime, setStudyTime] = useState<string | null>(null);
  const [selectedWeeklyAvailability, setSelectedWeeklyAvailability] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState<ApprovedProps>();
  const [step, setStep] = useState(1);

  const form = useForm();
  const {
    watch,
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm();

  const onSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);

    reset();
    try {
      const newData = {
        ...data,
        studyTime: studyTime,
        weeklyAvailability: selectedWeeklyAvailability,
        userId: session?.user?._id.toString(),
      };
      const res = await createUserPreferences(newData);
      if (res.success) {
        toast.success('¡Todo listo!', {
          description:
            'Tus preferencias están configuradas. Prepárate para una experiencia hecha a tu medida. Conectate a Discord y completa el ultimo paso del onboarding! 🚀',
        });
        onOpenChange(false);

        // Timeout para redirigir después de 10 segundos
        const timer = setTimeout(() => {
          window.location.reload(); // Recarga la página
        }, 5000); // 10 segundos
        return () => clearTimeout(timer);
      }

      setIsApproved(res);

      setIsLoading(false);
    } catch (error) {
      // console.error('Error al valuar:', error);
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const selectedSpecialization = watch('specializationArea');

  // LOGICA PARA DESHABILITAR EL BOTON DE GUARDAR EN PREFERENCIAS SI TODOS LOS CAMPOS NO ESTAN COMPLETADOS
  const cryptoStartDate = watch('cryptoStartDate');
  const experienceInOtherMarkets = watch('experienceInOtherMarkets');
  const howDidYouDo = watch('howDidYouDo');
  const principalObjective = watch('principalObjective');
  const futureGoalInTwoYears = watch('futureGoalInTwoYears');
  const goalInFiveYears = watch('goalInFiveYears');
  const availableCapital = watch('availableCapital');

  const allFieldsFilled =
    cryptoStartDate &&
    experienceInOtherMarkets &&
    howDidYouDo &&
    principalObjective &&
    futureGoalInTwoYears &&
    goalInFiveYears &&
    availableCapital;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {/* <DialogContent
          closeButtonClassName="top-10"
          className="py-7 md:mx-0 xs:overflow-scroll sm:overflow-hidden overflow-hidden px-10"
          // className="py-7 px-10 max-h-[80vh] overflow-y-auto custom-scrollbar"
        > */}
        <DialogContent className="py-14">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className=" h-full">
              <div className="rounded-lg dark:bg-background w-full h-full">
                <div className="flex space-x-2 justify-center w-full pb-5">
                  <Progress
                    value={step >= 1 ? 100 : 0} // Llena la barra si el step >= 1
                    className={` w-24 sm:w-full ${step >= 1 ? 'bg-blue-500 ' : 'dark:bg-[#D9D9D9] bg-[#D9D9D9]'
                      }`}
                  />
                  <Progress
                    value={step >= 2 ? 100 : 0} // Llena la barra si el step >= 2
                    className={` w-24 sm:w-full ${step >= 2 ? 'bg-blue-500' : 'dark:bg-[#D9D9D9] bg-[#D9D9D9]'
                      }`}
                  />
                  <Progress
                    value={step >= 3 ? 100 : 0} // Llena la barra si el step >= 3
                    className={` w-24 sm:w-full ${step >= 3 ? 'bg-blue-500' : 'dark:bg-[#D9D9D9] bg-[#D9D9D9]'
                      }`}
                  />
                </div>

                {/* ACA ESTA EL HIDDEN DEL CONTENIDO */}

                <div className="flex h-full">
                  {/* ONBOARDING */}
                  {step === 1 && (
                    <div
                      className={`h-full transform transition-transform duration-500 xs:overflow-x-scroll xsm:overflow-x-hidden overflow-y-auto custom-scrollbar ${step === 1
                        ? 'translate-x-0'
                        : step === 2
                          ? '-translate-x-full'
                          : step === 3
                            ? '-translate-x-[200%]'
                            : ''
                        } flex-shrink-0 w-full h-full`}
                    >
                      <div className="p-3 mx-auto flex flex-col gap-5 w-full h-full justify-between pb-7 md:pb-10">
                        <div className="text-start">
                          <div
                            className="text-[22px] md:text-[26px] font-bold break break-all "
                            id="step1"
                          >
                            Intereses principales
                          </div>
                          <p className="text-muted-foreground pt-3 text-base md:text-lg  ">
                            ¿Cuáles son tus intereses principales?
                          </p>
                        </div>

                        <Controller
                          name="specializationArea"
                          control={control}
                          render={({ field }) => (
                            <>
                              {areasOptions.map(option => {
                                const isChecked = (field.value ?? []).includes(option.name);
                                return (
                                  <div
                                    key={option.name}
                                    className={`flex items-center gap-4 p-4 w-full justify-center rounded-2xl transition-colors py-6 text-lg
                                    ${isChecked
                                        ? 'bg-secondary text-white hover:bg-secondary'
                                        : 'bg-card text-black dark:bg-card dark:text-white hover:bg-secondary hover:text-white dark:hover:text-[#A7A7A7]'
                                      }`}
                                  >
                                    <Checkbox
                                      id={option.name}
                                      checked={isChecked}
                                      onCheckedChange={checked => {
                                        const newValue = checked
                                          ? [...(field.value ?? []), option.name]
                                          : (field.value ?? []).filter(
                                            (v: string) => v !== option.name
                                          );
                                        field.onChange(newValue);
                                      }}
                                    />
                                    <Label htmlFor={option.name} className="text-lg cursor-pointer">
                                      {option.label}
                                    </Label>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        />
                        <p className="hidden md:flex justify-center font-poppins text-center text-lg  text-[#A7A7A7]  ">
                          Cada paso cuenta. Sigue adelante y alcanza tus metas con FINANFLIX.
                        </p>
                        <div className="mt-auto pt-8">
                          <div className="w-full  flex flex-col md:flex-row gap-5 mb-10">
                            <Button
                              type="button"
                              variant={'outline'}
                              className="dark:text-white text-[#908D8D]  font-bold font-groteskLight rounded-full w-full dark:bg-card bg-white py-3 md:text-lg md:py-4 text-sm"
                              size="xl"
                              disabled
                            >
                              Volver
                            </Button>

                            <Button
                              type="button"
                              size="xl"
                              className="text-white dark:hover:bg-secondary font-groteskLight rounded-full w-full md:text-lg py-3 md:py-4 text-sm"
                              onClick={() => {
                                setStep(prevStep => Math.min(prevStep + 1, 3));
                              }}
                              disabled={
                                !selectedSpecialization || selectedSpecialization.length === 0
                              }
                            >
                              Continuar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DISPONIBILIDAD */}
                  {step === 2 && (
                    <div
                      className={` w-full transform transition-transform duration-500 ${step === 2 ? 'translate-x-0' : step === 3 ? '-translate-x-full' : ''
                        } flex-shrink-0  xs:overflow-x-scroll xsm:overflow-x-hidden overflow-y-auto custom-scrollbar h-auto`}
                    >
                      <div className="p-3 mx-auto flex gap-5 flex-col w-full h-full justify-between pb-10">
                        {/* TITULO DISPONIBILIDADES */}

                        <div className="flex justify-between items-center mb-3 md:mb-8">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            ¿Cuánto tiempo podés dedicarle por día?
                          </h2>
                        </div>

                        {/* CARDS DISPONIBILIDADES */}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {availabilityOptions.map(option => (
                            <Card
                              key={option.hours}
                              className={` min-h-full  hover:shadow-lg cursor-pointer  transition-transform duration-300 ease-in-out hover:scale-105 dark:text-white text-black
                                      ${selectedWeeklyAvailability === option.hours
                                  ? 'bg-secondary text-white'
                                  : 'bg-white dark:bg-gray-800 dark:hover:bg-secondary'
                                }`}
                              onClick={() => setSelectedWeeklyAvailability(option.hours)}
                            >
                              <CardContent className="p-3 md:p-6">
                                <p className="text-xs md:text-sm font-medium mb-1">
                                  {option.hours} por semana
                                </p>
                                <h3 className="text-md md:text-xl font-bold tracking-tight">
                                  {option.title}
                                </h3>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mb-3 md:mb-8">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            ¿En qué momento del día preferís estudiar?
                          </h2>
                        </div>

                        {dataStudyTime.map(button => (
                          <Button
                            type="button"
                            variant={'outline'}
                            key={button.name}
                            className={`dark:text-white  dark:hover:bg-secondary  dark:hover:text-[#A7A7A7] w-full justify-center py-6 md:py-8 text-lg dark:bg-secondary bg-card hover:bg-secondary hover:text-white rounded-2xl ${studyTime === button.name
                              ? 'bg-secondary hover:bg-secondary text-white'
                              : 'dark:bg-card text-black'
                              }

                                `}
                            onClick={() => setStudyTime(button.name)}
                          >
                            <span className="text-sm md:text-lg transition-transform duration-300 ease-in-out hover:scale-105 ">
                              {' '}
                              {button.label}
                            </span>
                          </Button>
                        ))}

                        {/* BOTONES  */}

                        <div className="mt-auto pb-7 md:pb-0 md:pt-8">
                          {' '}
                          <div className="flex  flex-col md:flex-row w-full gap-5 mb-10">
                            <Button
                              type="button"
                              variant={'outline'}
                              className="dark:text-white text-[#908D8D] font-bold font-groteskLight rounded-full w-full py-3 md:text-lg md:py-4 text-sm  dark:bg-card bg-white"
                              size="xl"
                              onClick={() => {
                                // Volver al paso 1
                                setStep(1);

                                // Redirigir al ID específico (suponiendo que el ID al que quieres ir es 'my-id')
                                const targetId = 'step1'; // Aquí puedes cambiar el valor a cualquier ID que necesites
                                const element = document.getElementById(targetId);
                                if (element) {
                                  element.scrollIntoView({
                                    behavior: 'smooth',
                                  });
                                }
                              }}
                            >
                              Volver
                            </Button>
                            <Button
                              disabled={!selectedWeeklyAvailability || !studyTime}
                              type="button"
                              size="xl"
                              className="text-white font-groteskLight rounded-full hover:bg:secondary  dark:hover:bg-secondary py-3 font-bold w-full md:text-lg md:py-4 text-sm "
                              onClick={() => {
                                // Avanzar al siguiente paso, sin superar el paso 3
                                setStep(prevStep => Math.min(prevStep + 1, 3));

                                // Redirigir al ID específico
                                const targetId = 'step3'; // Cambia 'target-id' por el ID que quieres alcanzar
                                const targetElement = document.getElementById(targetId);

                                if (targetElement) {
                                  // Hacer scroll hacia el elemento con el ID específico
                                  targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                  });
                                }
                              }}
                            >
                              Continuar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PREFERENCIAS */}
                  {step === 3 && (
                    <div className="h-full w-full flex flex-col">
                      {' '}
                      {/* <- Asegurar que sea flex-col */}
                      <div
                        className="transform transition-transform duration-500 p-3 flex flex-col h-full w-full overflow-x-hidden pb-7 md:pb-10" // <- Agrego flex-col y h-full acá también
                        id="step3"
                      >
                        <div className="mx-auto flex flex-col w-full h-full">
                          <div className="flex-grow">
                            <h2 className="text-2xl font-bold">Perfil y proyección</h2>
                            <p className="text-base md:text-lg text-muted-foreground py-5">
                              Esta experiencia está pensada para acompañarte en tu camino. Cada dato
                              que completás nos ayuda a brindarte una experiencia hecha a tu medida.
                            </p>
                            <div className="space-y-6 md:pt-5">
                              <div className="space-y-2">
                                <Label className="text-base md:text-lg">
                                  ¿Cuánto tiempo llevás en el mercado cripto?
                                </Label>
                                <FormField
                                  control={control}
                                  name="cryptoStartDate"
                                  render={({ field }) => (
                                    <FormItem className="bg-white dark:bg-card rounded-[13px] ">
                                      <Select onValueChange={field.onChange}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una opción" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Estoy ingresando">
                                            Estoy ingresando
                                          </SelectItem>
                                          <SelectItem value="Menos de un año">
                                            Menos de un año
                                          </SelectItem>
                                          <SelectItem value="Más de un año">
                                            Más de un año
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-base md:text-lg">
                                  ¿Tenés experiencia en otros mercados?
                                </Label>
                                <Textarea
                                  className="h-[80px] dark:text-white text-black bg-white dark:bg-card"
                                  {...register('experienceInOtherMarkets')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-base md:text-lg">¿Cómo te fue?</Label>
                                <Textarea
                                  className="h-[80px] dark:text-white text-black bg-white dark:bg-card"
                                  {...register('howDidYouDo')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-base md:text-lg">
                                  ¿Cuál es tu objetivo principal con las inversiones?
                                </Label>
                                <Textarea
                                  className="h-[80px] dark:text-white text-black bg-white dark:bg-card"
                                  {...register('principalObjective')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-base md:text-lg">
                                  ¿Dónde te gustaría estar de aquí a 2 años?
                                </Label>
                                <Textarea
                                  className="h-[80px] dark:text-white text-black bg-white dark:bg-card"
                                  {...register('futureGoalInTwoYears')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-base md:text-lg">¿Y en más de 5 años?</Label>
                                <Textarea
                                  className="h-[80px] dark:text-white text-black bg-white dark:bg-card"
                                  {...register('goalInFiveYears')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-base md:text-lg">
                                  ¿Cuál es tu capital disponible para lograr tus objetivos?
                                </Label>
                                <FormField
                                  control={control}
                                  name="availableCapital"
                                  render={({ field }) => (
                                    <FormItem className="bg-white dark:bg-card rounded-[13px] ">
                                      <Select onValueChange={field.onChange}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una opción" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Menos de USD 1.000">
                                            Menos de USD 1.000
                                          </SelectItem>
                                          <SelectItem value="Entre USD 1.000 y 5.000">
                                            Entre USD 1.000 y 5.000
                                          </SelectItem>
                                          <SelectItem value="Entre USD 5.000 y 20.000">
                                            Entre USD 5.000 y 20.000
                                          </SelectItem>
                                          <SelectItem value="Más de USD 50.000">
                                            Más de USD 50.000
                                          </SelectItem>
                                          <SelectItem value="Prefiero no decirlo">
                                            Prefiero no decirlo
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            {isApproved && (
                              <Alert
                                className={`mt-4 border ${isApproved.success ? 'border-green-500' : 'border-red-500'
                                  }`}
                              >
                                <AlertTitle
                                  className={isApproved.success ? 'text-green-500' : 'text-red-500'}
                                >
                                  {isApproved.success ? 'Actualizado' : 'Algo falló'}
                                </AlertTitle>
                                <AlertDescription>{isApproved.message}</AlertDescription>
                              </Alert>
                            )}
                          </div>

                          <div className="mt-auto pt-8">
                            <div className="flex flex-col md:flex-row gap-5 w-full mb-10">
                              <Button
                                type="button"
                                variant={'outline'}
                                className="text-[#908D8D] dark:text-white font-bold font-groteskLight rounded-full w-full md:text-lg py-3 md:py-4 text-sm dark:bg-card bg-white"
                                size="xl"
                                onClick={() => {
                                  setStep(prevStep => Math.max(prevStep - 1, 1));
                                }}
                              >
                                Volver
                              </Button>
                              {!isLoading ? (
                                <Button
                                  disabled={!allFieldsFilled}
                                  size="xl"
                                  className="text-white dark:hover:bg-secondary font-groteskLight w-full rounded-full md:text-lg py-3 md:py-4 text-sm"
                                >
                                  Guardar
                                </Button>
                              ) : (
                                <Button
                                  size="xl"
                                  disabled
                                  className="text-white dark:hover:bg-secondary font-groteskLight rounded-full w-full md:text-lg md:py-4 text-sm"
                                >
                                  Guardando...
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>



                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
