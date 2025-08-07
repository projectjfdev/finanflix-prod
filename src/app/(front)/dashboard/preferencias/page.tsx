'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const PreferenciasAdminPage = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const handleDownload = async () => {
    try {
      const response = await fetch('/api/admin/preferences', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `preferences_${formattedDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.error('Error al descargar CSV:', error);
      alert('Hubo un error al intentar descargar el CSV.');
    }
  };

  return (
    <div className="w-full">
      {/* Título Principal */}
      <div className="text-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">
          Descargar todas las preferencias de los usuarios en formato .csv
        </h1>
      </div>

      {/* Descripción */}
      <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
        Descargar preferencias de usuarios de{' '}
        <span className="font-semibold text-primary">Finanflix</span>.
        <br />
      </p>
      <Separator className="my-4" />

      <div className="w-full text-center pt-10 ">
        <Button onClick={handleDownload}>Descargar CSV</Button>
      </div>
    </div>
  );
};

export default PreferenciasAdminPage;
