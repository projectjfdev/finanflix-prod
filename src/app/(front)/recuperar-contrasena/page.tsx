'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LogIn, Shield, Mail, Key, HelpCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import FormForgotPassword from '@/components/FormForgotPassword/FormForgotPassword';

export default function PasswordRecoveryPage() {
  const steps = [
    {
      icon: Mail,
      text: 'Introduce tu correo registrado en el antiguo sitio de Finanflix.',
    },
    {
      icon: Key,
      text: 'Recibirás un enlace para establecer una nueva contraseña.',
    },
    {
      icon: LogIn,
      text: 'Accede a la nueva plataforma con tu contraseña actualizada.',
    },
  ];

  const passwordFaqs = [
    {
      question: '¿Tienes dudas?',
      answer:
        'Si necesitas ayuda durante el proceso, nuestro equipo de soporte está aquí para asistirte.',
    },
    {
      question: 'No perdiste tus datos',
      answer:
        'Tu cuenta y progreso en Finanflix siguen intactos. Solo necesitas actualizar tu contraseña para acceder.',
    },
    {
      question: 'Seguridad mejorada',
      answer:
        'Este cambio asegura que tus datos estén protegidos con los más altos estándares de seguridad.',
    },
    {
      question: '¿Por qué necesito crear una nueva contraseña?',
      answer:
        'El antiguo sitio de Finanflix ya no existe, y hemos lanzado una nueva plataforma. Por seguridad, no migramos las contraseñas antiguas.',
    },
    {
      question: '¿Qué pasa si no tengo acceso al correo con el que me registré?',
      answer:
        'Contáctanos directamente con tu nombre y detalles de tu cuenta anterior. Haremos lo posible para verificar tu identidad.',
    },
    {
      question: '¿Mis datos y progreso están guardados?',
      answer:
        'Sí, toda tu información sigue segura en la nueva plataforma. Solo necesitas actualizar tu contraseña.',
    },
  ];

  return (
    <div className="min-h-screend dark:bg-background bg-white px-4 sm:px-0">
      <main className="  dark:bg-background bg-white">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-3 md:mb-4 dark:text-white text-black">
            Recupera tu acceso a Finanflix
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-8 w-full md:max-w-2xl md:mx-auto text-gray-600 leading-tight px-0 mx-0">
            Hemos renovado nuestra plataforma para brindarte una mejor experiencia. Si eres un
            usuario del antiguo sitio de Finanflix, sigue los pasos para crear una nueva contraseña.
          </p>
          <FormForgotPassword />

          <Card className="mt-8 flex flex-col justify-center items-center text-green-600 py-5 md:py-10 px-3  ">
            <div className="w-full flex justify-center items-center pb-3">
              <Shield className="hidden md:flex mr-2" size={24} />
              <span className="font-semibold text-2xl md:text-3xl">Tu seguridad, nuestra prioridad</span>
            </div>

            <span className="text-base md:text-lg max-w-4xl mx-auto text-gray-600 w-full dark:text-white ">
              Por razones de seguridad, las contraseñas de nuestro antiguo sitio no pudieron ser
              migradas. ¡Pero no te preocupes, es fácil recuperar tu acceso! Nuevo sitio, nuevas
              oportunidades. Finanflix ha evolucionado. Ahora contamos con una nueva base de datos
              para garantizar una experiencia más segura y eficiente.
            </span>
          </Card>
        </section>

        {/* Steps Section */}
        <section className="pt-8 dark:bg-background bg-white rounded-lg ">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center dark:text-white text-black">
            Pasos para recuperar tu acceso
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <>
                <Card key={index} className="flex flex-col items-center text-center p-5">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <step.icon className="text-black h-5 w-5 md:h-8 md:w-8" />
                  </div>
                  <p className="dark:text-white text-gray-700">{step.text}</p>
                  <div className="pt-3">
                    <p className="text-base text-gray-300">Paso {index + 1}</p>
                  </div>
                </Card>
              </>
            ))}
          </div>
          <div className="mt-8 text-center space-y-5">
            <p className="dark:text-white text-gray-600 flex items-center justify-center text-base md:text-lg ">
              <HelpCircle size={20} className="mr-2 w-4 h-4 md:w-5 md:h-5" />
              ¿No recuerdas tu correo?{' '}
            </p>

            <Link
              target="_blank"
              className="dark:text-white dark:hover:text-gray-300 text-gray-600 flex items-center justify-center text-base md:text-lg"
              href={
                'https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0'
              }
            >
              Contáctanos y te ayudaremos a recuperar tu cuenta.
            </Link>
          </div>
        </section>

        {/* Password FAQ Section */}

        <section className="w-full">
          <div className="py-5 md:pb-10 pt-8 md:pt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4  text-center  font-poppins ">
              Preguntas frecuentes para recuperar tu clave
            </h2>
            <Card className=" dark:bg-background dark:text-white text-black">
              <CardContent className="px-6 py-1 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {passwordFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="w-full last:border-b-0">
                      <AccordionTrigger className="text-md md:text-lg font-semibold w-full">
                        <div className="flex justify-between items-center w-full text-start font-poppins text-sm md:text-base ">
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 font-poppins">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Motivational Message Section */}

      </main>
    </div>
  );
}
