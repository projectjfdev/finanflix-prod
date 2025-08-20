import { Metadata } from 'next';
import CheckoutClient from '@/components/Checkout/checkout-client';

// Función para generar metadatos dinámicos basados en el ID del curso y el paso actual
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step?: string };
}): Promise<Metadata> {
  // Determinar el paso actual del checkout
  const currentStep = searchParams.step || 'default';

  // Personalizar título y descripción según el paso
  let title = 'Finalizar inscripción';
  let description = 'Finaliza tu inscripcion a Finanflix de manera segura.';

  if (currentStep === 'billing') {
    title = 'Información de pago - Finalizar inscripción';
    description = 'Completa tus datos de facturación para finalizar tu inscripción en Finanflix.';
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://finanflix.com/checkout/${params.id}?step=${currentStep}`,
      siteName: 'Finanflix',
      images: [
        {
          url: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
          width: 1200,
          height: 630,
          alt: 'Finanflix Logo',
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@finanflix',
      creator: '@finanflix',
      images: ['https://finanflix.com/wp-content/uploads/2025/05/Banner-horizontal-Finanflix.jpeg'],
    },
    icons: {
      icon: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
      shortcut: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
      apple: 'https://finanflix.com/wp-content/uploads/2023/01/iconos_finanflix-03.png',
    },
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step?: string };
}) {
  return <CheckoutClient id={params.id} step={searchParams.step} />;
}
