'use client';

import React, { useEffect, useState } from 'react';
import { InputText } from '../Inputs/InputText';
import { useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

import { CheckCircle } from 'lucide-react';
import { getExchangeRate, updateExchangeRate } from '@/utils/Endpoints/adminEndpoints';
import { IExchangeRate } from '@/interfaces/exchangeRate';
import { useIntervalClick } from '@/hooks/useIntervalClick';
import { Button } from '../ui/button';
import { Loading } from '@/utils/Loading/Loading';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { toast } from 'sonner';
import moment from 'moment';

interface ApprovedProps {
  message: string;
  success: null | boolean;
}

export const ExchangeRateInput = () => {
  const [loading, setloading] = useState(false);
  const [rate, setRate] = useState<IExchangeRate>();
  const { isResendDisabled, setIsResendDisabled, setTimer, timer } = useIntervalClick();
  const [isApproved, setIsApproved] = useState<ApprovedProps>();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getER = async () => {
    try {
      const res = await getExchangeRate();
      setRate(res.data);
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
    }
  };

  const onSubmit = async (data: Record<string, any>) => {
    try {
      setloading(true);
      const resp = await updateExchangeRate(data);
      setIsApproved(resp);
      if (resp.success) {
        setIsResendDisabled(true);
        setTimer(10);
        toast("Tipo de cambio actualizado!'", {
          description: 'Se ha establecido un nuevo valor de Dolar Finanflix.',
          icon: <CheckCircle className="text-green-500" />,
          duration: 5000,
        });
        await getER();
      }
      setloading(false);
    } catch (error) {
      console.error('Error al intentar actualizar el tipo de cambio:', error);
    }
  };

  useEffect(() => {
    getER();
  }, []);

  return (
    <div>
      <p className="text-xs dark:text-[#A7A7A7] text-[#A7A7A7]">
        Ej: (1 USD = {rate?.rate || 'No disponible'} )
      </p>
      <div className="flex items-center justify-between dark:bg-card bg-white  p-3 rounded-md border dark:border-gray-800   border-gray-300  mt-3 mb-3">
        <span className="text-sm dark:text-[#A7A7A7] text-[#A7A7A7]  ">Tipo de cambio actual:</span>
        <span className="text-lg font-medium  dark:text-[#A7A7A7] text-black">
          {rate?.rate || 'No disponible'}{' '}
          <span className="text-xs dark:text-[#A7A7A7] text-[#A7A7A7] ">ARS</span>
        </span>
      </div>
      <p className="text-gray-500 text-sm">
        Última actualización: {moment(rate?.updatedAt).format('MMMM DD, YYYY [a las] HH:mm')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
        <Label htmlFor="rate">
          Actualizar tipo de cambio (Poner el valor del dolar en Pesos Argentinos)
        </Label>
        <div className="flex flex-col sm:flex-row gap-2 pb-5 pt-3">
          <Input
            id="rate"
            placeholder={`${rate?.rate + ' ARS' || 'No disponible'}`}
            className="dark:bg-card bg-background max-w-max"
            type="number"
            {...register('rate')}
          />
          {isResendDisabled ? (
            <Button className="text-white dark:hover:bg-secondary" disabled={isResendDisabled}>
              Espera {timer} segundos para volver a actualizar
            </Button>
          ) : loading ? (
            <Button type="button" className="text-white dark:hover:bg-secondary" disabled>
              <Loading size="20px" color="white" />
              <span className="mr-2" />
              Actualizando...
            </Button>
          ) : (
            <Button className="text-white dark:hover:bg-secondary">Actualizar</Button>
          )}
        </div>

        {isApproved && (
          <Alert
            className={`mt-4 border ${isApproved.success ? 'border-green-500' : 'border-red-500'}`}
          >
            <AlertTitle className={isApproved.success ? 'text-green-500' : 'text-red-500'}>
              {isApproved.success ? 'Actualizado' : 'Algo falló'}
            </AlertTitle>
            <AlertDescription>{isApproved.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
};
