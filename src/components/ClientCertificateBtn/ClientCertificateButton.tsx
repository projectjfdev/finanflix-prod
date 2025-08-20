
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

interface ClientCertificateButtonProps {
  courseId: string;
}

export function ClientCertificateButton({ courseId }: ClientCertificateButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="default"
      className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-md backdrop-blur-sm"
      onClick={e => {
        e.preventDefault(); // Detiene la propagación del clic al enlace padre
        router.push(`/certificado/${courseId}`);
      }}
    >
      <Download className="w-4 h-4 mr-2" /> <span className='text-xs sm:text-sm'>Descargar certificado</span>
    </Button>
  );
}
