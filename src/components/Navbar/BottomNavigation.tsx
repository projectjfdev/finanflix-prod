'use client';

import { useState } from 'react';
import { Home, Book, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const menuItems = [
  { icon: Home, label: 'Inicio', src: '/' },
  { icon: Book, label: 'Mis Programas', src: '/programas' },
  { icon: User, label: 'Tu cuenta', src: '/editar-perfil' },
];

export default function BottomNavigation() {
  const [active, setActive] = useState('Home');

  return (
    <div className="fixed bottom-0 left-0 flex flex-col pt-5 w-screen ml-[calc(-50vw+50%)] sm:hidden ">
      {/* Bottom navigation */}
      <nav className="bg-background rounded-t-3xl shadow-[0_-4px_10px_0_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_10px_0_rgba(0,0,0,0.2)] ">
        <ul className="flex flex-row justify-between items-center py-2 text-center">
          {menuItems.map(item => (
            <li key={item.label} className="flex-1">
              <Link
                href={item.src}
                onClick={() => setActive(item.label)}
                className={cn(
                  'flex flex-col items-center justify-center w-full py-2',
                  active === item.label
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
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
