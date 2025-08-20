'use client';

import { Input } from '../ui/input';

export const SearchBox = ({ actionForm = '' }: { actionForm?: string }) => {
  return (
    <form action={`/${actionForm}#filtros`} method="GET">
      <div className="flex gap-4">
        <Input
          className="w join-item w-72 border-none shadow-none focus:border-none focus:outline-none focus:ring-0 focus-visible:ring-0 text-xs sm:text-sm"
          placeholder="Buscar"
          name="q"
        />
      </div>
    </form>
  );
};
