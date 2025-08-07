//C:\Users\jeroa\Desktop\JeroAlderete\1 - Finanflix\finanflix-prod-dev\src\app\layout.tsx asd

import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Finanflix - Plataforma Educativa Financiera',
  description:
    'Aprende finanzas y economía con Finanflix. Cursos, programas y recursos para mejorar tu educación financiera.',
  openGraph: {
    title: 'Finanflix - Educación Financiera',
    description: 'Aprende finanzas y economía con Finanflix',
    images: [
      {
        url: 'https://res.cloudinary.com/drlottfhm/image/upload/v1750703986/finanflix-preview_mwwqfc.png',
      },
    ],
  },
  icons: {
    icon: 'https://res.cloudinary.com/drlottfhm/image/upload/v1750703990/icon-finanflix_yzaxur.png',
    apple:
      'https://res.cloudinary.com/drlottfhm/image/upload/v1750703990/icon-finanflix_yzaxur.png',
  },
};

export default async function RootLayoutGlobal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TEST: DEBERIA IR authOptions
  const session = await getServerSession();
  return (
    <html lang="en" className="dark">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
