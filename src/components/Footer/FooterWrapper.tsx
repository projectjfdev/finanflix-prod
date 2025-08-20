'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer/Footer'

interface FooterWrapperProps {
    footerBgColor?: string
}

export default function FooterWrapper({ footerBgColor = 'bg-white' }: FooterWrapperProps) {
    const pathname = usePathname()

    // Rutas donde el footer no debe mostrarse
    const hiddenFooterPaths = [
        '/suscripcion',
        '/checkout',
    ]

    // Verifica si la ruta actual está en la lista o es subruta
    const shouldHideFooter = hiddenFooterPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    )

    if (shouldHideFooter) {
        return null
    }

    return <Footer bgColor={footerBgColor} />
}
