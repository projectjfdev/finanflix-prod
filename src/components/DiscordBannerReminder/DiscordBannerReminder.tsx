'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { ArrowRight, Check, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function DiscordConnectBanner() {
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discordInviteUrl, setDiscordInviteUrl] = useState('');

  useEffect(() => {
    fetch('/api/security/getDiscordClientId')
      .then(res => res.json())
      .then(data => {
        if (data.inviteUrl) setDiscordInviteUrl(data.inviteUrl);
      });
  }, []);
  // Logica de Discord
  // const clientId = `${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}`;
  // const DiscordRedirectUri = `${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}`;
  // const scope = encodeURIComponent('identify guilds.join'); // permisos del bot
  // const discordInviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${DiscordRedirectUri}&scope=${scope}`;

  // Revisar si el usuario ya se encuentra en el servidor de Discord
  const checkDiscordMembership = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/discord/user-in-server');
      const data = await res.json();

      setIsJoined(data.isMember);
    } catch (error) {
      console.error('Error al verificar la membresía de Discord:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDiscordMembership();
  }, []);

  // Manejar clic en unirse al servidor
  const handleJoinServer = async () => {
    if (discordInviteUrl) {
      // Abre la invitación de Discord en una nueva pestaña
      window.open(discordInviteUrl, '_blank');

      // Espera a que checkDiscordMembership termine antes de mostrar el alert
      await checkDiscordMembership();

      // Hack Trick - Si el usuario no está en el servidor, muestra el mensaje de éxito - aprovechamos que como es asincrono no se actualiza el estado inmediato, usamos el error a favor
      if (!isJoined) {
        // No deberías confiar en el valor de isJoined justo después de await checkDiscordMembership() porque el estado es asíncrono
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
      // Detiene la carga después de la verificación
      setLoading(false);
    }
  };

  // If already connected, don't show the banner
  if (isJoined) {
    return null;
  }

  return (
    <div className="md:w-full dark:bg-card bg-card py-3 px-4 rounded-2xl ">
      <div className="flex flex-col 2xl:flex-row items-center justify-between gap-4 xl:py-5 px-3">
        <div className="flex flex-col 2xl:flex-row items-center gap-3 2xl:gap-6">
          <Image
            src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702322/discord_c3h4ro.png"
            alt="Discord Logo"
            width={10}
            height={10}
            className="h-auto w-[50px] md:w-[100px] "
          />
          <span className="text-xs sm:text-sm dark:text-white text-black font-medium w-full text-center 2xl:text-start ">
            Accede a la comunidad Finanflix para obtener seguimiento diario del mercado, clases en
            vivo y mucho más.
          </span>
        </div>

        <div className="flex flex-col 2xl:flex-row flex-wrap items-center gap-3 w-full sm:w-auto space-y-1">
          <div className="flex items-center gap-2 text-xs dark:text-slate-300 text-black justify-center w-full">
            <div className={`rounded-full p-0.5 ${isJoined ? 'bg-green-600' : 'bg-[#4C2FBA]'}`}>
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className='text-xs sm:text-sm'>Unite al servidor</span>
            <ArrowRight className="h-3 w-3" />
            <div className={`rounded-full p-0.5 ${isJoined ? 'bg-green-800' : 'bg-[#4C2FBA]'}`}>
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className='text-xs sm:text-sm' >Los roles pendientes serán asignados</span>
          </div>

          <div className="flex justify-center sm:flex-row gap-2 w-full">
            <Button
              disabled={loading || isJoined}
              onClick={handleJoinServer}
              className={cn(
                'w-full  text-xs sm:text-[16px] font-poppins bg-[#4C2FBA] hover:bg-[#4752C4] text-white py-3 sm:py-6 rounded-xl px-6 md:px-12 dark:border-none border-none',
                isJoined && 'bg-green-700 hover:bg-green-800'
              )}
            >
              <div className="flex items-center justify-center gap-2 px-3 text-xs sm:text-sm ">
                {isJoined ? 'CONECTADO A DISCORD' : 'UNITE A LA COMUNIDAD'}
                {isJoined && <CheckCircle className="h-4 w-4" />}
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
