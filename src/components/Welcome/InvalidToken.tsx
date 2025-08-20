import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export const InvalidToken = () => {
  return (
    <Card className="shadow-lg flex flex-col items-center justify-center">
      <div className="pb-16 flex items-center pt-5">
        <Card className="container flex flex-col gap-3 items-center justify-center  dark:text-white text-black pt-10 px-10 shadow-md  ">
          <div className="max-w-md">
            <div className="text-4xl md:text-5xl font-dark font-bold flex justify-center ">
              <strong> Token Inválido </strong>
            </div>
            <br />
            <p className=" md:text-2xl font-light leading-normal text-center">
              <strong>Por favor, contactá al soporte</strong>
            </p>
            <br />
            <p className="mb-2 text-center">
              {' '}
              Parece que hay un problema con tu token de usuario, ya que parece ser inválido. Si
              crees que esto es un error, por favor contactá al soporte. <strong>
                ¡Gracias!
              </strong>{' '}
            </p>
          </div>

          <div className="max-w-lg"></div>

          <div className="flex justify-center pb-16">
            <Link
              href={
                'https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0'
              }
            >
              <div className="text-white bg-primary rounded-full py-3 px-10 hover:bg-secondary">
                SOPORTE →
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </Card>
  );
};
