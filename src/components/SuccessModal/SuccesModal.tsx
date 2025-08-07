'use client';

import { X, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuccessModalProps {
  onClose: () => void;
  text: string;
  success: boolean;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, text, success }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md mx-4 overflow-hidden shadow-lg border-none dark:bg-card bg-white">
        <div className="p-6 text-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-gray-800/50"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="space-y-3">
            {success ? (
              <div
                className={
                  'inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-400'
                }
              >
                <Check className="w-6 h-6" />
              </div>
            ) : (
              <div
                className={
                  'inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-400'
                }
              >
                <X className="w-6 h-6" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-white"></h2>
            <p className="dark:text-white text-black">{text}</p>
            <Button
              className={cn(
                'mt-4 text-white py-4 px-16 md:px-24 hover:bg-secondary hover:text-white text-xs md:text-sm font-poppins',
                {
                  'bg-green-500 hover:bg-green-600': success,
                  'bg-red-500 hover:bg-red-600': !success,
                }
              )}
              onClick={onClose}
            >
              Continuar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
