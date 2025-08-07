'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { UpdateUserSuscription } from '@/components/Dashboard/UpdateUserSuscription';

export default function SuscripcionesDeUsuariosPage() {
  return (
    <div className="w-full">
      {/* Título Principal */}
      <div className="text-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Otorgar una suscripción a un usuario</h1>
      </div>

      {/* Descripción */}
      <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
        Dale una suscripción a algún usuario de{' '}
        <span className="font-semibold text-primary">Finanflix</span>.
        <br />
        <span className="font-medium">Paso 1:</span> Búscalo por su email.
        <br />
        <span className="font-medium">Paso 2:</span> Selecciona el tipo de suscripción que deseas
        otorgarle.
        <br />
        <span className="font-medium">Paso 3:</span> Haz clic en el botón{' '}
        <span className="font-semibold">Guardar cambios</span>.
      </p>
      <Separator className="my-4" />

      <div className="w-full text-center pt-10 ">
        <UpdateUserSuscription />
      </div>
    </div>
  );
}
