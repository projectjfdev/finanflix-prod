'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { LockIcon } from 'lucide-react'; // Ícono moderno

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModalUnsubscribed = ({ isOpen, onOpenChange }: ModalProps) => {
  const router = useRouter();
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const handleClick = () => {
    router.push('/suscripciones');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-max rounded-2xl bg-white dark:bg-[#1E1E1E] p-10 text-center flex flex-col items-center gap-6 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <LockIcon className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-[22px] sm:text-2xl md:text-3xl font-bold font-poppins text-black dark:text-white">
            Acceso restringido
          </h2>

          <p className="text-gray-600 dark:text-gray-300 max-w-md text-sm sm:text-base">
            Esta clase en vivo es exclusiva para usuarios suscriptos. Suscribite ahora para acceder
            a todas las clases y contenido exclusivo.
          </p>
        </div>

        <Button
          onClick={handleClick}
          className="w-full max-w-sm py-6 text-base sm:text-lg font-semibold rounded-xl"
        >
          Suscribirme
        </Button>
      </DialogContent>
    </Dialog>
  );
};
