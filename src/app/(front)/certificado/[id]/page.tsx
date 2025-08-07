'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCourseById } from '@/utils/Endpoints/coursesEndpoint';
import { ICourse } from '@/interfaces/course';
import Image from 'next/image';
import DownloadCertificate from '@/components/DownloadOrderPDF/DownloadCertificate';
import Confetti from 'react-confetti';
import BigTitle from '@/components/BigTitle/BigTitle';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';

export default function CertificateWithDownload() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isConfettiActive, setIsConfettiActive] = useState(true);

  const stopConfetti = useCallback(() => {
    setIsConfettiActive(false);
  }, []);

  const today = new Date();

  // Detener el confeti después de 5 segundos
  useEffect(() => {
    // Actualiza las dimensiones del confeti solo en el cliente
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      // Escucha cambios en el tamaño de la ventana
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);

      const timer = setTimeout(() => {
        stopConfetti();
      }, 10000);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }
  }, [stopConfetti]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await getCourseById(id.toString());
        setCourse(courseResponse);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center -z-40">
        {isConfettiActive && <Confetti width={dimensions.width} height={dimensions.height} />}
      </div>

      <div className="min-h-screen p-4 bg-background rounded-2xl pt-10 border">
        <div className="flex justify-end mb-4 space-x-4">
          <DownloadCertificate
            id={course?._id?.toString() as string}
            courseTitle={course?.title as string}
            username={session?.user.username as string}
            completionDate={today}
            courseLevel={course?.level as string}
          />
        </div>

        {/* certificate IMAGE */}
        <div
          ref={certificateRef}
          className="w-full xl:h-[700px] xl:w-[1000px] md:max-w-4xl mx-auto rounded-lg overflow-hidden relative"
        >
          {/* Background with bokeh effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900"></div>

          {/* Certificate Content */}
          <div className="relative z-10 p-8 flex flex-col items-center h-full">
            {/* CERTIFICADO heading */}
            <h1 className="text-white text-3xl md:text-4xl lg:text-6xl tracking-wider mb-2 mt-8 font-groteskBold15">
              CERTIFICADO
            </h1>

            {/* Course Title */}
            <h2 className="text-primary text-4xl md:text-6xl mb-8 text-center font-groteskBold10">
              {course?.title || 'Airdrops'}
            </h2>

            {/* Completion message */}
            <div className="text-center ">
              <p className="text-white text-xl font-groteskLight">
                ¡COMPLETASTE CORRECTAMENTE NUESTRO CURSO!
              </p>
              <p className="text-[#d0ced6] text-base max-w-2xl mx-auto mt-4 mb-8 font-groteskLight">
                Con estos conocimientos y habilidades, estás listo para participar en {''}
                {course?.title} y aprovechar las oportunidades en el mundo de las criptomonedas.
              </p>
            </div>

            {/* FINANFLIX branding */}
            <div className="mb-3">
              {/* <BigTitle
                title="FINANFLIX"
                className="text-white text-3xl font-bold tracking-wider"
              /> */}

              <Image
                src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702703/logo_gdl8ji.svg"
                className="h-[31.74px] w-[178.18px]  relative ml-1 hidden dark:flex"
                alt="Imagen de Finanflix Logo"
                width={550}
                height={150}
              />
            </div>

            {/* Student name */}
            <div className="border-b border-white border-1 w-9/12 text-center py-2 font-groteskMedium20">
              <p className="text-white text-xl">
                {session?.user.firstName + ' ' + session?.user.lastName ||
                  session?.user.username ||
                  'student_name'}
              </p>
            </div>

            {/* Signatures */}
            <div className="flex justify-center w-full max-w-2xl mt-10">
              {/* <div className="text-center">
                <div className="h-16 mb-2 relative bottom-10">
                  <Image
                    src="https://res.cloudinary.com/drlottfhm/image/upload/v1750704063/firma-murua_uqeneq.png"
                    width={200}
                    height={60}
                    alt="Signature"
                    className="mx-auto"
                  />
                </div>
                <div className="border-t border-gray-600 w-40 mx-auto pt-2">
                  <h4 className="text-white font-groteskMedium20">JUAN IGNACIO MURUA</h4>
                  <p className="text-[#d0ced6] text-sm">CEO</p>
                </div>
              </div> */}

              <div className="text-center">
                <div className="h-16 mb-2 relative bottom-10">
                  <Image
                    src="https://res.cloudinary.com/drlottfhm/image/upload/v1750704061/firma-facundo_l8uq2b.png"
                    width={200}
                    height={60}
                    alt="Signature"
                    className="mx-auto"
                  />
                </div>
                <div className="border-t border-gray-600 w-40 mx-auto pt-2">
                  <h4 className="text-white font-groteskMedium20">FACUNDO ZAMORA</h4>
                  <p className="text-[#d0ced6] text-sm">CEO</p>
                </div>
              </div>
            </div>

            {/* Decorative elements - colored arrows */}
            {/* <div className="absolute bottom-8 left-8">
              <div className="flex flex-col space-y-1">
                <div className="w-16 h-6 bg-red-500 skew-x-12 transform"></div>
                <div className="w-16 h-6 bg-blue-600 skew-x-12 transform"></div>
                <div className="w-16 h-6 bg-purple-500 skew-x-12 transform"></div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
