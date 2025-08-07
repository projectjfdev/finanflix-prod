'use client';
import React from 'react';

import {
  ChevronRight,
  LayoutDashboard,
  Medal,
  Plus,
  Ticket,
  ImageUp,
  Radio,
  ListPlus,
  TvMinimalPlay,
  Images,
  ClipboardList,
  FileText,
  Users,
  ChartColumnStacked,
  BaggageClaim,
  ShoppingCart,
  User,
} from 'lucide-react';

import { Button } from '../ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Nav } from './Nav';
import { signOut } from 'next-auth/react';

type Props = {};

export default function Sidebar({}: Props) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const desktop = '(max-width: 1080px)';
  const mobileWidth = useMediaQuery(desktop);

  function toggleSidebar() {
    setIsCollapsed(prevState => !prevState);
  }

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
    });
  };

  return (
    <div className="relative border-r dark:border-card border-background">
      {!mobileWidth && (
        <div className="absolute right-[-30px] top-7 text-[2.875rem] z-40 ">
          <Button
            size={'icon'}
            variant={'outline'}
            className="rounded-full "
            onClick={toggleSidebar}
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: 'Admin Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            variant: 'ghost',
          },
          {
            title: 'Actualizar usuario',
            href: '/dashboard/actualizar-usuario',
            icon: User,
            variant: 'ghost',
          },
          {
            title: 'Preferencias de usuarios',
            href: '/dashboard/preferencias',
            icon: User,
            variant: 'ghost',
          },
          {
            title: 'Órdenes',
            href: '/dashboard/orders',
            icon: ClipboardList,
            variant: 'ghost',
          },
          {
            title: 'Órdenes de Suscripción ',
            href: '/dashboard/suscripcion-orders',
            icon: FileText,
            variant: 'ghost',
          },
          {
            title: 'Administración de Suscripciones',
            href: '/dashboard/suscripciones-de-usuarios',
            icon: Users,
            variant: 'ghost',
          },
          {
            title: 'Administración de Cursos',
            href: '/dashboard/cursos-de-usuarios',
            icon: Users,
            variant: 'ghost',
          },
          {
            title: 'Crear orden de compra',
            href: '/dashboard/crear-orden-de-compra',
            icon: ShoppingCart,
            variant: 'ghost',
          },
          {
            title: 'Categorias',
            href: '/dashboard/categorias',
            icon: ChartColumnStacked,
            variant: 'ghost',
          },
          {
            title: 'Cursos',
            href: '/dashboard/cursos',
            icon: TvMinimalPlay,
            variant: 'ghost',
          },
          {
            title: 'Nuevo curso',
            href: '/dashboard/nuevo-curso',
            icon: ListPlus,
            variant: 'ghost',
          },
          {
            title: 'Clases en vivo',
            href: '/dashboard/clases-en-vivo',
            icon: Radio,
            variant: 'ghost',
          },
          {
            title: 'Nueva clase en vivo',
            href: '/dashboard/nueva-clase-en-vivo',
            icon: Plus,
            variant: 'ghost',
          },
          {
            title: 'Nuevo banner',
            href: '/dashboard/nuevo-banner-top',
            icon: ImageUp,
            variant: 'ghost',
          },
          {
            title: 'Banners Top',
            href: '/dashboard/banner-top',
            icon: Images,
            variant: 'ghost',
          },
          {
            title: 'Nueva misión',
            href: '/dashboard/nueva-mision',
            icon: Medal,
            variant: 'ghost',
          },

          {
            title: 'Gestión de Suscripciones Paypal',
            href: '/dashboard/suscripciones-paypal',
            icon: BaggageClaim,
            variant: 'ghost',
          },
          {
            title: 'Soporte IT',
            href: 'https://soporte-finanflix.vercel.app/',
            icon: Ticket,
            variant: 'ghost',
            target: '_blank',
          },
        ]}
      />

      <div className="absolute right-[-20px] top-14 text-[2.875rem] z-40  bg-transparent flex md:hidden">
        <Button
          size="icon"
          variant={'outline'}
          className="rounded-full bg-none  "
          onClick={toggleSidebar}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/*Logout Menu */}

      {/* <div className="flex gap-2  dark:hover:bg-card">
        <Button
          onClick={handleSignOut}
          className="p-0 m-0 bg-transparent shadow-none border-none dark:text-white text-black dark:hover:bg-card hover:bg-transparent"
        >
          <LogOutIcon size={16} />
        </Button>

        <Button
          className="bg-transparent shadow-none border-none hidden md:block p-0 m-0 rounded-none dark:bg-transparent  dark:text-white dark:hover:bg-card hover:bg-transparent "
          onClick={() => signOut()}
        >
          Cerrar Sesión
        </Button>
      </div> */}
    </div>
  );
}
