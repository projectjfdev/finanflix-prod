'use client';

import { InputText } from '@/components/Inputs/InputText';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getUsersByEmail } from '@/utils/Endpoints/adminEndpoints';
import { createOrder, createSuscriptionOrder } from '@/utils/Endpoints/orderEndpoints';
import { Types } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import suscriptions from '@/utils/DataJson/suscriptions.json';
import { CardSuccessfulCreation } from '@/components/CardSuccessfulCreation/CardSuccessfulCreation';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BigTitle from '@/components/BigTitle/BigTitle';
import MediumTitle from '@/components/MediumTitle/MediumTitle';

interface UserProps {
  _id: Types.ObjectId;
  email: string;
  username: string;
}

interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    countryCode: string;
    number: string;
  };
  country: string;
  address: string;
  postalCode: string;
  dni: string;
  price: string;
  currency: string;
  username: string;
  orderTitle: string;
}

interface PropsOrderMessage {
  message: string;
  success: null | boolean;
}

export default function CrearOrdenDeSuscripcionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [valueUser, setValueUser] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState(false);
  const userId = valueUser.split('-.-')[1];
  const [orderType, setOrderType] = useState('');
  const [orderMessage, setOrderMessage] = useState<PropsOrderMessage>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<BillingDetails>();

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

  const onSubmit = async (data: any) => {
    if (!orderType) {
      alert('Selecciona el tipo de orden');
      return;
    }
    setIsLoading(true);
    const newData = {
      status: 'Pagado',
      paymentMethod: 'By Admin',
      termsAndConditions: true,
      userId: userId,
    };

    if (orderType === 'course') {
      const newOrder = await createOrder({ ...data, ...newData });
      // console.log(newOrder, 'newOrder');
      // console.log({ data, ...newData });
      setOrderMessage(newOrder);
      if (newOrder?.success) {
        setIsApproved(true);
        setIsLoading(false);
      }
    } else if (orderType === 'subscription') {
      const newOrder = await createSuscriptionOrder({ ...data, ...newData });
      // console.log(newOrder, 'newOrder');
      // console.log({ data, ...newData });
      setOrderMessage(newOrder);
      if (newOrder?.success) {
        setIsApproved(true);
        setIsLoading(false);
      }
    }

    setIsLoading(false);
  };

  const handleChangeOrderType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setOrderType(selectedValue);
    if (selectedValue === 'subscription') {
      setOrderType('subscription');
    } else if (selectedValue === 'course') {
      setOrderType('course');
    }
  };
  console.log(orderType);

  return (
    <div className="w-full ml-4 md:ml-8">
      <Card className="dark:bg-background  bg-white rounded-xl  dark:text-white text-black shadow-md px-5 py-3 mt-3 space-y-3">
        <MediumTitle title="Selecciona el tipo de orden" className="text-xl" />
        <select
          className="w-full md:w-5/6 p-2 border rounded-2xl dark:bg-card bg-background text-xs md:text-base"
          onChange={handleChangeOrderType}
          value={orderType}
        >
          <option className="text-xs md:text-base  " value="">
            Selecciona el tipo de orden
          </option>
          <option value="subscription">
            <Check
              className={cn(
                'mr-2 h-4 w-4',
                orderType === 'subscription' ? 'opacity-100' : 'opacity-0'
              )}
            />
            Crear orden de suscripcion
          </option>
          <option value={'course'}>
            <Check
              className={cn('mr-2 h-4 w-4', orderType === 'course' ? 'opacity-100' : 'opacity-0')}
            />
            Crear orden de compra de curso
          </option>
        </select>
      </Card>
      <Card className="dark:bg-background border-none bg-white rounded-xl shadow-xl dark:text-white text-black">
        {!isApproved ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 gap-3 border border-solid border-gray-[500] shadow-md px-5 py-3 mt-3 rounded-2xl w-full"
          >
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="w-full ">
                <div className="w-full flex  flex-col justify-start">
                  <div className="pt-2 pb-3">
                    <MediumTitle title="Asignar orden de compra a un usuario" className="text-xl" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between dark:bg-card bg-background"
                  >
                    {valueUser
                      ? users.find(u => u.email + '-.-' + u._id.toString() === valueUser)?.email ||
                        'Sin resultados'
                      : 'Selecciona un usuario...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="bottom" align="start">
                <Command className="w-full text-start">
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
                          {users.length > 0 &&
                            users.map(u => (
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

            {orderType === 'subscription' && (
              <div className="space-y-2 w-full md:w-5/6">
                <Label className="block mb-2 text-left">Tipo de suscripción</Label>
                <Controller
                  name="orderTitle"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 border rounded-2xl dark:bg-card bg-background text-xs md:text-base "
                      onChange={e => field.onChange(e.target.value)} // Maneja el cambio de selección
                    >
                      <option className="text-xs md:text-base" value="">
                        Selecciona un tipo de suscripción
                      </option>

                      {suscriptions.suscriptionsOptions.map(u => (
                        <option key={u.id.toString()} value={u.title}>
                          <Check
                            className={cn('mr-2 h-4 w-4', valueUser ? 'opacity-100' : 'opacity-0')}
                          />
                          {u.title}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}
            {orderType === 'course' && (
              <div className="w-full md:w-5/6 space-y-2">
                <Label htmlFor="orderTitle">
                  Nombre del curso <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Nombre del curso"
                  className=" dark:bg-card bg-background rounded-lg"
                  {...register('orderTitle')}
                />
                {errors?.orderTitle?.message && (
                  <span className="text-red-600 mb-4">{errors?.orderTitle?.message}</span>
                )}
              </div>
            )}

            <div className="space-y-2 mt-4 w-full md:w-5/6">
              <Label htmlFor="orderTitle">
                Divisa <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="currency"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border rounded-2xl dark:bg-card bg-background text-xs md:text-base"
                    onChange={e => field.onChange(e.target.value)} // Maneja el cambio de selección
                  >
                    <option className="dark:text-gray-600" value="">
                      Selecciona una divisa
                    </option>

                    <option value="USD">USD</option>
                    <option value="AR">AR</option>
                  </select>
                )}
              />
            </div>

            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="price">
                Precio <span className="text-red-600">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Precio de la suscripción"
                className=" dark:bg-card bg-background rounded-lg"
                {...register('price')}
              />
              {errors?.price?.message && (
                <span className="text-red-600 mb-4">{errors?.price?.message}</span>
              )}
            </div>

            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="firstName">
                Nombre <span className="text-red-600">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Nombre"
                className=" dark:bg-card bg-background rounded-lg"
                {...register('firstName')}
              />
              {errors?.firstName?.message && (
                <span className="text-red-600 mb-4">{errors?.firstName?.message}</span>
              )}
            </div>
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="lastName">
                Apellido <span className="text-red-600">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Apellido"
                className=" dark:bg-card bg-background rounded-lg"
                {...register('lastName')}
                name="lastName"
              />
              {errors?.lastName?.message && (
                <span className="text-red-600 mb-4">{errors?.lastName?.message}</span>
              )}
            </div>
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="lastName">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input
                className=" border-none dark:bg-card bg-background dark:text-white text-black"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: 'El email no es válido',
                  },
                })}
                placeholder="Correo electrónico"
              />
              {errors?.email?.message && (
                <span className="text-red-600 mb-4">{errors?.email?.message}</span>
              )}
            </div>
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="phone.countryCode">
                Prefijo del país<span className="text-red-600"> *</span>
              </Label>
              <Input
                className="rounded-lg dark:bg-card bg-background border "
                type="text"
                {...register('phone.countryCode')}
                placeholder="+54"
              />
              {errors?.phone?.countryCode?.message && (
                <span className="text-red-600 mb-4">{errors?.phone?.countryCode?.message}</span>
              )}
            </div>
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="phone.number">
                Teléfono<span className="text-red-600"> *</span>
              </Label>
              <Input
                className="rounded-lg dark:bg-card bg-background border "
                type="text"
                {...register('phone.number')}
                placeholder="Número"
              />
              {errors?.phone?.number?.message && (
                <span className="text-red-600 mb-4">{errors?.phone?.number?.message}</span>
              )}
            </div>
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                className="rounded-lg dark:bg-card bg-background border"
                type="text"
                {...register('country')}
                placeholder="País"
              />
              {errors?.country?.message && (
                <span className="text-red-600 mb-4">{errors?.country?.message}</span>
              )}
            </div>
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                className="rounded-lg dark:bg-card bg-background border"
                type="text"
                {...register('address')}
                placeholder="Dirección"
              />
              {errors?.address?.message && (
                <span className="text-red-600 mb-4">{errors?.address?.message}</span>
              )}
            </div>
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="postalCode">Código postal</Label>
              <Input
                className="rounded-lg dark:bg-card bg-background  border "
                type="text"
                {...register('postalCode')}
                placeholder="Código postal"
              />
              {errors?.postalCode?.message && (
                <span className="text-red-600 mb-4">{errors?.postalCode?.message}</span>
              )}
            </div>
            {/* ASI SI */}
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                className="rounded-lg dark:bg-card bg-background border"
                type="text"
                {...register('dni')}
                placeholder="DNI"
              />
              {errors?.dni?.message && (
                <span className="text-red-600 mb-4">{errors?.dni?.message}</span>
              )}
            </div>
            {/* ASI NO */}
            <div className="w-full md:w-5/6 space-y-2">
              <Label htmlFor="username">Username en la web</Label>
              <Input
                className="rounded-lg dark:bg-card bg-background border"
                type="text"
                {...register('username')}
                placeholder="Username"
              />
              {errors?.username?.message && (
                <span className="text-red-600 mb-4">{errors?.username?.message}</span>
              )}
            </div>

            <div className="w-full md:w-1/2 lg:w-2/6 pb-5">
              {!isLoading ? (
                <Button type="submit" className="text-white w-full font-semibold">
                  Crear orden de suscripción
                </Button>
              ) : (
                <Button disabled className="text-white w-full">
                  Creando...
                </Button>
              )}
            </div>
          </form>
        ) : (
          <CardSuccessfulCreation
            title="¡Orden de suscripción creada!"
            text="Tu orden ya se encuentra creada. ¿Qué te
            gustaría hacer ahora?"
            textRedirectBtn="Regresar al dashboard"
            redirectNew="/dashboard/crear-orden-de-suscripcion"
            redirectSeeAll="/dashboard"
          />
        )}
      </Card>
      {orderMessage && (
        <Alert
          className={`mt-4 border ${orderMessage.success ? 'border-green-500' : 'border-red-500'}`}
        >
          {/* <RocketIcon className="h-4 w-4" /> */}
          <AlertTitle className={orderMessage.success ? 'text-green-500' : 'text-red-500'}>
            {orderMessage.success ? 'Creado' : 'Algo falló'}
          </AlertTitle>
          <AlertDescription>{orderMessage.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
