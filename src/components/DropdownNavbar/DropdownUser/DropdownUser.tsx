import React, { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ListItem } from '@/components/Navbar/Navbar';
import { Headset, LogOutIcon, ShieldCheck, User } from 'lucide-react';
import { adminMenu, userMenu } from './UserAccesses';
import { Button } from '@/components/ui/button';

export const DropdownUser = () => {
  const { data: session } = useSession();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const hasSubscription =
    session?.user?.suscription?.status === 'active' &&
    new Date(session?.user?.suscription?.endDate) > new Date();

  const hasOrders = !!session?.user?.orders?.length;

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
    <NavigationMenu className="hidden 2xl:flex">
      <NavigationMenuItem className="flex justify-center items-center">
        {/* USER AVATAR  MENU */}
        <NavigationMenuTrigger className="p-0 m-0 dark:text-white text-black relative">
          <div className="relative inline-block">
            <Avatar className="h-[38px] w-[38px] p-0 m-0">
              <AvatarImage
                src={
                  session?.user?.profileImage?.url ||
                  'https://res.cloudinary.com/drlottfhm/image/upload/v1750703606/noImgProfile_nkbhbr.png'
                }
                alt="profile finanflix"
              />
              <AvatarFallback>{session?.user?.firstName?.substring(0, 2) || 'CN'}</AvatarFallback>
            </Avatar>
          </div>
        </NavigationMenuTrigger>

        {/* CONTAINER USER AND ADMIN MENU  */}
        <NavigationMenuContent className="rounded-3xl">
          {hasSubscription && (
            <div className="bg-primary text-center text-sm font-bold shadow-lg text-white py-2">
              {session?.user?.suscription.type}
            </div>
          )}
          <ul className="py-3 w-[270px] dark:bg-[#282844]">
            <div className="text-xl font-[500] dark:text-white text-black mx-8">
              Bienvenido, {session?.user && session?.user.username}
            </div>
            <Separator className="my-2 dark:bg-gray-700" />

            <div className="mx-8">
              {isUserAdmin ? (
                <div className="flex flex-col items-center text-center  font-semibold dark:text-white text-black">
                  <div className="h-[40px] w-full">
                    <ListItem href={`/editar-perfil`}>
                      <div className=" h-full flex flex-col justify-center items-center w-full ">
                        <span className="dark:hover:text-[#A7A7A7] hover:text-[#535353] text-md w-full dark:text-white text-black mx-0 px-0 flex gap-2 items-center">
                          <User size={16} />
                          Cuenta
                        </span>
                      </div>
                    </ListItem>
                  </div>
                  <div className="h-[40px] w-full">
                    <ListItem href={`/dashboard`}>
                      <div className=" h-full flex flex-col justify-center items-center w-full ">
                        <span className="dark:hover:text-[#A7A7A7] hover:text-[#535353] text-[17px] w-full dark:text-white  mx-0 px-0 flex gap-2 items-center text-black">
                          <ShieldCheck size={16} />
                          Panel Administrador
                        </span>
                      </div>
                    </ListItem>
                  </div>

                  {/* Menú normal para usuarios no administradores */}

                  {adminMenu.map((bMenu, index) => (
                    <div key={index} className="h-[40px] w-full">
                      <ListItem href={`${bMenu.href}`}>
                        <div className="h-full flex flex-col justify-center items-center w-full">
                          <span className="dark:hover:text-[#A7A7A7] hover:text-[#535353] text-[17px] w-full dark:text-white text-black mx-0 px-0 flex gap-2 items-center">
                            {bMenu.icon}
                            {bMenu.title}
                          </span>
                        </div>
                      </ListItem>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="h-[40px] w-full ">
                    <ListItem href={'/editar-perfil'}>
                      <div className="h-full flex flex-col justify-center items-center w-full">
                        <span className="dark:hover:text-[#A7A7A7] text-lg w-full dark:text-white text-black mx-0 px-0 flex gap-2 items-center">
                          <User size={18} /> Cuenta
                        </span>
                      </div>
                    </ListItem>
                  </div>

                  {/* PROVISORIO MENU PARA DASHBOARD ACCESIBLE PARA TODOS */}

                  {userMenu
                    .filter(
                      bMenu => {
                        // Filter out "Suscripciones" if user has a subscription
                        if (hasSubscription && bMenu.title === 'Suscripciones') {
                          return false;
                        }

                        // Only show "Clases en Vivo" if user has a subscription
                        if (bMenu.title === 'Clases en Vivo' && !hasSubscription) {
                          return false;
                        }
                        // Only show "Mis Ordenes" if user has orders
                        if (bMenu.title === 'Órdenes' && !hasOrders) {
                          return false;
                        }

                        return true;
                      }
                    )
                    .map((bMenu, index) => (
                      <div key={index} className="h-[40px] w-full">
                        <ListItem href={`${bMenu.href}`}>
                          <div className="h-full flex flex-col justify-center items-center w-full">
                            <span className="dark:hover:text-[#A7A7A7] hover:text-[#3a3939] text-lg w-full dark:text-white text-black mx-0 px-0 flex gap-2 items-center">
                              {bMenu.icon}
                              {bMenu.title}
                            </span>
                          </div>
                        </ListItem>
                      </div>
                    ))}

                  <div>
                    <div className="h-[40px] w-full">
                      <ListItem
                        href={
                          'https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0'
                        }
                        target="_blank"
                      >
                        <div className="h-full flex flex-col justify-center items-center w-full">
                          <span className="dark:hover:text-[#A7A7A7]  text-[17px] w-full dark:text-white hover:text-[#3a3939] text-black mx-0 px-0 flex gap-2 items-center">
                            <Headset size={18} /> Soporte
                          </span>
                        </div>
                      </ListItem>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* LOGOUT MENU */}

            <div className="h-auto w-full dark:hover:text-[#A7A7A7] hover:text-[#535353] mx-8 mb-4">
              <div className="flex gap-2 ">
                <Button
                  onClick={handleSignOut}
                  className="text-lg p-0 m-0 dark:bg-transparent bg-transparent dark:text-white shadow-none border-none text-black hover:bg-transparent"
                >
                  <LogOutIcon size={16} />
                </Button>
                <Button
                  className=" text-[17px] hidden dark:hover:text-[#A7A7A7] hover:text-[#535353] md:block p-0 m-0 rounded-none dark:bg-transparent bg-transparent border-none shadow-none dark:text-white text-black hover:bg-transparent"
                  onClick={handleSignOut}
                >
                  <ListItem>
                    <div className="h-full flex flex-col justify-center items-center w-full ">
                      <span className="dark:hover:text-[#A7A7A7] hover:text-[#535353] text-lg w-full dark:text-white text-black mx-0 px-0 flex gap-2 items-center">
                        Cerrar Sesión
                      </span>
                    </div>
                  </ListItem>
                </Button>
              </div>
            </div>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};
