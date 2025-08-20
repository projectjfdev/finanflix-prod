'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { Button } from '../ui/button';
import Cookies from 'cookiejs';
import Image from 'next/image';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

// Tipado de las props para abrir y cerrar el modal desde otro archivo
interface VideoHomeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VideoModal({ isOpen, onOpenChange }: VideoHomeModalProps) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    // Sincronizamos el estado local con el estado recibido desde las props
    setShowModal(isOpen);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    Cookies.set('presentationViewed', 'true', { expires: 30, path: '/' });
    onOpenChange(open); // Usamos la función pasada por las props
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="md:py-5 w-full h-3/4 md:h-auto">
          <DialogHeader>
            <div className="flex flex-col gap-5 w-full">
              {/* MODAL TITLE */}
              <DialogTitle className="flex justify-center w-full ">
                {/* <h1 className="mb-4 ml-5 text-4xl  font-grotesktwentyfive py-3 text-center text-[#702DFF] flex md:hidden w-full ">
                  BIENVENIDO A FINANFLIX  hidden md:flex
                </h1>  */}
                <Image
                  width={450}
                  height={628}
                  src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703147/tituloVideo_gvipad.png"
                  alt="titulo de video"
                  className="object-cover h-30 w-[250px] md:w-[450px] lg:w-[628px] py-5 "
                />
              </DialogTitle>
              {/* MODAL DESCRIPTION  right-12 */}
              <DialogDescription>
                <p className="pb-4 md:pt-5 relative bottom-2 text-center md:px-[162px] font-poppins text-[18px] font-bold  dark:text-white text-black ">
                  Mira este video para entender como funciona la plataforma.
                </p>
              </DialogDescription>
              {/* MODAL VIDEOS border-2 border-gray-300 */}
              <div className=" rounded-lg w-full ">
                <div className="w-full  flex flex-col justify-center items-center ">
                  <div className="w-full max-w-[840px] aspect-video">
                    <iframe
                      src="https://player.vimeo.com/video/1022325100?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&share=0"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen"
                      // allowFullScreen
                    ></iframe>
                  </div>

                  <div className="flex justify-center pt-10 md:pb-5">
                    <Button
                      className="flex items-center rounded-3xl border-none gap-4 shadow-xl py-6 px-20 text-white"
                      type="submit"
                      onClick={() => handleOpenChange(false)}
                    >
                      HE VISTO EL VIDEO ENTERO
                    </Button>
                  </div>
                </div>
              </div>
              {/* MODAL BUTTON */}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
