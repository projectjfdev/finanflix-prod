'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BigTitle from '@/components/BigTitle/BigTitle';
import Faq from '@/components/Faqs/Faqs';

const topics = [
  { id: 'trade', title: 'Trade', resources: 3 },
  { id: 'interest-rate', title: 'Tasa de interés', resources: 3 },
  { id: 'insurance-tech', title: 'Tecnología de seguros', resources: 3 },
  { id: 'bank-transfer', title: 'Transferencia bancaria', resources: 3 },
];

interface TopicDefault {
  title: string;
  description: string;
  benefitsBold: string[];
  benefitsDescription: string[];
  footer: string;
}

interface TopicTrade {
  title: string;
  description: string;
  bold: string;
  benefits: string[];
  footer: string;
}

interface TopicInterestRate {
  title: string;
  description: string;
  benefits: string[];
  footer: string;
}

interface TopicInsuranceTech {
  title: string;
  description: string;
  benefits: string[];
  footer: string;
}

interface TopicBankTransfer {
  title: string;
  description: string;
  benefits: string[];
  footer: string;
}

type PropsTopicContent = {
  default: TopicDefault;
  trade: TopicTrade;
  'interest-rate': TopicInterestRate;
  'insurance-tech': TopicInsuranceTech;
  'bank-transfer': TopicBankTransfer;
};

const topicContent: PropsTopicContent = {
  default: {
    title: 'Explora los tópicos de FINANFLIX',
    description:
      'No importa si estás empezando, si ya tienes algo de experiencia, o si eres todo un experto, este glosario te será súper útil. Aquí encontrarás definiciones sencillas y claras de los términos más importantes que necesitas conocer para manejar tus finanzas como un profesional.',

    benefitsBold: [
      'Para tomar mejores decisiones:',
      'Para invertir mejor:',
      'Para mejorar tu bienestar financiero:',
    ],
    benefitsDescription: [
      'Entender los términos te ayuda a hacer elecciones financieras más inteligentes',
      'Con el conocimiento adecuado, podrás encontrar mejores oportunidades y gestionar tus inversiones de manera más efectiva',
      'Saber más sobre finanzas te ayuda a estar más seguro y estable económicamente.',
    ],
    footer:
      'Te invitamos a explorar este glosario y usarlo siempre que lo necesites mientras avanzas en nuestros cursos y aplicas lo que vas aprendiendo. ¡Prepárate para dominar el lenguaje financiero y llevar tus finanzas al siguiente nivel con FINANFLIX!',
  },
  trade: {
    title: 'Trade',
    description:
      'El trade se refiere a la compra y venta de activos financieros en los mercados. Es una actividad fundamental en el mundo de las finanzas y las inversiones.',
    bold: '',
    benefits: [
      'Comprender el trade te ayuda a tomar decisiones informadas en tus inversiones',
      'Conocer las estrategias de trading puede mejorar tus resultados financieros',
      'El trading te permite participar activamente en los mercados financieros',
    ],
    footer:
      'Explora más sobre el trade y cómo puede beneficiar tu estrategia financiera con FINANFLIX.',
  },
  'interest-rate': {
    title: 'Tasa de interés',
    description:
      'La tasa de interés es el costo del dinero en el tiempo. Es un concepto crucial en finanzas que afecta a préstamos, ahorros e inversiones.',
    benefits: [
      'Entender las tasas de interés te ayuda a evaluar mejor los préstamos y las inversiones',
      'Conocer cómo funcionan las tasas de interés te permite optimizar tus ahorros',
      'Comprender el impacto de las tasas de interés en la economía mejora tu toma de decisiones financieras',
    ],
    footer:
      'Descubre más sobre las tasas de interés y su impacto en tus finanzas personales con FINANFLIX.',
  },
  'insurance-tech': {
    title: 'Tecnología de seguros',
    description:
      'La tecnología de seguros, o InsurTech, se refiere a la aplicación de tecnologías innovadoras en la industria de seguros para mejorar la eficiencia y la experiencia del cliente.',
    benefits: [
      'Conocer las innovaciones en seguros te ayuda a encontrar mejores opciones de cobertura',
      'Entender la InsurTech te permite aprovechar nuevas formas de proteger tus activos',
      'La tecnología de seguros está transformando la industria, ofreciendo soluciones más personalizadas y accesibles',
    ],
    footer:
      'Aprende más sobre cómo la tecnología está revolucionando el mundo de los seguros con FINANFLIX.',
  },
  'bank-transfer': {
    title: 'Transferencia bancaria',
    description:
      'Una transferencia bancaria es un método para enviar dinero de una cuenta bancaria a otra. Es una forma común y segura de mover fondos entre cuentas propias o a terceros.',
    benefits: [
      'Conocer cómo funcionan las transferencias bancarias te ayuda a manejar tu dinero de forma más eficiente',
      'Entender los diferentes tipos de transferencias te permite elegir la mejor opción para tus necesidades',
      'Saber sobre transferencias internacionales es crucial si manejas transacciones en diferentes países',
    ],
    footer:
      'Descubre más sobre transferencias bancarias y cómo optimizar tus movimientos de dinero con FINANFLIX.',
  },
};

export default function Glossary() {
  const [selectedTopic, setSelectedTopic] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  const content = topicContent[selectedTopic as keyof PropsTopicContent] || topicContent.default;

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-[#A7A7A7] font-poppins">
        <BigTitle
          title={content.title}
          className="font-sans text-2xl md:text-center font-bold mb-4 dark:text-white text-black pt-[21px] pb-3"
        />
        <p className="text-lg mb-6 font-poppins dark:text-white text-black">
          {content.description}
        </p>
        <h2 className="text-2xl font-semibold mb-4 font-poppins text-[#F03300]">
          ¿Por qué es bueno conocer estos términos?
        </h2>
        <ul className="list-disc pl-6 mb-6 font-poppins">
          {'benefitsBold' in content && 'benefitsDescription' in content
            ? content.benefitsBold.map((bold, index) => (
                <li key={index} className="mb-2 dark:text-white text-black">
                  <span className="font-bold dark:text-white text-black">{bold}</span>{' '}
                  {content.benefitsDescription[index]}
                </li>
              ))
            : content.benefits.map((benefit, index) => (
                <li key={index} className="mb-2 dark:text-white text-black">
                  {benefit}
                </li>
              ))}
        </ul>
        <p className="text-lg font-poppins dark:text-white text-black">{content.footer}</p>
      </div>

      <div className="relative mb-8">
        <Input
          type="search"
          placeholder="Buscar términos"
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-black" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredTopics.map(topic => (
          <Card
            key={topic.id}
            className={`cursor-pointer  transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${
              selectedTopic === topic.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            onClick={() => setSelectedTopic(topic.id)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <h3 className="font-semibold text-lg mb-2 dark:text-white text-black">
                {topic.title}
              </h3>
              <p className="dark:text-white text-black">{topic.resources} resultados</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Faq />
    </div>
  );
}
