import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useIntervalClick } from '@/hooks/useIntervalClick';
import { Controller, useForm } from 'react-hook-form';
import { handleRevalidatePath } from '@/utils/Endpoints/adminEndpoints';
import { Loading } from '@/utils/Loading/Loading';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';

interface ApprovedProps {
  message: string;
  success: null | boolean;
}

export const ClearCache = () => {
  const [loading, setloading] = useState(false);

  const { isResendDisabled, setIsResendDisabled, setTimer, timer } = useIntervalClick();
  const [isApproved, setIsApproved] = useState<ApprovedProps>();
  const { handleSubmit, control } = useForm();

  const onSubmit = async (data: Record<string, any>) => {
    try {
      setloading(true);
      const resp = await handleRevalidatePath(data);
      setIsApproved(resp);
      // console.log(resp);

      if (resp.success) {
        setIsResendDisabled(true);
        setTimer(10);
      }
      setloading(false);
    } catch (error) {
      console.error('Error al intentar borrar caché:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
        <p className="text-gray-500">
          Selecciona los campos en los que deseas realizar una limpieza de caché
        </p>
        <div className="my-2">
          <div>
            <Controller
              name="paths"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Checkbox
                  id="banners"
                  checked={field.value.includes('/api/banners/get-banners')}
                  onCheckedChange={value =>
                    field.onChange(
                      value
                        ? [...field.value, '/api/banners/get-banners']
                        : field.value.filter((v: string) => v !== '/api/banners/get-banners')
                    )
                  }
                />
              )}
            />
            <label
              htmlFor="banners"
              className="text-sm font-medium ml-2 cursor-pointer hover:opacity-80"
            >
              Banners
            </label>
          </div>
          <div>
            <Controller
              name="paths"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Checkbox
                  id="clases"
                  checked={field.value.includes('/api/live-lesson/get-lessons')}
                  onCheckedChange={value =>
                    field.onChange(
                      value
                        ? [...field.value, '/api/live-lesson/get-lessons']
                        : field.value.filter((v: string) => v !== '/api/live-lesson/get-lessons')
                    )
                  }
                />
              )}
            />
            <label
              htmlFor="clases"
              className="text-sm font-medium ml-2 cursor-pointer hover:opacity-80"
            >
              Clases en vivo
            </label>
          </div>
        </div>
        {isResendDisabled ? (
          <Button variant="secondary" disabled={isResendDisabled}>
            {timer} segundos para volver a borrar caché
          </Button>
        ) : loading ? (
          <Button type="button" variant="secondary" disabled>
            <Loading size="20px" color="white" />
            <span className="mr-2" />
            Borrando caché...
          </Button>
        ) : (
          <div className="py-3">
            <Button className="text-white w-full sm:w-fit" variant="secondary">
              Borrar cache
            </Button>
          </div>
        )}
      </form>
      {isApproved && (
        <Alert
          className={`mt-4 border ${isApproved.success ? 'border-green-500' : 'border-red-500'}`}
        >
          <AlertTitle className={isApproved.success ? 'text-green-500' : 'text-red-500'}>
            {isApproved.success ? 'Limpieza realizada' : 'Algo falló'}
          </AlertTitle>
          <AlertDescription>{isApproved.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
