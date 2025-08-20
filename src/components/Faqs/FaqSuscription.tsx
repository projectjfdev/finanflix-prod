import { FaqAccordion } from '@/components/ui/faq-suscription';

const defaultData = [
  {
    answer:
      'Tu suscripción continuará sin problemas después de 30 días, pero puedes cancelarla en cualquier momento.',
    id: 1,
    question: '¿Qué sucede cuando finalice mi prueba gratuita de 30 días?',
  },
  {
    answer:
      'Puedes cancelar fácilmente tu suscripción en cualquier momento comunicandote con nuestro soporte. Seguirás teniendo acceso a los cursos y comunidad hasta tu próxima fecha de facturación.',
    id: 2,
    question: '¿Puedo cancelar en cualquier momento?',
  },
  {
    answer:
      'Si tu pago falla te contactaremos mediante nuestro equipo de soporte para ayudarte a reestablecer tu suscripcion. Adicionalmente, podes pagar tu suscripcion de manera semestral o anual.',
    id: 3,
    question: '¿Qué sucede si mi pago falla?',
  },
  {
    id: 4,
    question: '¿Cómo puedo contactarme con el equipo de soporte?',
    answer: (
      <>
        Podes escribirnos vía WhatsApp por{' '}
        <a
          href="https://finanflix.com/whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          className="underline  hover:text-gray-400"
        >
          https://finanflix.com/whatsapp
        </a>
        .
      </>
    ),
  },
];

function FaqSuscription() {
  return <FaqAccordion data={defaultData} className="max-w-[700px]" />;
}

function FaqSuscriptionStyle() {
  return (
    <FaqAccordion
      data={defaultData || []}
      className="max-w-[700px] "
      questionClassName="bg-background hover:bg-background"
      answerClassName="bg-secondary text-secondary-foreground"
    />
  );
}

export { FaqSuscription, FaqSuscriptionStyle };
