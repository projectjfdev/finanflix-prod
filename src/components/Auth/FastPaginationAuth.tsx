import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { getUserByEmail } from '@/utils/Endpoints/adminEndpoints';
import { signIn } from 'next-auth/react';
import { registerUser } from '@/utils/Endpoints/authEndpoints';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loading } from '@/utils/Loading/Loading';
import { CheckCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import './Login.css';
import { Label } from '../ui/label';

export const FastPaginationAuth = () => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('Ingrese un correo válido');
  const [valueUser, setValueUser] = useState<any>(undefined);
  const [searchValue, setSearchValue] = useState('');
  const [password, setPassword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(1);

  const getUsers = async (email: string) => {
    if (!email.trim()) {
      setValueUser(null);
      return;
    }

    setLoadingPage(true);
    try {
      const res = await getUserByEmail(email);
      setValueUser(res);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    } finally {
      setLoadingPage(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    if (!isValidEmail(newValue)) {
      setErrorMessage('Ingrese un correo válido');
      setValueUser('');
      return;
    }

    setErrorMessage('');

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      getUsers(newValue);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleNext = async () => {
    if (page === 2 && valueUser?.success) {
      if (!password.trim()) {
        toast.warning(`Por favor, ingresa una contraseña`);
        return;
      }

      const res = await signIn('credentials', {
        redirect: false,
        email: valueUser?.data?.email,
        password: password,
      });

      if (res?.error) {
        toast.warning(`Clave incorrecta, inténtalo nuevamente`);
        return;
      } else {
        toast(`Ingreso exitoso!`, {
          description: 'Bienvenido a Finanflix!',
          className: 'flex items-center justify-between bg-[#F3F4F6] text-black p-4',
          action: (
            <button
              className="flex items-center justify-center text-white rounded-full"
              style={{ marginLeft: '10px' }}
              onClick={() => toast.dismiss()}
            >
              <CheckCircle className="text-green-500 mr-2 " />
            </button>
          ),
        });
      }

      // console.log('✅ Sesión iniciada correctamente');
    }

    if (page === 2 && !valueUser?.success) {
      if (!password.trim()) {
        toast.warning(`Por favor, ingresa una contraseña`);
        return;
      }
      const newUsername = searchValue.split('@')[0] + Math.floor(1000 + Math.random() * 9000);

      const res = await registerUser('/api/auth/register', {
        email: searchValue,
        password: password,
        verified: true,
        username: newUsername,
      });
      if (res?.success) {
        // NO FUNCA
        const res = await signIn('credentials', {
          redirect: false,
          email: searchValue,
          password: password,
        });
        if (res?.error) {
          alert('Error al iniciar sesión. Verifica tus credenciales.');
          return;
        }
      }

      if (res?.error) {
        alert('Error al registrarse.');
        return;
      }

      // console.log('✅ Registro ok');
    }

    setPage(page + 1);
  };

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      if (searchValue.trim()) getUsers(searchValue);
    }, 500);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <Card className=" dark:text-white text-black px-3 font-poppins border border-none">
      {page === 1 && (
        <>
          <h2 className="pb-3 font-poppins font-extralight text-xs md:text-sm">
            PASO <span className="font-[500] ">1</span> DE <span className="font-[500]">4</span>
          </h2>
          <div className="blur-in">
            <p className="mb-1 md:mb-2 text-base md:text-xl">
              El momento es ahora. <span className=" md:inline">Empieza gratis.</span>
            </p>
            {/* <p className="mb-2 flex md:hidden text-base ">Empieza gratis</p> */}
            <div className="space-y-2">
              <Label className="dark:text-white text-black mb-3 md:text-base" htmlFor="newPassword">
                Email *
              </Label>
              <Input
                type="email"
                placeholder="Ingresa tu correo electronico"
                value={searchValue}
                onChange={handleChange}
                className="dark:bg-background bg-background w-full md:w-[80%] py-5 md:py-8 rounded-md md:text-lg dark:border-none border border-[#A7A7A7] "
              />
            </div>
            {errorMessage && (
              <div className="flex pt-2 w-fit ">
                <p className="text-red-600 text-sm ">{errorMessage}.</p>
                {loadingPage && <Loading size="15px" color="white" />}
              </div>
            )}
            {valueUser?.success && (
              <div className="pt-2">
                <p className="text-green-500 text-sm w-[80%]">
                  Accede con {valueUser?.data?.email}
                </p>
              </div>
            )}
          </div>
        </>
      )}
      {page === 2 && valueUser?.success && (
        <>
          <h2 className="pb-3 font-poppins font-extralight text-xs md:text-sm ">
            {' '}
            PASO <span className="font-[500]">2</span> DE <span className="font-[500]">3</span>
          </h2>
          <div className="blur-in space-y-2">
            <p className="pb-1 md:text-xl">Inicia sesión con tu contraseña</p>
            <Input
              placeholder="Ingresa tu contraseña"
              type="password"
              className="dark:bg-background bg-background w-full md:w-[80%]  py-5 md:py-8 rounded-md md:text-lg dark:border-none border border-[#A7A7A7]"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </>
      )}
      {page === 2 && !valueUser?.success && (
        <>
          <h2 className="pb-3 font-poppins font-extralight text-xs md:text-sm">
            {' '}
            PASO <span className="font-[500] ">2</span> DE <span className="font-[500]">3</span>
          </h2>
          <div className="blur-in space-y-2">
            <div>
              <p className="pb-1 text-lg md:text-xl">Crea una contraseña para comenzar.</p>
              <p className="sm:text-base">¡Ya falta poco! Estas a 30 segundos de comenzar.</p>
            </div>
            <Input
              placeholder="Agrega una contraseña"
              type="password"
              className="dark:bg-background bg-background w-full md:w-[80%] py-5 md:py-6 rounded-md md:text-lg dark:border-none border border-[#A7A7A7]"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </>
      )}
      <Toaster />
      <div className="flex flex-col gap-2 blur-in pt-3 md:w-[80%] ">
        {!errorMessage && (
          <Button
            // size={'xl'}
            className="rounded-md w-full text-xs sm:text-base  md:px-36 py-3 md:py-6"
            onClick={handleNext}
          >
            SIGUIENTE
          </Button>
        )}
        {page > 1 && (
          <Button
            className="rounded-md w-full text-xs sm:text-base md:px-36 py-3 md:py-6"
            onClick={() => setPage(page - 1)}
          >
            ATRAS
          </Button>
        )}
      </div>
    </Card>
  );
};
