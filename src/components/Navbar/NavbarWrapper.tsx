'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import { useEffect, useState } from 'react';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768); // ejemplo: hasta 768px es mobile
    }
    handleResize(); // set inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add paths where you want to hide the navbar
  const hiddenNavbarPaths = ['/suscripcion', '/checkout', '/test'];

  // Si la ruta es editar-perfil y es mobile => ocultar
  if (pathname === '/editar-perfil' && isMobile) {
    return null;
  }

  // Check if current path is in the hidden paths list
  const shouldHideNavbar = hiddenNavbarPaths.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Only render the Navbar if it shouldn't be hidden
  // esta linea oculta el navbar
  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
}
