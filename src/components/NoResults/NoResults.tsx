import React from "react";
export const NoResults = () => {
  return (
    <div>
      <div className="w-full px-16 md:px-0 h-1/2 flex items-center justify-center py-10 ">
        <div className="  flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg">
          <p className="text-6xl md:text-7xl lg:text-5xl font-bold tracking-wider text-gray-300">
            Sin resultados
          </p>
          <p className="text-gray-500 mt-4 pb-4 border-b-2 text-center">
            Nada por aquí en base a tus filtros de búsqueda {":("}
          </p>
        </div>
      </div>
    </div>
  );
};
