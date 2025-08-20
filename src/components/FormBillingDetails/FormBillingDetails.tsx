'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from '@/components/Inputs/InputText';
import { useSession } from 'next-auth/react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { SuccessModal } from '../SuccessModal/SuccesModal';
import countries from '@/utils/DataJson/countries.json';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';

interface FormBillingDetailsProps {
  subscriptionName?: string;
  redirectProp: any;
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
}

interface ApprovedProps {
  message: string;
  success: boolean;
}

export const FormBillingDetails: React.FC<FormBillingDetailsProps> = ({
  subscriptionName,
  redirectProp,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm<BillingDetails>();
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [isApprovedBillingDetails, setIsApprovedBillingDetails] = useState<ApprovedProps>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/users/billing-details', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setBillingDetails(data.data);
          // Populate the form with existing data
          setValue('firstName', data.data.firstName);
          setValue('lastName', data.data.lastName);
          setValue('email', data.data.email);
          setValue('phone.countryCode', data.data.phone?.countryCode || '');
          setValue('phone.number', data.data.phone?.number || '');
          setValue('country', data.data.country);
          setValue('address', data.data.address);
          setValue('postalCode', data.data.postalCode);
          setValue('dni', data.data.dni);
        }
      })
      .catch(error => console.error('Error fetching billing details:', error));
    // .finally(() => setIsLoading(false));
  }, [setValue]);

  const onSubmit = async (data: BillingDetails) => {
    const method = billingDetails ? 'PUT' : 'POST';

    const newData = {
      ...data,
      userId: session?.user._id.toString(),
    };

    try {
      const response = await fetch('/api/users/billing-details', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });

      const result = await response.json();

      setIsApprovedBillingDetails(result);

      // setShowSuccessModal(true);

      toast.success('', {
        description: (
          <p>
            Tu información ha sido registrada con éxito. Procede al siguiente paso para completar tu
            compra de forma segura. ✅{' '}
          </p>
        ),
        duration: 5000,
      });

      setTimeout(() => {
        window.location.href = redirectProp;
      }, 5000);

      if (result.success) {
        setBillingDetails(result.data);
      }
    } catch (error) {
      // console.error('Error saving billing details:', error);
      alert('Ocurrió un error al procesar la solicitud.');
    }
  };

  const selectedCountryCode = watch('phone.countryCode');

  const isMonthly = subscriptionName === 'Mensual';

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName" className='text-xs sm:text-sm'>
              Nombre<span className="text-red-600"> *</span>
            </Label>
            <Input
              type="text"
              placeholder="Satoshi "
              className="w-5/6 dark:bg-background bg-background border text-xs sm:text-sm"
              // className="w-5/6 dark:bg-background bg-background rounded-md border"
              {...register('firstName', {
                required: 'Ingrese su nombre',
              })}
              name="firstName"
            />
            {/* <InputText
              type="text"
              errors={errors?.firstName?.message}
              placeholder="Satoshi "
              className="w-5/6 dark:bg-background bg-background rounded-md border"
              // className="w-5/6 dark:bg-background bg-background rounded-md border"
              register={register('firstName', {
                required: 'Ingrese su nombre',
              })}
              name="firstName"
            /> */}
            {errors?.firstName?.message && <span className="text-red-600 mb-4">{errors?.firstName?.message}</span>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName" className='text-xs sm:text-sm'>
              Apellido<span className="text-red-600"> *</span>
            </Label>
            <Input
              type="text"
              placeholder="Nakamoto"
              className="w-5/6 dark:bg-background bg-background border text-xs sm:text-sm"
              {...register('lastName', {
                required: 'Ingrese su apellido',
              })}
              name="lastName"
            />
            {errors?.lastName?.message && <span className="text-red-600 mb-4">{errors?.lastName?.message}</span>}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className='text-xs sm:text-sm'>
            Correo Electrónico<span className="text-red-600 "> *</span>
            <span className="text-xs dark:text-[#A7A7A7] text-red-900 italic ">
              (Recuerda proporcionar un correo electrónico válido, ya que los datos necesarios para
              finalizar tu compra serán enviados a esta dirección.)
            </span>{' '}
          </Label>

          <Input
            className=" dark:bg-background bg-background border text-xs sm:text-sm"
            type="email"
            {...register('email', {
              required: 'Email Address is required',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'El email es obligatorio',
              },
            })}
            name="email"
            placeholder="satoshi-bitcoin@gmail.com"
          />
          {errors?.email?.message && <span className="text-red-600 mb-4">{errors?.email?.message}</span>}
        </div>
        <div>
          <Label className="block mb-2 text-left text-xs sm:text-sm">País</Label>
          <Controller
            name="phone.countryCode"
            control={control}
            defaultValue=""
            rules={{ required: 'Debes seleccionar un estado de suscripción' }}
            render={({ field }) => (
              <select
                {...field}
                aria-placeholder="asass"
                className="w-full dark:bg-background bg-background rounded-xl focus:border-none focus:ring-0 border p-1 text-xs sm:text-sm"
                onChange={e => field.onChange(e.target.value)} // Maneja el cambio de selección
              >
                <option value="">Selecciona el país</option>
                {countries?.countries?.map(s => (
                  <option key={s.id} value={s.phoneCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone.number" className='text-xs sm:text-sm'>
            Teléfono<span className="text-red-600"> *</span>
          </Label>
          <div className="flex items-center gap-4">
            <Input
              className="rounded-xl dark:bg-background bg-background border max-w-full w-[80px] text-xs sm:text-sm"
              type="text"
              defaultValue={selectedCountryCode || billingDetails?.phone?.countryCode}
              readOnly
            />

            <Input
              className="rounded-xl dark:bg-background bg-background border text-xs sm:text-sm"
              type="text"
              {...register('phone.number', {
                required: 'Este campo es obligatorio',
              })}
              placeholder="Número"
            />
            {errors?.phone?.number?.message && <span className="text-red-600 mb-4">{errors?.phone?.number?.message}</span>}
          </div>
        </div>

        {!isMonthly && (
          <>
            <div className="space-y-1">
              <Label htmlFor="country">País</Label>
              <InputText
                className="rounded-lg dark:bg-background bg-background  border "
                type="text"
                errors={errors?.country?.message}
                name="country"
                register={register('country')}
                placeholder="País"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="address">Dirección</Label>
              <InputText
                className="rounded-lg dark:bg-background bg-background  border "
                type="text"
                errors={errors?.address?.message}
                name="address"
                register={register('address')}
                placeholder="Dirección"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="postalCode">Código postal</Label>
              <InputText
                className="rounded-lg dark:bg-background bg-background  border "
                type="text"
                errors={errors?.postalCode?.message}
                name="postalCode"
                register={register('postalCode')}
                placeholder="Código postal"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="dni">DNI</Label>
              <InputText
                className="rounded-lg dark:bg-background bg-background  border "
                type="text"
                errors={errors?.dni?.message}
                name="dni"
                register={register('dni')}
                placeholder="DNI"
              />
            </div>
          </>
        )}
        <Button
          size={'xl'}
          type="submit"

          className="w-full md:text-xl py-3 text-xs sm:text-sm rounded-md "
        >
          SIGUIENTE
        </Button>
      </form>
      {/* {showSuccessModal && isApprovedBillingDetails && (
        <SuccessModal
          success={isApprovedBillingDetails.success}
          text={isApprovedBillingDetails.message}
          onClose={() => {
            setShowSuccessModal(false);
            window.location.href = redirectProp;
          }}
        />
      )} */}

      <div className="flex justify-center items-center gap-10 pt-5">
        <div>
          <Image
            src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703240/visa_oufbsm.png"
            alt="Finanflix Logo"
            width={110}
            height={110}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div>
          <Image
            src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703238/master_hstr64.png"
            alt="Finanflix Logo"
            width={110}
            height={110}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div>
          <Image
            src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703239/paypal_dzuq2n.png"
            alt="Finanflix Logo"
            width={110}
            height={110}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div>
          <Image
            src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703237/american_bjtihh.png"
            alt="Finanflix Logo"
            width={110}
            height={110}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
};
