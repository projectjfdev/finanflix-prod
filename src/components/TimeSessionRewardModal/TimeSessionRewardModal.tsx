'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import Image from 'next/image';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function TimeSessionRewardModal() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px] border-0 p-0 bg-[#5D3FD3] overflow-hidden h-1/2 text-white">
        <div className="relative text-white h-full">
          <div className="flex flex-col md:flex-row h-full">
            {/* Content */}
            <DialogHeader className="p-6  ml-6 mt-[38px]  font-groteskBook20">
              {/* <h2 className="text-[2.6rem] font-bold leading-none tracking-tight mb-2 font-grotesk25 ">
                                SUMASTE 240 PUNTOS <br /> DE XP!
                            </h2> */}
              <DialogTitle>
                <Image
                  width={240}
                  height={240}
                  src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703102/tituloexp_vruf2m.png"
                  alt="imagen de Gemas"
                  className="object-contain mb-6"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </DialogTitle>
              <DialogDescription className="text-[26px] mb-8 pb-8 font-poppins tracking-tight  leading-none  ">
                Pasaste 4hs <br /> nuestra plataforma.
              </DialogDescription>
              <p className="text-[13.5px] opacity-90 mb-6 font-poppins w-full pr-10 leading-[1.1] ">
                Con estos puntos podes conseguir beneficios en la plataforma y en nuestro discord
              </p>
            </DialogHeader>

            {/* Gems image */}
            <div className="w-full h-full relative">
              <Image
                fill
                src="/gemas-2.png"
                alt="Imagen de Gemas"
                className="w-auto h-auto object-cover absolute -z-10"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
