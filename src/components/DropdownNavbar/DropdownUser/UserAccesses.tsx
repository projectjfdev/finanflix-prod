import { ReactNode } from 'react';
import {
  ListPlus,
  Radio,
  Plus,
  ImageUp,
  Ticket,
  Trophy,
  GraduationCapIcon,
  CalendarCheck,
  BookOpenText,
  ShoppingBasket,
  CreditCard,
} from 'lucide-react';
import { Medal, TvMinimalPlay } from 'lucide-react';
import { getServerSession } from 'next-auth';

interface Props {
  title: string;
  href: string;
  description: string;
  icon?: ReactNode;
}

export const userMenu: Props[] = [
  // {
  //   title: 'Mi Aprendizaje',
  //   href: '/mis-cursos',
  //   description: 'Ver tus cursos y progreso',
  //   icon: <GraduationCapIcon size={16} />,
  // },
  {
    title: 'Clases en Vivo',
    href: '/clases-en-vivo',
    description: 'Accede a clases en vivo',
    icon: <TvMinimalPlay size={16} />,
  },
  {
    title: 'Mis Programas',
    href: '/programas',
    description: 'Explora programas educativos',
    icon: <BookOpenText size={16} />,
  },
  // {
  //   title: "Leaderboard",
  //   href: "/leaderboard",
  //   description: "Ver el ranking y desafíos",
  //   icon: <Trophy size={16} />,
  // },
  {
    title: 'Suscripciones',
    href: '/suscripciones',
    description: 'Gestiona tus suscripciones',
    icon: <CalendarCheck size={16} />,
  },
  {
    title: 'Órdenes',
    href: '/mis-ordenes',
    description: 'Gestiona tus órdenes de compra',
    icon: <CreditCard size={16} />,
  },
  // {
  //   title: "Misiones",
  //   href: "#misiones",
  //   description: "Accede a misiones y tareas",
  //   icon: <Medal size={16} />,
  // },
];

export const adminMenu: Props[] = [
  {
    title: 'Nuevo Curso',
    href: '/dashboard/nuevo-curso',
    description: 'Seccion para crear Nuevo Curso',
    icon: <ListPlus size={16} />,
  },
  {
    title: 'Clases en Vivo',
    href: '/dashboard/clases-en-vivo',
    description: 'Seccion para administrar Clases en Vivo',
    icon: <Radio size={16} />,
  },
  {
    title: 'Crear Clase en Vivo',
    href: '/dashboard/nueva-clase-en-vivo',
    description: 'Seccion para crear Clases en Vivo',
    icon: <Plus size={16} />,
  },
  {
    title: 'Banner Top',
    href: '/dashboard/banner-top',
    description: 'Seccion para crear el banner Top Visible en la Home',
    icon: <ImageUp size={16} />,
  },
  // {
  //   title: 'Nueva Misión',
  //   href: '/dashboard/nueva-mision',
  //   description: 'Seccion para crear una nueva mision',
  //   icon: <Medal size={16} />,
  // },
  {
    title: 'Tickets',
    href: 'https://soporte-finanflix.vercel.app/',
    description: 'Seccion para administrar Tickets',
    icon: <Ticket size={16} />,
  },
];
