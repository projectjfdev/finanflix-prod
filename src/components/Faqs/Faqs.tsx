import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Card, CardContent } from '../ui/card';

// faqs
export default function Faq() {
  const faqs = [
    {
      question: '¿Cómo accedo a mis cursos?',
      answer:
        'Una vez que hayas iniciado sesión en tu cuenta de Finanflix, verás un panel de control con todos tus cursos disponibles. Simplemente haz clic en el curso que deseas comenzar.',
    },
    {
      question: '¿Las clases en vivo quedan grabadas?',
      answer:
        'Sí, todas nuestras clases en vivo se graban y están disponibles para su visualización posterior en tu área de miembro.',
    },
    {
      question: '¿Puedo cancelar mi suscripción en cualquier momento?',
      answer: (
        <>
          Absolutamente. Puedes cancelar tu suscripción en cualquier momento ingresando{' '}
          <Link
            target="_blank"
            href="https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0"
            className="text-blue-500  uppercase no-underline hover:text-[#A7A7A7] font-poppins"
          >
            aquí
          </Link>
          . No hay contratos a largo plazo ni penalizaciones por cancelación.
        </>
      ),
    },
  ];

  return (
    <div className="py-5 md:py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-5 md:mb-10  text-center  font-poppins ">
        Preguntas Frecuentes
      </h2>
      <Card className="shadow-md dark:bg-background dark:text-white text-black">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="w-full">
                <AccordionTrigger className="text-md md:text-lg font-semibold w-full">
                  <div className="flex justify-between items-center w-full text-start font-poppins">
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 font-poppins text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
