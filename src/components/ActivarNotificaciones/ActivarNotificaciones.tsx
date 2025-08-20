import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Toaster, toast } from "sonner";

export const ActivarNotificaciones = () => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center flex flex-col gap-5">
            <AlertDialogTitle className="text-center  text-[1.5rem]  ">
              🌟 ¡Activa las Notificaciones! 🌟
            </AlertDialogTitle>
            <AlertDialogDescription className="font-poppins dark:text-white text-black px-">
              Sé el primero en enterarte de nuestras emocionantes clases en
              vivo! Al habilitar las notificaciones, no te perderás ninguna
              actualización ni evento especial. ¡Únete a nuestra comunidad y
              mantente al tanto de todo lo que tenemos para ofrecerte!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#908D8D] ">
              AHORA NO
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-white"
              onClick={() => {
                toast.success("¡Notificaciones activadas con éxito!", {
                  description:
                    "Ahora estarás al día con todas nuestras actualizaciones.",
                });
              }}
            >
              ACTIVAR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
};
