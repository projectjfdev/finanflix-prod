'use client';

import { useState, useEffect } from 'react';
import { DiscIcon as DiscordLogoIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Confetti from '@/components/Confetti/Confetti';
import Image from 'next/image';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';

export default function DiscordSuccessPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  // Update dimensions for confetti and stop after 5 seconds
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <>
      <div className=" w-full flex flex-col items-center justify-center  relative py-16 md:py-28">
        {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} />}

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-24 h-24 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[10%] right-[5%] w-32 h-32 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-md w-full">
          <Card className="border-0 shadow-xl bg-white dark:bg-card backdrop-blur-sm py-7 px-4">
            <CardHeader className="flex flex-col items-center space-y-2 pb-2">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mb-2">
                <Image
                  src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702322/discord_c3h4ro.png"
                  alt="Discord Logo"
                  width={100}
                  height={100}
                  className="mx-auto h-auto w-auto"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center">¡Conexión Exitosa!</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-4">
              <div className="space-y-4">
                <div className="h-1 w-16 bg-indigo-600 mx-auto rounded-full"></div>
                <p className="text-muted-foreground">
                  ✅ Te has conectado exitosamente con Discord. Si tienes una suscripción activa o
                  has comprado un curso, ya se te han asignado todos los roles correspondientes.
                  Ahora puedes acceder a todas las funcionalidades de nuestra comunidad.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Link href="/" className="w-full">
                <Button className="w-full bg-secondary text-white">Seguir Aprendiendo</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      <FooterColorSetter color="bg-[#F3F4F6]" />
    </>
  );
}
