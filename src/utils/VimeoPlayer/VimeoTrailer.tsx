'use client';
import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { LoadingFinanflix } from '../Loading/LoadingFinanflix';

interface VimeoPlayerProps {
  videoId: number;
}

const VimeoTrailer: React.FC<VimeoPlayerProps> = ({ videoId }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar si el video está cargando
  const playerInstance = useRef<any>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (playerRef.current) {
      // Configuración del reproductor de Vimeo
      const player = new Player(playerRef.current, {
        id: videoId,
        autopause: false,
        autoplay: false,
        muted: false,
        loop: false,
        controls: true, // Habilita los controles estándar
        byline: false, // Oculta el nombre del autor
        portrait: false, // Oculta la foto de perfil
        title: false,
        dnt: true, // Activado para evitar el rastreo
        responsive: true,
        transparent: false, // esto remueve el espacio blanco
      });

      // Escuchar evento cuando el video está completamente cargado
      player.on('loaded', () => {
        setIsLoading(false); // Cambiar el estado cuando el video esté listo
      });

      // Escuchar eventos del reproductor
      player.on('play', () => {
        console.log('El video se está reproduciendo');
      });

      // Escuchar evento cuando el video termina
      player.on('ended', async () => {
        console.log(`El video ha terminado`);
      });

      // Escuchar evento cuando el video se pausa
      player.on('pause', async () => {
        console.log(`El video se ha pausado`);
      });

      return () => {
        player.unload(); // Limpiar el reproductor cuando el componente se desmonte color="#ffffff"
      };
    }
  }, [videoId]);

  useEffect(() => {
    const handleScroll = async () => {
      if (!hasInteracted && playerInstance.current) {
        setHasInteracted(true); // solo una vez
        try {
          await playerInstance.current.play();
          // console.log('Video reproducido tras scroll');
        } catch (error) {
          console.warn('No se pudo reproducir el video:', error);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasInteracted]);

  return (
    <div className="relative w-full m-0 p-0 h-[300px] ">
      {/* Fondo de carga */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-[210px] flex items-center justify-center dark:bg-gray-800 z-10 transition-opacity duration-300 opacity-100 ">
          <LoadingFinanflix containerWidth="w-3/4" />
        </div>
      )}

      {/* Contenedor del reproductor de Vimeo */}
      <div
        ref={playerRef}
        className="rounded-2xl  overflow-hidden overflow-y-hidden dark:bg-transparent border-none m-0 p-0 h-[300px]  transition-all duration-300 ease-in-out w-full"
        style={{ minHeight: '240px' }}
      ></div>
    </div>
  );
};

export default VimeoTrailer;
