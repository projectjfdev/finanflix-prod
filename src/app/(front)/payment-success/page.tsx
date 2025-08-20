'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { BookOpen, Video, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Toaster } from 'sonner';
import Faq from '@/components/Faqs/Faqs';
import { UserCounter } from '@/components/UserCounter/UserCounter';
import BigTitle from '@/components/BigTitle/BigTitle';

export default function PaymentSuccessPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen dark:bg-card bg-white font-poppins rounded-lg  relative w-full">
      <div className="fixed top-0 left-0 w-screen h-screen -z-50">
        <Confetti width={dimensions.width} height={dimensions.height} recycle={false} />
      </div>

      <main className="container mx-auto  md:px-5 py-10">
        {/* <h1 className="font-poppins text-4xl md:text-5xl lg:text-7xl w-full font-bold text-center dark:text-white text-black mb-5 xl:mb-10 transition-transform duration-500 ease-out delay-1 ">
          ¡Bienvenido a Finanflix!
        </h1> */}

        <BigTitle
          className="mb-5  font-poppins text-4xl md:text-5xl lg:text-7xl w-full font-bold text-center dark:text-white text-black transition-transform duration-500 ease-out delay-1 "
          title="¡Bienvenido a Finanflix!"
        />

        <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-600 font-poppins ">
          Tu pago ha sido procesado con éxito.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl  text-center text-gray-600 font-poppins ">
          Prepárate para transformar tu futuro financiero.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-600 font-poppins ">
          Revisa tu correo electronico para obtener los datos y poder completar tu compra.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 py-5 md:py-10  font-poppins">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-background font-poppins mx-auto py-5   md:py-10  w-3/4">
            <CardHeader className="px-6 pt-6 pb-0 sm:p-6">
              <CardTitle className="flex items-center text-lg lg:text-2xl">
                <BookOpen className="mr-3 w-6 h-6 md:h-8 md:w-8 dark:text-white text-black font-poppins " />
                Ir a Cursos
              </CardTitle>
              <CardDescription className="text-md  md:text-xl font-poppins">
                Participa en nuestras sesiones interactivas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Link href={'/mis-cursos'} className="cursor-pointer">
                <div className="w-full text-sm md:text-md lg:text-lg py-2 sm:py-3 text-white font-poppins bg-primary dark:hover:bg-[#d03400] rounded-full flex justify-center items-center">
                  Comenzar a aprender
                  <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-background font-poppins mx-auto  md:py-10  w-3/4">
            <CardHeader className="px-6 pt-6 pb-0 sm:p-6 ">
              <CardTitle className="flex items-center  text-md md:text-lg lg:text-2xl">
                <Video className=" md:text-md mr-3 w-6 h-6 md:h-8 md:w-8 dark:text-white text-black  font-poppins " />
                Ir a Clases en Vivo
              </CardTitle>
              <CardDescription className="text-md  md:text-xl font-poppins">
                Participa en nuestras sesiones interactivas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Link href={'/clases-en-vivo'}>
                <div className="w-full text-sm md:text-md lg:text-lg py-2 sm:py-3 text-white font-poppins dark:hover:bg-[#d03400] bg-primary rounded-full flex justify-center items-center">
                  Ver próximas clases
                  <ChevronRight className="ml-2 h-5 w-5" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <Toaster />
        </div>

        <UserCounter />
        <Testimonials />
        <Faq />
      </main>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: 'Ana Giuseppi.',
      text: 'Finanflix cambió mi perspectiva sobre las finanzas personales. ¡Altamente recomendado!',
    },
    {
      name: 'Carlos Maure.',
      text: 'Los cursos son increíblemente detallados y las clases en vivo son una excelente manera de resolver dudas.',
    },
    {
      name: 'Agus Piniera.',
      text: 'Gracias a Finanflix, ahora me siento más seguro al tomar decisiones financieras.',
    },
  ];

  return (
    <div className="md:mb-5 lg:my-5  mx-5 md:mx-0">
      {/* <h2 className="text-2xl md:text-3xl font-bold mb-10  pt-10 md:pt-0 text-center font-poppins">
        Lo que dicen nuestros estudiantes
      </h2> */}
      <div className="grid md:grid-cols-2  xl:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className=" dark:bg-background transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <p className="italic mb-4 text-md md:text-lg font-poppins dark:text-white text-black">
                "{testimonial.text}"
              </p>
              <p className="font-semibold text-right dark:text-white text-black text-md md:text-lg font-poppins">
                - {testimonial.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
