'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCourseById } from '@/utils/Endpoints/coursesEndpoint';
import { ICourse } from '@/interfaces/course';
import { Loading } from '@/utils/Loading/Loading';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';

const CertificateWithDownload: React.FC = () => {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<ICourse>();
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await getCourseById(id.toString());
        setCourse(courseResponse);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownloadCertificatePDF = () => {
    if (certificateRef.current) {
      const canvas = certificateRef.current;
      const pdfData = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = pdfData;
      link.download = 'certificate.png';
      link.click();
    }
  };

  const drawCertificate = () => {
    if (certificateRef.current && session?.user) {
      const canvas = certificateRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Fondo
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#ff6a00');
      gradient.addColorStop(1, '#ffd700');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Título
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificado de Finalización', width / 2, 80);

      // Nombre del curso
      ctx.font = '24px Arial';
      ctx.fillText(course?.title || 'Curso no disponible', width / 2, 150);

      // Nombre del usuario
      ctx.font = '20px Arial';
      ctx.fillText(`Otorgado a: ${session.user.username}`, width / 2, 220);

      // Pie de página
      ctx.font = '14px Arial';
      ctx.fillText('Finanflix', width / 2, height - 30);
    }
  };

  useEffect(() => {
    drawCertificate();
  }, [course]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-r from-primary via-red-500 to-gray-500 pt-10">
      <div className="flex justify-end mb-4 space-x-4">
        <Button
          onClick={handleDownloadCertificatePDF}
          variant="outline"
          className="text-white shadow-xl hover:bg-white hover:text-black transition-colors"
        >
          <FileDown className="mr-2 h-4 w-4" />
          <span className="text-[12px]">Descargar Certificado</span>
        </Button>
      </div>

      <div className="flex justify-center">
        <canvas ref={certificateRef} width={1000} height={700} className="rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default CertificateWithDownload;
