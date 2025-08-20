'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Login } from '@/components/Auth/Login';
import { Register } from '@/components/Auth/Register';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import FooterColorSetter from '@/components/Footer/FooterColorSetter';

const PageAuth = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'registrarse'>('login');

  return (
    <>
      <div className='px-4 sm:px-0'>
        <div className="w-full">
          <Card className="hover:shadow-lg transition-shadow duration-300  card-with-animated-border">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-center space-x-4 mb-4 w-full">
                <div className="flex justify-center gap-2 items-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-center w-full dark:text-white text-black">
                    Importante
                  </h3>
                </div>
              </div>
              <p className="mb-4 text-sm px-3 md:px-0 md:text-lg text-center dark:text-white text-black">
                Si ya tienes una cuenta en la versión anterior de la web, restablece tu contraseña
                para activarla.
              </p>

              <div className=" dark:text-white text-black w-full flex justify-center">
                <Button
                  onClick={() => router.push('/recuperar-contrasena')}
                  className="w-3/4 lg:mx-auto lg:w-1/3 bg-primary text-white dark:hover:bg-[rgba(240, 52, 0, 1)] hover:text-white py-6 text-xs md:text-sm "
                >
                  RECUPERAR CONTRASEÑA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col justify-center items-center h-full  ">
          <div className="w-full flex justify-center mt-9">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'registrarse')} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  className="py-3 rounded-full border border-[#FFFFFF4D] text-xs md:text-sm dark:hover:bg-gray-800"
                  value="login"
                >
                 INGRESAR
                </TabsTrigger>
                <TabsTrigger
                  className="py-3 rounded-full border text-xs md:text-sm border-[#FFFFFF4D] dark:hover:bg-gray-800"
                  value="registrarse"
                >
                  REGISTRARSE
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Login switchToRegister={() => setActiveTab('registrarse')} />
              </TabsContent>
              <TabsContent value="registrarse">
                <Register />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <FooterColorSetter color="bg-[#F3F4F6]" />
    </>
  );
};

export default PageAuth;
