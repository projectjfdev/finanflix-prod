'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock } from 'lucide-react';
import { Button } from '../ui/button';

// Definimos los tipos de las props para el componente
interface TooltipAprenderProps {
  title: string;
  text: string;
  showButtons?: boolean; // Prop opcional para mostrar los botones
}

export const TooltipAprender = ({ title, text, showButtons = true }: TooltipAprenderProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const tooltipHandler = () => {
    setIsOpen(false);
  };
  return (
    <Alert className={`${isOpen === false ? 'hidden' : null}  dark:bg-card bg-white  `}>
      <div className="w-full py-2">
        <div className="flex gap-3 items-center">
          <Clock className="h-4 w-4" />
          <AlertTitle className="font-semibold text-base sm:text-lg">{title}</AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-xs sm:text-base">{text}</AlertDescription>
        {showButtons && (
          <div className={`${isOpen === false ? 'hidden' : ''} flex  mt-5`}>
            {/* <Button className="text-white  hover:text-opacity-80 py-[6px] ">Empezar</Button> */}
            <div
              className="dark:bg-background bg-secondary text-white border rounded-full px-6 py-[5px] text-xs sm:text-sm hover:text-opacity-80 font-medium cursor-pointer  "
              onClick={tooltipHandler}
            // variant="outline"
            >
              Cerrar
            </div>
          </div>
        )}
      </div>
    </Alert>
  );
};
