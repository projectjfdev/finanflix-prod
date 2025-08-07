'use client';

import React, { useState } from 'react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { validateOfflineCourseOrder } from '@/utils/Endpoints/adminEndpoints';
import Link from 'next/link';

interface PropsIsApproved {
  message: string;
  success: null | boolean;
}

interface Props {
  status: string;
  userId: string;
  orderId: string;
  coursesNames: {
    _id: string;
    title: string;
  }[];
}

export const FormValidateOfflineCourse = ({ status, coursesNames, userId, orderId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState<PropsIsApproved>();

  const form = useForm();
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);
    const newData = {
      ...data,
      userId,
      orderId,
    };

    try {
      const res = await validateOfflineCourseOrder(newData);

      setIsApproved(res);

      setIsLoading(false);
    } catch (error) {
      // console.error('Error al valuar:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col border border-solid border-gray-[500]   mt-3 rounded-lg w-full 3xl:w-2/3 mb-3 px-3"
        >
          <TableRow className="dark:hover:bg-transparent">
            <div className="flex flex-col md:flex-row justify-start items-start md:items-center">
              <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                Cambiar Estado de la orden a pagada
              </TableCell>
              <TableCell className="py-4 text-right dark:text-white">
                {!isLoading ? (
                  <Button
                    type="submit"
                    className="text-white"
                    size="sm"
                    variant="secondary"
                    disabled={status === 'Pagado' ? true : false}
                  >
                    {status === 'Pagado' ? 'Abonado' : 'Marcar como pagada'}
                  </Button>
                ) : (
                  <Button disabled size="sm" variant="outline">
                    Actualizando...
                  </Button>
                )}
              </TableCell>
            </div>
          </TableRow>
        </form>
      </Form>
      {status === 'Pagado' && (
        <div className="text-sm text-gray-500 ">
          <p>La orden de compra se ha completado</p>
          <p>
            Para otorgarle el curso correspondiente, redirigite al apartado de{' '}
            <Link href="/dashboard/cursos-de-usuarios">Administración de cursos</Link>
          </p>
        </div>
      )}
      {isApproved && (
        <Alert
          className={`mt-4 border ${isApproved.success ? 'border-green-500' : 'border-red-500'}`}
        >
          {/* <RocketIcon className="h-4 w-4" /> */}
          <AlertTitle className={isApproved.success ? 'text-green-500' : 'text-red-500'}>
            {isApproved.success ? 'Actualizado' : 'Algo falló'}
          </AlertTitle>
          <AlertDescription>{isApproved.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
