'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

export default function ResetNextOnLoad() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const next = searchParams.get('next');

    if (next !== '0') {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('next', '0');

      const newUrl = `${pathname}?${newParams.toString()}#filtros`;

      // Reemplazar la URL
      window.history.replaceState(null, '', newUrl);

      // Scroll suave hacia el filtro
      setTimeout(() => {
        const anchor = document.getElementById('filtros');
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  }, [pathname]);

  return null;
}
