'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';
import { Toaster, toast } from 'sonner';
import { ArrowRight, Check, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DiscordModalProps {
  onOpenChange?: (open: boolean) => void;
}

export default function DiscordConnectModalOnce({ onOpenChange }: DiscordModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discordInviteUrl, setDiscordInviteUrl] = useState('');

  // Obtener la URL de invitación de Discord
  useEffect(() => {
    fetch('/api/security/getDiscordClientId')
      .then(res => res.json())
      .then(data => {
        if (data.inviteUrl) setDiscordInviteUrl(data.inviteUrl);
      });
  }, []);

  // ✅ Función reutilizable para chequear membresía
  const checkDiscordMembership = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/discord/user-in-server');
      const data = await res.json();

      if (data.isMember) {
        setIsJoined(true);
        setLoading(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al verificar la membresía de Discord:', error);
      return false;
    }
  };

  // ✅ Ejecutar chequeo y mostrar modal si corresponde
  useEffect(() => {
    const checkAndMaybeShowModal = async () => {
      const isUserInServer = await checkDiscordMembership();

      if (!isUserInServer) {
        const modalData = JSON.parse(localStorage.getItem('discordModalShown') || 'null');
        const now = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        if (!modalData || now.getTime() - new Date(modalData.timestamp).getTime() > oneDayInMs) {
          setIsOpen(true);
          localStorage.setItem(
            'discordModalShown',
            JSON.stringify({
              shown: true,
              timestamp: now.toISOString(),
            })
          );
        }
      }
    };

    checkAndMaybeShowModal();
  }, []);

  // ✅ Manejar apertura/cierre del modal
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) onOpenChange(open);
  };

  // ✅ Función para unirse al servidor de Discord
  const handleJoinServer = async () => {
    if (discordInviteUrl) {
      window.open(discordInviteUrl, '_blank');

      const isMember = await checkDiscordMembership();

      if (!isMember) {
        toast.success('¡Unido al servidor exitosamente!', {
          description:
            '¡Tu cuenta se ha conectado correctamente a nuestro servidor de Discord y tus roles han sido reclamados!',
          duration: 15000,
          action: {
            label: 'X',
            onClick: () => {
              window.close();
            },
          },
        });
        setLoading(true);
        setIsJoined(true);
      }

      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col justify-between items-center xl:h-[700px] xl:w-[883px] p-10">
        <div className="pt-14 flex flex-col items-center pb-0 mb-0 gap-6">
          <Image
            src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702322/discord_c3h4ro.png"
            alt="Discord Logo"
            width={100}
            height={100}
            className="mx-auto w-[100px] h-auto sm:h-auto sm:w-auto"
          />

          <Card className="dark:text-[#CFC9C9] text-black py-5 px-3 sm:p-5 md:px-10">
            <h2 className="text-base sm:text-xl md:text-2xl font-[400] text-center break-word font-poppins">
              Accede a la comunidad Finanflix para obtener seguimiento diario del mercado, clases en
              vivo y mucho más.
            </h2>
          </Card>
          <Card className="flex justify-center items-center gap-4 py-5 px-10 w-full">
            <div className="flex items-center space-x-3">
              <div
                className={`rounded-full p-1 md:p-2 m-0 w-fit h-fit ${isJoined ? 'bg-[#5EC169]' : 'bg-[#4C2FBA]'
                  }`}
              >
                <Check className="h-4 w-4 sm:w-7 sm:h-7 text-gray-300" />
              </div>
              <span className="font-poppins text-sm sm:text-base md:text-md">Unite al servidor</span>
            </div>
            <ArrowRight />

            <div className="flex items-center space-x-3">
              <div
                className={`rounded-full p-1 md:p-2 m-0 w-fit h-fit ${isJoined ? 'bg-[#5EC169]' : 'bg-[#4C2FBA]'
                  }`}
              >
                <Check className="h-4 w-4 sm:w-7 sm:h-7 text-gray-300" />
              </div>
              <span className="font-poppins text-sm sm:text-base md:text-md">
                Los roles pendientes serán asignados
              </span>
            </div>
          </Card>

          {/* Paso 1: Unirse al servidor de Discord */}
          <Button
            disabled={loading || isJoined}
            onClick={handleJoinServer}
            className={cn(
              'w-full  text-[14px] md:text-[16px] font-poppins bg-[#4C2FBA] hover:bg-[#4752C4] text-white py-6 rounded-xl px-6 md:px-12 dark:border-none border-none',
              isJoined && 'bg-green-700 hover:bg-green-800'
            )}
          >
            <div className="flex items-center justify-center gap-2 text-xs sm:text-base">
              {isJoined ? 'CONECTADO A DISCORD' : 'UNITE A LA COMUNIDAD Y RECLAMÁ TU ROL PENDIENTE'}
              {isJoined && <CheckCircle className="h-4 w-4" />}
            </div>
          </Button>

          {/* Paso 2: Conectar cuenta y obtener roles */}


          {isJoined && <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12  text-green-500 mt-3" />}
        </div>


        <Card className="py-5 space-y-2 flex flex-col justify-center px-3 dark:bg-transparent border-none">
          <span className="w-full text-center text-white text-sm md:text-md">
            ¿Necesitas ayuda?{' '}
            <Link
              className="text-md  text-[#DD4524] p-1 rounded-md hover:text-[#d03400] ml-1"
              target="_blank"
              href={'https://api.whatsapp.com/send?phone=5491134895722'}
            >
              Contactanos
            </Link>
          </span>
        </Card>

      </DialogContent>
      <Toaster />
    </Dialog>
  );
}
