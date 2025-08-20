'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUsersByEmail } from '@/utils/Endpoints/adminEndpoints';
import { Card } from '../ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Types } from 'mongoose';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Suscription } from '@/interfaces/user';
import moment from 'moment';
import { Toaster, toast } from 'sonner';
import { getRoleIdForSubscription } from '@/lib/discord/roles/roleManager';
import { getRoleIdForExpiredSuscriptions } from '@/lib/discord/roles/temporary-role-subscriptions/discord-roles-suscription';
import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import { ConfirmModal } from '../Modal/ConfirmModal';

interface IEnrolledCourses {
  _id: Types.ObjectId;
  title: string;
}

interface UserProps {
  _id: Types.ObjectId;
  email: string;
  username: string;
  enrolledCourses: IEnrolledCourses[];
  suscription: Suscription;
  discordId: string | null;
}

interface ApprovedProps {
  message: string;
  success: null | boolean;
}

const subscriptions = [
  { _id: '1', name: 'Suscripcion basic - mensual' },
  { _id: '2', name: 'Suscripcion basic - semestral' },
  { _id: '3', name: 'Suscripcion basic - anual' },
  { _id: '4', name: 'Suscripcion icon - mensual' },
  { _id: '5', name: 'Suscripcion icon - semestral' },
  { _id: '6', name: 'Suscripcion icon - anual' },
  { _id: '7', name: 'Suscripcion diamond - mensual' },
  { _id: '8', name: 'Suscripcion diamond - semestral' },
  { _id: '9', name: 'Suscripcion diamond - anual' },
];

const status = [
  { _id: '1', name: 'active', placeholder: 'Activo' },
  { _id: '2', name: 'cancelled', placeholder: 'Cancelado' },
  { _id: '3', name: 'expired', placeholder: 'Expirado' },
  { _id: '4', name: 'unpaid', placeholder: 'No pagado' },
];

