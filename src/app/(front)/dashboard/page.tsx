'use client';

import DashboardCard from '@/components/Dashboard/Card';
import { ClearCache } from '@/components/Dashboard/ClearCache';
import { ExchangeRateInput } from '@/components/Dashboard/ExchangeRateInput';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import {
  BookOpen,
  PlusCircle,
  Video,
  Headset,
  Upload,
  Goal,
  Image,
  List,
  Trophy,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const cardData: any = [
  {
    label: 'Órdenes',
    text: 'Gestiona tus pedidos y ventas',
    icon: List,
    src: '/dashboard/orders',
  },
  {
    label: 'Cursos',
    text: 'Explora y administra tus cursos',
    icon: BookOpen,
    src: '/dashboard/cursos',
  },
  {
    label: 'Nuevo Curso',
    text: 'Crea y publica un nuevo curso',
    icon: PlusCircle,
    src: '/dashboard/nuevo-curso',
  },
  {
    label: 'Clases en Vivo',
    text: 'Administra tus sesiones en directo',
    icon: Video,
    src: '/dashboard/clases-en-vivo',
  },
  {
    label: 'Nueva Clase en Vivo',
    text: 'Programa una nueva sesión en vivo',
    icon: PlusCircle,
    src: '/dashboard/nueva-clase-en-vivo',
  },
  {
    label: 'Nuevo Banner',
    text: 'Crea un nuevo banner promocional',
    icon: PlusCircle,
    src: '/dashboard/nuevo-banner-top',
  },
  {
    label: 'Banners Top',
    text: 'Gestiona tus banners destacados',
    icon: Image,
    src: '/dashboard/banner-top',
  },
  {
    label: 'Nueva Misión (próximamente)',
    text: 'Define una nueva misión para tus estudiantes',
    icon: Goal,
    src: '/dashboard/nueva-mision',
  },
  {
    label: 'Soporte',
    text: 'Administra todos los Tickets entrantes de Finanflix.',
    icon: Headset,
    src: 'https://soporte-finanflix.vercel.app/',
    targetBlank: true,
  },
  {
    label: 'PDF Upload Service',
    text: 'Sube  contenido multimedia a Google Cloud Storage.',
    icon: Upload,
    src: 'https://pdf-ms-final.vercel.app/',
    targetBlank: true,
  },
  {
    label: 'Leader Board (próximamente) ',
    text: 'Sube  contenido multimedia a Google Cloud Storage.',
    icon: Trophy,
    src: '/leaderboard',
  },
  {
    label: 'Home',
    text: 'Sube  contenido multimedia a Google Cloud Storage.',
    icon: Home,
    src: '/',
  },
];

// TODO: CAMBIOS TEST

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Ajusta el tiempo en milisegundos según sea necesario.

    return () => clearTimeout(timer); // Limpia el temporizador para evitar fugas de memoria.
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  //TODO: Crear boton de clear cache
  return (
    <div className="flex flex-col ml-4 md:ml-8 h-full ">
      <div className="text-2xl mb-3 font-poppins">
        <MediumTitle className="dark:text-white text-black" title="Dashboard" />
      </div>
      <div className="border px-5 md:px-10 dark:bg-background bg-white rounded-2xl py-4 mb-4">
        <ExchangeRateInput />
      </div>
      <div className=" border px-5 md:px-10 gap-5 w-full h-full dark:bg-background bg-white rounded-2xl ">
        <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4  mt-0 pt-10 mb-10">
          {cardData.map((data: any, index: number) => (
            <Link
              target={data.targetBlank ? '_blank' : '_self'}
              href={data.src}
              key={index}
              className="transition-transform duration-300 ease-in-out hover:scale-105 dark:bg-card bg-white rounded-xl border"
            >
              <DashboardCard
                label={data.label}
                discription={data.text}
                icon={data.icon}
                amount=""
              />
            </Link>
          ))}
        </section>
      </div>
      <div className="border px-10 dark:bg-background bg-white rounded-2xl py-4 mt-4">
        <ClearCache />
      </div>
    </div>
  );
}
