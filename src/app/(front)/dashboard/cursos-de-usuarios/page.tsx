'use client';

import React, { useEffect, useState } from 'react';
import { getTitleCourses, getUsersByEmail } from '@/utils/Endpoints/adminEndpoints';
import { Types } from 'mongoose';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, HandCoins } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { createCourseProgress } from '@/utils/Endpoints/coursesEndpoint';
import { SuccessModal } from '@/components/SuccessModal/SuccesModal';
import { RemoveUserCourse } from '@/components/Dashboard/RemoveUserCourse';
import { Toaster, toast } from 'sonner';
import { getRoleIdForCourse } from '@/lib/discord/roles/roleManager';

// import { useSession } from 'next-auth/react';

interface UserProps {
  _id: Types.ObjectId;
  email: string;
  username: string;
}

interface CourseProps {
  _id: Types.ObjectId;
  title: string;
}

interface ApprovedProps {
  message: string;
  success: boolean;
}

export default function CursosDeUsuariosPage() {
  const [open, setOpen] = useState(false);
  const [openPopoverCourse, setOpenPopoverCourse] = useState(false);
  const [valueUser, setValueUser] = useState('');
  const [valueCourse, setValueCourse] = useState('');
  const [users, setUsers] = useState<UserProps[]>([]);
  const [courses, setCourses] = useState<CourseProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isApproved, setIsApproved] = useState<ApprovedProps>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const { data: session } = useSession();

  const courseTitles = [
    'DeFi Avanzado',
    'Análisis fundamental | Curso avanzado',
    'Trading avanzado',
    'Análisis Técnico de 0 a 100',
    'NFTs Revolution',
    'Solidity',
    'Finanzas Personales',
    'Bolsa argentina',
    'StartZero',
    'Hedge Value',
    'Trading Pro',
  ];

  const giveCourse = async () => {
    const courseTitle = valueCourse.split('-.-')[0]; // Nombre del curso
    // console.log('courseTitle', courseTitle);

    const data = {
      courseId: valueCourse.split('-.-').pop(),
      userId: valueUser?.split('-.-').pop(),
    };
    const res = await createCourseProgress(data);
    setIsApproved(res);
    setShowSuccessModal(true);

    if (res.success) {
      // Si el curso no está en courseTitles, mostrar el toast de éxito simple
      if (!courseTitles.includes(courseTitle)) {
        toast.success('', {
          description: <p>Curso otorgado exitosamente.</p>,
          duration: 15000,
          action: {
            label: 'X',
            onClick: () => {
              window.close();
            },
          },
        });
      }
    } else {
      // Si la respuesta no es exitosa, mostrar un toast de error
      toast.error('', {
        description: <p>Error al otorgar el Curso.</p>,
        duration: 15000,
        action: {
          label: 'X',
          onClick: () => {
            window.close();
          },
        },
      });
    }

    //console.log(courseTitle);
    //console.log(data.userId);

    // LOGICA DE DISCORD - Actualizar discordConnected a true
    if (courseTitles.includes(courseTitle)) {
      try {
        // console.log('courseTitle', courseTitle);
        const rolDiscordCursoComprado = getRoleIdForCourse(courseTitle);

        const updateRes = await fetch(`/api/admin/update-user-course/${data.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ title: courseTitle }),

          body: JSON.stringify({
            userId: data.userId,
            courses: [
              {
                rolId: rolDiscordCursoComprado,
                title: courseTitle,
                status: 'claimed',
                orderDate: new Date(),
                rolNumber: courseTitle === 'Trading Pro' ? 1 : 0,
                source: 'manual',
                subscriptionType: null,
              },
            ],
          }),
        });

        const result = await updateRes.json();

        // console.log('rolDiscordCursoComprado', rolDiscordCursoComprado);

        const resPost = await fetch('/api/discord/rol-schema-course', {
          method: 'POST',
          body: JSON.stringify({
            userId: data.userId,
            courses: [
              {
                rolId: rolDiscordCursoComprado,
                title: courseTitle,
                status: 'claimed',
                orderDate: new Date(),
                rolNumber: courseTitle === 'Trading Pro' ? 1 : 0,
                source: 'manual',
                subscriptionType: null,
              },
            ],
          }),
        });

        console.log('resPost', resPost);

        if (resPost.status === 201) {
          console.log('🎉 Curso creado correctamente con POST');
        } else if (resPost.status === 409) {
          console.log('ℹ️ Ya existe el documento rol, haciendo PUT...');
          const course = {
            rolId: rolDiscordCursoComprado,
            title: courseTitle,
            status: 'claimed',
            orderDate: new Date(),
            rolNumber: courseTitle === 'Trading Pro' ? 1 : 0,
          };

          const res = await fetch('/api/discord/rol-schema-course', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.userId,
              ...course, // desglosa los campos del curso
            }),
          });

          const putResult = await res.json();
          // console.log('✅ PUT completado:', putResult);
        }

        // Manejo específico si no se encuentra el documento Rol
        if (updateRes.status === 404 && result.success) {
          // console.log('Error al remover el rol de Discord No se actualizaran estados.');

          toast.message('', {
            description: (
              <ul className="list-disc text-left ml-3">
                <li>Curso otorgado exitosamente. ✅</li>
                <li>Roles asignados exitosamente. ✅</li>
              </ul>
            ),
            duration: 15000,
            action: {
              label: 'X',
              onClick: () => {
                window.close();
              },
            },
          });
          return; // Salir de la función para no continuar con POST ni más toasts
        }

        if (!result.success && result.status !== 404) {
          console.error('Error al actualizar discordConnected:', result.message);

          toast.message('', {
            description: (
              <ul className="list-disc text-left ml-3">
                <li>Suscripción expirada. ✅</li>
                <li className="text-red-500 font-bold">
                  Error al remover el rol de Discord No se actualizaran estados.
                </li>
              </ul>
            ),

            duration: 15000,
            action: {
              label: 'X',
              onClick: () => {
                window.close();
              },
            },
          });
        } else {
          toast.message('', {
            description: (
              <ul className="list-disc text-left ml-3">
                <li>Curso otorgado exitosamente. ✅</li>
                <li className={res.discordError ? 'text-red-500 font-bold' : ''}>
                  {!result.discordError
                    ? 'Recordatorio de Discord activado. ✅'
                    : 'Error al remover el rol de Discord. ❌'}
                </li>
              </ul>
            ),
            duration: 15000,
            action: {
              label: 'X',
              onClick: () => {
                window.close();
              },
            },
          });

          // console.log('discordConnected actualizado correctamente');
        }
      } catch (error) {
        console.error('Error de red al actualizar discordConnected:', error);
      }
    } else {
      console.log('El curso no requiere conexión con Discord.');
    }
  };

  const getUsers = async (searchValue: string) => {
    setLoading(true);
    try {
      const res = await getUsersByEmail(searchValue);
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getCourses = async () => {
    try {
      const res = await getTitleCourses();
      setCourses(res.data || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setCourses([]);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    setValueUser(searchValue);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      getUsers(searchValue);
    }, 500);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    getCourses();
  }, []);

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const validUser = emailRegex.test(valueUser);

  // El value tanto del curso como del usuario deberian ser los IDs
  return (
    <div className="w-full">
      {/* Título Principal */}
      <div className="text-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Otorgar un curso a un usuario</h1>
      </div>

      {/* Descripción */}
      <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
        Dale un curso a algún usuario de{' '}
        <span className="font-semibold text-primary">Finanflix</span>.
        <br />
        <span className="font-medium">Paso 1:</span> Búscalo por su email.
        <br />
        <span className="font-medium">Paso 2:</span> Selecciona el curso que deseas otorgarle.
        <br />
        <span className="font-medium">Paso 3:</span> Haz clic en el botón{' '}
        <span className="font-semibold">Dar curso</span>.
      </p>
      <Separator className="my-4" />
      <div className="w-full flex flex-col md:flex-row justify-center gap-3 md:gap-10">
        <Popover open={openPopoverCourse} onOpenChange={setOpenPopoverCourse}>
          <PopoverTrigger asChild>
            <div className="w-full text-center">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPopoverCourse}
                className="w-[210px] justify-between truncate "
              >
                <span className="truncate">
                  {valueCourse
                    ? courses.find(u => u.title + '-.-' + u._id.toString() === valueCourse)
                        ?.title || 'Sin resultados'
                    : 'Selecciona un curso...'}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Buscar por título..." />
              <CommandList>
                <>
                  <CommandEmpty>No hay resultados.</CommandEmpty>
                  <CommandGroup>
                    {courses.length > 0 &&
                      courses.map(u => (
                        <CommandItem
                          key={u._id.toString()}
                          value={u.title + '-.-' + u._id.toString()}
                          onSelect={currentValue => {
                            setValueCourse(currentValue === valueUser ? '' : currentValue);
                            setOpenPopoverCourse(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              valueUser === u.title + '-.-' + u._id.toString()
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {u.title}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex gap-2 text-center justify-center">
          {'-'}
          <HandCoins />
          {'-'}
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="w-full text-center">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                <span className="truncate">
                  {valueUser
                    ? users?.find(u => u.email + '-.-' + u._id.toString() === valueUser)?.email ||
                      'Sin resultados'
                    : 'Selecciona un usuario...'}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput
                placeholder="Buscar por email..."
                value={valueUser}
                onValueChange={handleSearchChange}
              />
              <CommandList>
                {loading ? (
                  <div className="p-4 text-center">Buscando...</div>
                ) : (
                  <>
                    <CommandEmpty>No hay resultados.</CommandEmpty>
                    <CommandGroup>
                      {users?.length > 0 &&
                        users?.map(u => (
                          <CommandItem
                            key={u._id.toString()}
                            value={u.email + '-.-' + u._id.toString()}
                            onSelect={currentValue => {
                              setValueUser(currentValue === valueUser ? '' : currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                valueUser === u.email + '-.-' + u._id.toString()
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {u.email}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-center mt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* TODO: Resolver este boton */}
            <Button disabled={!valueCourse || !validUser ? true : false}>Dar curso</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está completamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Vas a darle el curso <span className="font-semibold">{valueCourse}</span> al usuario{' '}
                <span className="font-semibold">{valueUser}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={giveCourse}>Asignar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {isApproved && showSuccessModal && (
        <SuccessModal
          success={isApproved.success}
          text={isApproved.message}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <div className=" w-full text-center pt-10 ">
        <RemoveUserCourse />
      </div>
      <Toaster />
    </div>
  );
}
