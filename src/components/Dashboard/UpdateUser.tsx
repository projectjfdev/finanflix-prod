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
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import { Input } from '../ui/input';

interface IEnrolledCourses {
  _id: Types.ObjectId;
  title: string;
}

interface UserProps {
  _id: Types.ObjectId;
  discordId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  tel: string;
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

export const UpdateUser = () => {
  const [openUser, setOpenUser] = useState(false);
  const [valueUserUpdate, setValueUserUpdate] = useState('');
  const [usersUpdate, setUsersUpdate] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [isApprovedUpdate, setIsApprovedUpdate] = useState<ApprovedProps>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      discordId: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      tel: '',
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

  // const selectedSubs = watch('type');
  const userId = selectedUser?._id.toString();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    if (!selectedUser) return;
    try {
      const response = await fetch(`/api/admin/update-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      setIsApprovedUpdate(res);
      if (res.success) {
        toast.message('', {
          description: (
            <ul className="list-disc text-left ml-3">
              <li>Usuario actualizado ✅</li>
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
      }
    } catch (error) {
      // console.error('Error al actualizar el usuario:', error);
      alert('Hubo un error al actualizar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center ">
      <Card className="x-5mx-auto py-7 px-5 md:px-20 shadow-lg">
        <p className="mb-2 dark:text-white text-black">Busca un usuario y actualizalo</p>
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
                              discordId: selected?.discordId || '',
                              username: selected?.username || '',
                              firstName: selected?.firstName || '',
                              lastName: selected?.lastName || '',
                              email: selected?.email || '',
                              tel: selected?.tel || '',
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
            <h2 className="font-semibold mb-10 text-secondary bg-gray-200 p-2 rounded">
              Editar usuario: {selectedUser.username}
            </h2>

            <div className="space-y-10">
              <div>
                <div>
                  <Label className="block mb-2 text-left">Email</Label>
                </div>
                <Input
                  className="rounded-lg dark:bg-background bg-background border "
                  type="text"
                  {...register('email')}
                  placeholder="email"
                />
                {errors?.email?.message && (
                  <span className="text-red-600 mb-4">{errors?.email?.message}</span>
                )}
              </div>
              <div>
                <div>
                  <Label className="block mb-2 text-left">Nombre de usuario</Label>
                </div>
                <Input
                  className="rounded-lg dark:bg-background bg-background border "
                  type="text"
                  {...register('username')}
                  placeholder="username"
                />
                {errors?.username?.message && (
                  <span className="text-red-600 mb-4">{errors?.username?.message}</span>
                )}
              </div>
              <div>
                <div>
                  <Label className="block mb-2 text-left">Nombre</Label>
                </div>
                <Input
                  className="rounded-lg dark:bg-background bg-background border "
                  type="text"
                  {...register('firstName')}
                  placeholder="Nombre"
                />
                {errors?.firstName?.message && (
                  <span className="text-red-600 mb-4">{errors?.firstName?.message}</span>
                )}
              </div>
              <div>
                <div>
                  <Label className="block mb-2 text-left">Apellido</Label>
                </div>
                <Input
                  className="rounded-lg dark:bg-background bg-background border "
                  type="text"
                  {...register('lastName')}
                  placeholder="Apellido"
                />
                {errors?.lastName?.message && (
                  <span className="text-red-600 mb-4">{errors?.lastName?.message}</span>
                )}
              </div>
              <div>
                <div>
                  <Label className="block mb-2 text-left">ID de Discord</Label>
                </div>
                <Input
                  className="rounded-lg dark:bg-background bg-background border "
                  type="text"
                  {...register('discordId')}
                  placeholder="ID de Discord"
                />
                {errors?.lastName?.message && (
                  <span className="text-red-600 mb-4">{errors?.discordId?.message}</span>
                )}
              </div>
              <div>
                <div>
                  <Label className="block mb-2 text-left">Teléfono</Label>
                </div>
                <Input
                  className="rounded-lg dark:bg-background bg-background border "
                  type="text"
                  {...register('tel')}
                  placeholder="Teléfono"
                />
                {errors?.lastName?.message && (
                  <span className="text-red-600 mb-4">{errors?.tel?.message}</span>
                )}
              </div>
            </div>

            <Button disabled={isSubmitting} type="submit" className="mt-6">
              {isSubmitting ? 'Actualizando...' : 'Guardar cambios'}
            </Button>
          </form>
        )}

        {isApprovedUpdate && (
          <Alert
            className={`mt-4 border ${
              isApprovedUpdate.success ? 'border-green-500' : 'border-red-500'
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
    </div>
  );
};
