'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar/Navbar'

export default function NavbarWrapper() {
  const pathname = usePathname()

  // Add paths where you want to hide the navbar
  const hiddenNavbarPaths = [
    '/suscripcion',
    '/checkout',

  ]

  // Check if current path is in the hidden paths list
  const shouldHideNavbar = hiddenNavbarPaths.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // Only render the Navbar if it shouldn't be hidden
  // esta linea oculta el navbar
  if (shouldHideNavbar) {
    return null
  }

  return <Navbar />
}
