'use client';

import { useState } from 'react';
import { Home, Book, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function BottomNavigation() {
  const [active, setActive] = useState('Home');
  const { data: session } = useSession()

  return (
    <div className="fixed bottom-0 left-0 flex flex-col pt-5 w-screen ml-[calc(-50vw+50%)] sm:hidden ">
      {/* Bottom navigation */}
      <nav className="bg-background rounded-t-3xl shadow-[0_-4px_10px_0_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_10px_0_rgba(0,0,0,0.2)] ">
        <ul className="flex flex-row justify-between items-center py-2 text-center">

          <li className="flex-1">
            <Link
              href={'/'}
              onClick={() => setActive('Inicio')}
              className={cn(
                'flex flex-col items-center justify-center w-full py-2',
                active === 'Inicio'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Inicio</span>
            </Link>
          </li>

          <li className="flex-1">
            <Link
              href={`${session ? '/programas' : '/login'}`}
              onClick={() => setActive('Mis Programas')}
              className={cn(
                'flex flex-col items-center justify-center w-full py-2',
                active === 'Mis Programas'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <Book className="h-6 w-6" />
              <span className="text-xs mt-1">Mis Programas</span>
            </Link>
          </li>

          <li className="flex-1">
            <Link
              href={`${session ? '/editar-perfil' : '/login'}`}
              onClick={() => setActive('Tu cuenta')}
              className={cn(
                'flex flex-col items-center justify-center w-full py-2',
                active === 'Tu cuenta'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Tu cuenta</span>
            </Link>
          </li>

        </ul>
        <div className="w-full text-center pb-2 ">
          <img
            className="mx-auto"
            src="https://res.cloudinary.com/drlottfhm/image/upload/v1750865815/Rectangle_u3vipx.png"
            alt=""
          />
        </div>
      </nav>
    </div>
  );
}
