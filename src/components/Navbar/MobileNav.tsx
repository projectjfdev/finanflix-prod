'use client';

import {
  Headset,
  Home,
  Menu,
  Notebook,
  TvMinimalPlay,
  User,
  Users,
  GraduationCapIcon,
  CalendarCheck,
  LogOutIcon,
  CreditCard,
  User2,
  MessageCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.css';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { hasSubscription } from '@/utils/HasSubscription';

interface MobileNavProps {
  className?: string;
}

interface DropdownWithoutIconProps {
  href?: string;
  goToMenu?: string;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

function MobileNav({ className }: MobileNavProps) {
  const { data: session, status } = useSession();
  const [activeMenu, setActiveMenu] = useState('main');
  const [isOpen, setIsOpen] = useState(false);

  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  function DropdownWithoutIcon({
    href,
    goToMenu,
    rightIcon,
    children,
    onClick,
  }: DropdownWithoutIconProps) {
    return (
      <Link
        href={href || ''}
        className="menu-item bg-none w-full"
        onClick={e => {
          if (goToMenu) {
            e.preventDefault();
            setActiveMenu(goToMenu);
          }
          if (onClick) onClick();
          closeMenu();
        }}
      >
        {children}
        <span className="icon-right">{rightIcon}</span>
      </Link>
    );
  }

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
    });
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!session) return;

      const res = await fetch('/api/security/getIdAdmin');
      if (res.ok) {
        const data = await res.json();
        setIsUserAdmin(data.isAdmin);
      }
    };

    checkAdmin();
  }, [session]);

  return (
    <nav className={`${className} w-full`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="align-middle">
          <Menu className="w-8 h-8 sm:w-8 sm:h-8" />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 dark:bg-background bg-white p-0 w-full overflow-y-scroll">
          <div className="w-full">
            <CSSTransition
              in={activeMenu === 'main'}
              timeout={500}
              classNames="menu-primary w-full"
              unmountOnExit
            >
              <div className="menu w-full py-10">
                <div className="p-4">
                  <Link href="/">
                    <Image
                      src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702703/logo_gdl8ji.svg"
                      className="h-[31.74px] w-[178.18px]  relative ml-1 hidden dark:flex"
                      alt="Imagen de Finanflix Logo"
                      width={550}
                      height={150}
                    />
                    <Image
                      src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702639/logoblack_ohtnnt.png"
                      className="h-[31.74px] w-[178.18px] relative ml-1  dark:hidden flex"
                      alt="Finanflix Logo"
                      width={550}
                      height={150}
                    />
                  </Link>
                </div>
                <Separator className="bg-gray-300" />

                {/* Menu Usuario sin logear */}
                {!session && (
                  <div className="py-2">
                    <DropdownWithoutIcon href="/">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <Home className="mr-2" />
                        <span className="text-lg">INICIO</span>
                      </div>
                    </DropdownWithoutIcon>

                    <DropdownWithoutIcon href="/login">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <User2 className="mr-2" />
                        <span className="text-lg">INICIAR SESIÓN</span>
                      </div>
                    </DropdownWithoutIcon>

                    <DropdownWithoutIcon href="https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <Headset className="mr-2" />
                        <span className="text-lg">SOPORTE</span>
                      </div>
                    </DropdownWithoutIcon>

                    {/* <DropdownWithoutIcon href="https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <MessageCircle className="mr-2" />
                        <span className="text-lg">WHATSAPP</span>
                      </div>
                    </DropdownWithoutIcon> */}

                    {/* <DropdownWithoutIcon href="#" >
                    <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full">
                      <Notebook className="mr-2" />
                      <span className="text-lg">MÁS</span>
                    </div>
                  </DropdownWithoutIcon> */}
                  </div>
                )}

                {/* Menu Usuario logeado */}

                {session && (
                  <>
                    <div className="py-2">
                      <DropdownWithoutIcon href="/">
                        <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                          <Home className="mr-2" />
                          <span className="text-lg">INICIO</span>
                        </div>
                      </DropdownWithoutIcon>

                      <DropdownWithoutIcon href="/programas">
                        <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                          <TvMinimalPlay className="mr-2" />
                          <span className="text-lg">MIS PROGRAMAS</span>
                        </div>
                      </DropdownWithoutIcon>

                      <DropdownWithoutIcon href="https://discord.gg/yNKR8gR6PP">
                        <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                          <Users className="mr-2" />
                          <span className="text-lg">COMUNIDAD</span>
                        </div>
                      </DropdownWithoutIcon>

                      {/* <DropdownWithoutIcon href="#" >
                    <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full">
                      <Notebook className="mr-2" />
                      <span className="text-lg">MÁS</span>
                    </div>
                  </DropdownWithoutIcon> */}
                    </div>
                    <Separator className="bg-gray-300" />
                  </>
                )}

                {status === 'authenticated' && (
                  <div className="py-2">
                    <div className="flex items-center px-4 py-3">
                      <Avatar className="mr-2 dark:bg-card w-8 h-8">
                        <AvatarImage
                          src={
                            session?.user?.profileImage?.url ||
                            'https://res.cloudinary.com/drlottfhm/image/upload/v1750703606/noImgProfile_nkbhbr.png'
                          }
                          alt="profile finanflix"
                        />
                        <AvatarFallback>{session?.user?.username}</AvatarFallback>
                      </Avatar>
                      <p className="text-lg">
                        {session?.user.firstName || session?.user?.username}
                      </p>
                    </div>

                    {isUserAdmin ? (
                      <DropdownWithoutIcon href="/dashboard">
                        <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full">
                          <Notebook className="mr-2" />
                          <span className=" text-[0.89rem]">ADMIN PANEL</span>
                        </div>
                      </DropdownWithoutIcon>
                    ) : null}

                    <DropdownWithoutIcon href="/editar-perfil">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <User className="mr-2" />
                        <span className="text-lg">CUENTA</span>
                      </div>
                    </DropdownWithoutIcon>
                    {/*
                    <DropdownWithoutIcon href="/mis-cursos">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <GraduationCapIcon className="mr-2" />
                        <span className="text-lg">MI APRENDIZAJE</span>
                      </div>
                    </DropdownWithoutIcon> */}

                    {/* PROVISORIO MENU PARA DASHBOARD ACCESIBLE PARA TODOS */}

                    <DropdownWithoutIcon href="/clases-en-vivo">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <TvMinimalPlay className="mr-2" />
                        <span className="text-lg">CLASES EN VIVO</span>
                      </div>
                    </DropdownWithoutIcon>

                    {/* <DropdownWithoutIcon href="/leaderboard" >
                    <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full">
                      <Trophy className="mr-2" />
                      <span className="text-lg">LEADERBOARD</span>
                    </div>
                  </DropdownWithoutIcon> */}

                    {!hasSubscription(session) && (
                      <DropdownWithoutIcon href="/suscripciones">
                        <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800  hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                          <CalendarCheck className="mr-2" />
                          <span className="text-lg ">SUSCRIPCIONES</span>
                        </div>
                      </DropdownWithoutIcon>
                    )}

                    <DropdownWithoutIcon href="/mis-ordenes">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800  hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <CreditCard className="mr-2" />
                        <span className="text-lg ">ÓRDENES</span>
                      </div>
                    </DropdownWithoutIcon>

                    <DropdownWithoutIcon href="https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0">
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <Headset className="mr-2" />
                        <span className="text-lg">SOPORTE</span>
                      </div>
                    </DropdownWithoutIcon>

                    <DropdownWithoutIcon onClick={handleSignOut}>
                      <div className="flex items-center py-3 px-4 dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors w-full dark:hover:text-white">
                        <LogOutIcon className="mr-2" />
                        <span className="text-lg">CERRAR SESIÓN</span>
                      </div>
                    </DropdownWithoutIcon>
                  </div>
                )}
              </div>
            </CSSTransition>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export default MobileNav;
