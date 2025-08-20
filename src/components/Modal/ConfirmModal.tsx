import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ open, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md h-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold mb-6">
              Confirmación de Suscripción
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              El usuario seleccionado no está conectado al servidor de discord, por lo tanto no se asignaran los roles.
              Antes de proceder, asegúrate de que el usuario haya vinculado su cuenta de Finanflix con Discord. <br/> <br/>
              ¿Desea proceder con la confirmación de la suscripción de todas formas?
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 pt-4">
          <Button
            variant="destructive"
            onClick={onCancel}
            className="sm:w-24"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="sm:w-24 bg-[#4BBD3A] hover:bg-[#4BBD3A/70] dark:bg-[#4BBD3A] dark:hover:[#4BBD3A/90]"
          >
            <CheckCircle className="w-4 h-4" />
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
