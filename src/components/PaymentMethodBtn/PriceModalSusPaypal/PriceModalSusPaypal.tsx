"use client";

import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SuccessModalProps {
  onClose: () => void;
}

export const PriceModalSusPaypal: React.FC<SuccessModalProps> = ({
  onClose,
}) => {
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
            <Label>Actualizar Precio de Suscripcion</Label>
            <Input placeholder="$250" className="dark:bg-background bg-card"></Input>
            <Button>
              Actualizar Precio
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
