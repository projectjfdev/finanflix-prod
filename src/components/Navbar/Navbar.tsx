'use client';

import { Search, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './MobileNav';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SearchBox } from '../SearchBox/SearchBox';
import { DropdownNoti } from '../DropdownNavbar/DropdownNoti';
import { DropdownUser } from '../DropdownNavbar/DropdownUser/DropdownUser';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { UniteADiscord } from '../Modal/UniteADiscord';
import { useRouter } from 'next/navigation';
import LogoSvg from '@/utils/LogoSvg';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Navbar() {
  const [openSearch, setOpenSearch] = useState(false);
  const pathname = usePathname();
  const [isJoined, setIsJoined] = useState(false);
  const { data: session, status } = useSession();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollThreshold] = useState(200);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 500px)');
  const [checkingMembership, setCheckingMembership] = useState(true);

  const handleModalDiscord = () => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated') {
      handleDiscordOpenModal();
      return;
    }
  };

  const handleDiscordOpenModal = () => setIsDiscordModalOpen(true);
  const handleDiscordCloseModal = (open: boolean) => setIsDiscordModalOpen(open);

  // verificamos si el usuario se encuentra en el servidor mediante
  const checkDiscordMembership = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/discord/user-in-server');
      const data = await res.json();

      setIsJoined(data.isMember);
      //console.log(data.isMember);

      return data.isMember;
    } catch (error) {
      console.error('Error al verificar la membresía de Discord:', error);
      return false;
    } finally {
      setCheckingMembership(false);
    }
  };

  useEffect(() => {
    if (session) {
      checkDiscordMembership();
    }
  }, [session]);

  const handleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };

  // Updated useEffect for scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;

      if (currentScrollPos > scrollThreshold) {
        setVisible(!isScrollingDown);
      } else {
        setVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, scrollThreshold]);


  return (
    <div className="w-full flex justify-center pb-[101px] md:pb-32 ">
      <UniteADiscord
        isActive={
          session?.user?.suscription?.status === 'active' &&
          new Date(session?.user?.suscription?.endDate) > new Date()
        }
        isOpen={isDiscordModalOpen}
        onOpenChange={handleDiscordCloseModal}
      />
      <section
        className={cn(
          'fixed z-50 w-full md:w-[70.9vw] transition-all duration-300 ease-in-out px-4 md:px-0',
          visible ? 'top-4' : '-top-full'
        )}
      >
        <div className="bg-[#5328C1] rounded-3xl">
          <nav className="h-[67px] pl-9 flex items-center justify-between sticky">
            <div className="w-full">
              <div className="flex justify-between h-full w-full">
                <div className="flex justify-center items-center ">
                  {/* Logo */}
                  <Link href={'/'} className="flex-shrink-0 w-auto h-auto">
                    {/* Mobile Menu Button */}
                    {/* <MobileNav className="hidden dark:text-white text-white" /> */}
                    <div className="block 2xl:block relative w-[170px] h-[24px]">
                      <LogoSvg className="w-[165px] h-[24px] sm:w-auto sm:h-auto" />
                    </div>
                  </Link>
                  {/* DESK NAVIGATION LINKS */}
                  {/* TODO */}
                  <div className="hidden 2xl:flex flex-wrap ml-[82px] mt-4 justify-center flex-col items-center">
                    <NavigationMenu className="relative bottom-2">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          {session && (
                            <>
                              <Link
                                href={'/'}
                                className={cn(
                                  'font-bold text-[14px] mr-11',
                                  pathname === '/' ? 'text-white' : 'text-[#9186BC]',
                                  'hover:text-[#E7E3E3]'
                                )}
                              >
                                Inicio
                              </Link>
                              <Link
                                href={'/programas'}
                                className={cn(
                                  'font-bold text-[14px] mr-11',
                                  pathname === '/programas' ? 'text-white' : 'text-[#9186BC]',
                                  'hover:text-[#E7E3E3]'
                                )}
                              >
                                Mis Programas
                              </Link>

                              {!checkingMembership && !isJoined && (
                                <Button
                                  variant="ghost"
                                  onClick={handleModalDiscord}
                                  className={cn(
                                    'font-bold text-[#9186BC] hover:text-[#E7E3E3] font-grotesk20  text-[14px] mr-11 bg-transparent hover:bg-transparent p-0 m-0'
                                  )}
                                >
                                  Comunidad
                                </Button>
                              )}
                            </>
                          )}
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </div>
                {/* Right side icons (Search, Notifications, User Profile) */}
                <div className="flex md:items-center relative">
                  {/* Asegúrate de que el contenedor tenga relative */}
                  <div className="flex items-center space-x-4">
                    {/* Theme Switcher */}
                    {openSearch ? (
                      <div className="flex items-center gap-1 hover:text-[#E7E3E3] text-[#BCBCBC] cursor-pointer bg-[#4a3a8b] rounded-full px-3 py-1">
                        <Search className="w-4 h-4 md:w-5 md:h-5" />
                        <SearchBox />
                        <Button className="rounded-full p-1 m-0 text-xs h-fit">
                          <X onClick={handleOpenSearch} size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-8 items-center">
                        <div className="hidden lg:flex">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Search
                                  className="h-5 w-5 md:w-6 md:h-6 cursor-pointer hover:text-[#E7E3E3] text-[#BCBCBC]"
                                  onClick={handleOpenSearch}
                                />
                              </TooltipTrigger>
                              <TooltipContent>Buscar</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* {session && (
                          <div className="lg:flex">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownNoti />
                                </TooltipTrigger>
                                <TooltipContent>Notificaciones</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )} */}

                        {/* User Profile */}
                        {status === 'unauthenticated' ? (
                          <Link href={'/login'}>
                            <User className="hidden h-4 w-4 md:w-6 md:h-6 cursor-pointer hover:text-gray-500 text-white xl:flex" />
                          </Link>
                        ) : (
                          <DropdownUser />
                        )}
                      </div>
                    )}

                    <div className="pl-3 ">
                      <MobileNav className="lg:flex 2xl:hidden text-white pr-9" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
{
  /* COMPONENTE LISTITEM */
}
export const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <li className="h-full ">
        <a
          ref={ref}
          className={cn(
            'first-line:block select-none h-full  rounded-md leading-none no-underline outline-none transition-colors  ',
            className
          )}
          {...props}
        >
          <div className="text-[1.25rem] leading-none ">{title}</div>

          <div className="line-clamp relative h-full  flex items-center leading-snug text-muted-foreground flex-grow m-0 ">
            {children}
          </div>
        </a>
      </li>
    </NavigationMenuLink>
  );
});

ListItem.displayName = 'ListItem';
