import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import MediumTitle from '../MediumTitle/MediumTitle';

const LeaderBoard = () => {
  return (
    <div className="relative w-full py-5 md:py-10">
      {/* Background 2xl:dark:bg-[#282838] */}
      {/* // TODO: CAMBIOS TEST UI FONDO GRIS REMOVIDO */}
      {/* <div className="dark:bg-[#282838] bg-[#eeeef2] hidden 2xl:block absolute left-[-450px] w-[calc(100vw+350px)] min-h-[50vh] h-[50vh] -z-40"></div> */}

      <div className="h-auto relative">
        <div className="dark:text-white">
          <div className="container mx-auto">
            <div className="pl-1 md:pl-0 rounded-lg">
              {/* <h1 className="text-2xl font-bold flex items-center pb-7">
                <TrendingUp size={30} className="text-[#F03300] hidden lg:flex" />
                <span className="ml-3 hidden lg:flex">Tabla de Líderes de esta semana</span>
              </h1> */}

              <div className="flex items-center">
                <TrendingUp size={30} className="text-[#F03300] hidden lg:flex" />
                <MediumTitle
                  className=" ml-3 hidden lg:flex "
                  title="Tabla de Líderes de esta semana"
                />
              </div>

              {/* Blurred content */}
              <div className="filter blur-sm">
                <div className="grid sm:grid-cols-2 mmd:grid-cols-3 gap-10 xl:gap-40 2xl:gap-60">
                  {/* First column */}
                  <div className="space-y-4">
                    e
                    {[1, 2, 3, 4].map(num => (
                      <div key={num} className="flex items-center">
                        <span className="text-2xl font-bold w-8 text-start ">{num}</span>
                        <div className="w-12 h-12 rounded-full bg-gray-700  mr-4"></div>
                        <span className="bg-gray-700 h-6 w-32"></span>
                      </div>
                    ))}
                  </div>

                  {/* Second column */}
                  <div className="space-y-4">
                    {[5, 6, 7, 8].map(num => (
                      <div key={num} className="flex items-center">
                        <span className="text-2xl font-bold w-8 text-start">{num}</span>
                        <div className="w-12 h-12 rounded-full bg-gray-700  mr-4"></div>
                        <span className="bg-gray-700 h-6 w-32"></span>
                      </div>
                    ))}
                  </div>

                  {/* Third column */}
                  <div className="space-y-4 hidden md:flex flex-col">
                    {[9, 10, 11, 12].map(num => (
                      <div key={num} className="flex items-center">
                        <span className="text-2xl font-bold w-8 text-start mr-2">{num}</span>
                        <div className="w-12 h-12 rounded-full bg-gray-700  mr-4"></div>
                        <span className="bg-gray-700  h-6 w-32"></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overlay message */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 text-white text-center p-8 rounded-lg ">
                  <h2 className="text-[26px] md:text-[32px] font-bold mb-4">
                    {' '}
                    ¡Próximamente en Finanflix!{' '}
                  </h2>
                  <p className="text-base md:text-lg">
                    En Finanflix, estamos desarrollando un innovador sistema de puntaje que
                    permitirá a nuestros usuarios acumular recompensas y disfrutar de beneficios
                    exclusivos en sus próximas compras. Muy pronto estará disponible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