export const UpdateUserSuscription = () => {
  const [openUser, setOpenUser] = useState(false);
  const [valueUserUpdate, setValueUserUpdate] = useState('');
  const [usersUpdate, setUsersUpdate] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [isApprovedUpdate, setIsApprovedUpdate] = useState<ApprovedProps>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAssigningRoles, setIsAssigningRoles] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      type: '',
      isActive: false,
      orderDate: new Date(),
      endDate: new Date(),
      status: '',
    },
  });

  const getUsers = async (searchValue: string) => {
    setLoadingUpdate(true);
    try {
      const res = await getUsersByEmail(searchValue);
      setUsersUpdate(res.data || []);
    } catch (error) {
      // console.error('Error al obtener usuarios:', error);
      setUsersUpdate([]);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    setValueUserUpdate(searchValue);
    if (searchValue) {
      setTimeout(() => {
        getUsers(searchValue);
      }, 500);
    }
  };

  const selectedSubs = watch('type');
  // console.log('selectedSubs', selectedSubs);

  const rolId = getRoleIdForSubscription(selectedSubs);
  const rolIdExpired = getRoleIdForExpiredSuscriptions(selectedSubs);
  const [completedCourses, setCompletedCourses] = useState<number>(0);
  const userId = selectedUser?._id.toString();

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await fetch('/api/discord/completed-courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        // console.log('cantidad de cursos completados', data);

        setCompletedCourses(data.count);
      } catch (error) {
        console.error('Error fetching completed courses:', error);
      }
    };

    fetchCompleted();
  }, [selectedUser?._id.toString()]);

  const continueSubmit = async (data: any) => {
    // capturo si es active o cancelled del useform
    const selectedStatus = data.status;
    console.log('selectedStatus:', selectedStatus);

    setIsAssigningRoles(true);

    if (!selectedUser) return;

    try {
      const response = await fetch(
        `/api/admin/update-user-subscription/${selectedUser?._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        console.log('ejecucion');
        throw new Error(`Error en update-user-subscription: ${response.statusText}`);
      }

      const res = await response.json();
      console.log('res await', res);
      setIsApprovedUpdate(res);

      // Fecha actual
      const now = new Date();
      console.log('now', now);

      // Clonamos la fecha para no modificar la original
      const vencimiento = new Date(now);

      // Calculamos la duración según el tipo de suscripción
      if (selectedSubs.includes('mensual')) {
        vencimiento.setMonth(vencimiento.getMonth() + 1);
      } else if (selectedSubs.includes('semestral')) {
        vencimiento.setMonth(vencimiento.getMonth() + 6);
      } else if (selectedSubs.includes('anual')) {
        vencimiento.setFullYear(vencimiento.getFullYear() + 1);
      }

      const resPost = await fetch('/api/discord/rol-schema-subs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser._id.toString(),
          sub: {
            type: selectedSubs,
            rol: {
              id: rolId,
              status: 'claimed',
              orderDate: now.toISOString(),
              rolNumber: selectedSubs.includes('Suscripcion basic')
                ? completedCourses < 3
                  ? 1
                  : 2
                : 0,
            },
            rolVencido: {
              id: rolIdExpired,
              status: 'notClaimed',
              orderDate: vencimiento.toISOString(),
            },
          },
        }),
      });

      if (!resPost.ok && resPost.status !== 409) {
        console.log('ejecucion');
        throw new Error(`Error en POST rol-schema-subs: ${resPost.status}`);
      }

      console.log('resPost', resPost);

      if (resPost.status === 409) {
        const bodySubRolDiscord = {
          userId: selectedUser._id.toString(),
          sub: {
            type: selectedSubs,
            rol: {
              id: rolId,
              orderDate: now.toISOString(),
              rolNumber: selectedSubs.includes('Suscripcion basic')
                ? completedCourses < 3
                  ? 1
                  : 2
                : 0,
            },
            rolVencido: {
              id: rolIdExpired,
              status: 'notClaimed',
              orderDate: vencimiento.toISOString(),
            },
          },
          subStatus: selectedStatus,
        };

        const resPut = await fetch('/api/discord/rol-schema-subs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodySubRolDiscord),
        });

        if (!resPut.ok) {
          console.log('ejecucion');
          throw new Error(`Error en PUT rol-schema-subs: ${resPut.status}`);
        }

        const dataPut = await resPut.json();
        console.log('res put front', dataPut);
      }

      // 🔔 Muestra un mensaje basado en el estado de suscripción
      switch (data.status) {
        case 'active':
          toast.message('', {
            description: (
              <ul className="list-disc text-left ml-3">
                <li>Suscripción del usuario activada. ✅</li>
                <li className={res.discordError ? 'text-red-500 font-bold' : ''}>
                  {!res.discordError
                    ? 'Si el usuario no se encuentra en el servidor, se activará el recordatorio de Discord. ✅'
                    : 'Error al remover roles en Discord. ❌'}
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
          break;
        case 'cancelled':
          toast.message('', {
            description: (
              <ul className="list-disc text-left ml-3">
                <li>Suscripción del usuario cancelada. ✅</li>
                <li className={res.discordError ? 'text-red-500 font-bold' : ''}>
                  {!res.discordError
                    ? 'Roles de Discord removidos exitosamente. ✅'
                    : 'Error al remover roles en Discord. ❌'}
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
          break;
        case 'expired':
          toast.message('', {
            description: (
              <ul className="list-disc text-left ml-3">
                <li>Suscripción expirada. ✅</li>
                <li className={res.discordError ? 'text-red-500 font-bold' : ''}>
                  {!res.discordError
                    ? 'Roles de Discord removidos exitosamente. ✅'
                    : 'Error al remover roles en Discord. ❌'}
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
          break;
        case 'unpaid':
          toast.message('', {
            description: (
              <ul className="list-disc text-left ml-3">
                <li>Suscripción actualizada a no pagada. ✅</li>
                <li className={res.discordError ? 'text-red-500 font-bold' : ''}>
                  {!res.discordError
                    ? 'Roles de Discord removidos exitosamente. ✅'
                    : 'Error al remover roles en Discord. ❌'}
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
          break;
        default:
          toast.success('Suscripción actualizada.');
      }
    } catch (error) {
      console.error('Error al actualizar suscripción:', error);
    } finally {
      setIsAssigningRoles(false);
      setIsSubmitting(false);
    }
  };

    function handleConfirm() {
      setModalOpen(false);
      // Continúa con la ejecución usando los datos guardados
      if (pendingData) {
        continueSubmit(pendingData);
        setPendingData(null);
      }
    }

    function handleCancel() {
      setModalOpen(false);
      setPendingData(null);
      setIsSubmitting(false);
      // Refresca la página
      window.location.reload();
    }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    if (!selectedUser?.discordId) {
      setPendingData(data); // Guardamos los datos para usar después
      setModalOpen(true);
      return; // Pausamos la ejecución aquí
    }

    // Si tiene discordId, continúa normalmente
    await continueSubmit(data);
  };

  // console.log(selectedUser, 'selectedUser');

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      if (!selectedUser) return;

      try {
        const res = await fetch(`/api/admin/user-subscription-status/${selectedUser._id}`);
        const data = await res.json();
        setIsApprovedUpdate(data); // Supongamos que esto incluye `status`
      } catch (error) {
        console.error('Error al obtener suscripción actual:', error);
      }
    };

    fetchCurrentSubscription();
  }, [selectedUser]);

  return (
    <div className="w-full flex flex-col justify-center ">
      <Card className="x-5mx-auto py-7 px-5 md:px-20 shadow-lg">
        <p className="mb-2 dark:text-white text-black">
          Busca un usuario para actualizar su suscripción
        </p>
        <Popover open={openUser} onOpenChange={setOpenUser}>
          <PopoverTrigger asChild>
            <div className="dark:text-white text-black">
              <Button variant="outline" role="combobox" aria-expanded={openUser}>
                {valueUserUpdate
                  ? usersUpdate.find(u => u.email === valueUserUpdate)?.email || 'Sin resultados'
                  : 'Selecciona un usuario...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>

          <PopoverContent className="p-0 w-full ">
            <Command>
              <CommandInput
                placeholder="Buscar por email..."
                value={valueUserUpdate}
                onValueChange={handleSearchChange}
              />
              <CommandList>
                {loadingUpdate ? (
                  <div className="p-4 text-center">Buscando...</div>
                ) : (
                  <>
                    <CommandEmpty>No hay resultados.</CommandEmpty>
                    <CommandGroup>
                      {usersUpdate.map(u => (
                        <CommandItem
                          key={u._id.toString()}
                          value={u.email}
                          onSelect={currentValue => {
                            const selected = usersUpdate.find(user => user.email === currentValue);
                            setSelectedUser(selected ?? null);
                            setValueUserUpdate(currentValue);
                            reset({
                              type: selected?.suscription?.type || '',
                              isActive: selected?.suscription?.isActive || false,
                              orderDate: new Date(selected?.suscription?.orderDate || new Date()),
                              endDate: new Date(selected?.suscription?.endDate || new Date()),
                              status: selected?.suscription?.status || '',
                            });
                            setOpenUser(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              valueUserUpdate === u.email ? 'opacity-100' : 'opacity-0'
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

        {selectedUser && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 dark:text-white text-black">
            <Separator className="bg-gray-200 mb-8" />
            <h2 className="font-semibold mb-10 text-black bg-gray-200 p-2 rounded uppercase">
              Editar suscripción de {selectedUser.username}
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="block mb-2 text-left">Tipo de suscripción</Label>
                <Controller
                  name="type"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 border rounded"
                      onChange={e => field.onChange(e.target.value)} // Maneja el cambio de selección
                    >
                      <option value="">Selecciona un tipo de suscripción</option>
                      {subscriptions?.map(s => (
                        <option key={s._id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div className="py-6 pl-4 bg-gray-800 rounded-lg">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white text-black"
                      >
                        ¿Suscripción activa?
                      </label>
                    </div>
                  )}
                />
              </div>
              <div className="flex gap-6">
                <div>
                  <label className="block mb-1">Fecha de inicio</label>
                  <p className="text-sm dark:text-gray-400">
                    (
                    {selectedUser?.suscription?.orderDate
                      ? moment(selectedUser?.suscription?.orderDate).format('MMMM DD, YYYY')
                      : 'sin fecha'}
                    )
                  </p>
                  <Controller
                    name="orderDate"
                    control={control}
                    render={({ field }) => (
                      <CalendarComponent
                        selected={field.value}
                        onSelect={date => {
                          console.log('Seleccionaste:', date);
                          field.onChange(date);
                        }}
                        mode="single"
                        initialFocus
                        defaultMonth={field.value ?? undefined}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block mb-1">Fecha de finalización</label>
                  <p className="text-sm dark:text-gray-400">
                    (
                    {selectedUser?.suscription?.endDate
                      ? moment(selectedUser?.suscription?.endDate).format('MMMM DD, YYYY')
                      : 'sin fecha'}
                    )
                  </p>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <CalendarComponent
                        selected={field.value}
                        onSelect={date => field.onChange(date)}
                        mode="single"
                        initialFocus
                        defaultMonth={field.value ?? undefined}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <Label className="block mb-2 text-left">Estado de la suscripción</Label>
                <Controller
                  name="status"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Debes seleccionar un estado de suscripción' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      aria-placeholder="asass"
                      className="w-full p-2 border rounded"
                      onChange={e => field.onChange(e.target.value)} // Maneja el cambio de selección
                    >
                      <option value="">Selecciona el estado de la suscripción</option>
                      {status?.map(s => (
                        <option key={s._id} value={s.name}>
                          {s.placeholder}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

            <Button disabled={isSubmitting} type="submit" className="mt-6">
              {isAssigningRoles ? 'Asignando roles...' : 'Guardar cambios'}
            </Button>
          </form>
        )}

        {isApprovedUpdate && (
          <Alert
            className={`mt-4 border ${isApprovedUpdate.success ? 'border-green-500' : 'border-red-500'
              }`}
          >
            <AlertTitle className={isApprovedUpdate.success ? 'text-green-500' : 'text-red-500'}>
              {isApprovedUpdate.success ? 'Actualizado' : 'Algo falló'}
            </AlertTitle>
            <AlertDescription>{isApprovedUpdate.message}</AlertDescription>
          </Alert>
        )}
      </Card>
      <Toaster />
      <ConfirmModal open={modalOpen} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
};
