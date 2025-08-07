'use client';

import { useState } from 'react';
import { Home, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Home' },
  { icon: Search, label: 'Search' },
  { icon: Bell, label: 'Notifications' },
  { icon: User, label: 'Profile' },
];

export default function Component() {
  const [active, setActive] = useState('Home');

  return (
    <div className="h-screen flex flex-col">
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Current Page: {active}</h1>
        <p>Your main content goes here.</p>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-background border-t border-border">
        <ul className="flex justify-around">
          {menuItems.map(item => (
            <li key={item.label} className="flex-1">
              <button
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
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
