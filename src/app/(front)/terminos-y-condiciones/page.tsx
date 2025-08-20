/* eslint-disable react/no-unescaped-entities */

import BigTitle from '@/components/BigTitle/BigTitle';
import { Card } from '@/components/ui/card';
import React from 'react';

const terms1 = [
  {
    title: 'Generalidades',
    description:
      'Estos Términos y Condiciones Generales de Uso y Venta, junto con la Política de Privacidad, constituyen el acuerdo contractual entre usted (en adelante, «USUARIO» o «CLIENTE») y Finanflix S.R.L. (en adelante, «EMPRESA» o «FINANFLIX»), CUIT 30-71739982-6, en relación con el uso de los sitio web https://finanflix.com, https://plataforma.finanflix.com, así como en todas sus plataformas digitales.',
    description2:
      ' Al acceder y utilizar el sitio web, usted acepta estos Términos y Condiciones. Si no está de acuerdo, no debe utilizar el sitio web.',
  },
  {
    title: 'Modificación de los Términos y Condiciones',
    description:
      'La EMPRESA se reserva el derecho a modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán publicadas en el sitio web https://finanflix.com, https://plataforma.finanflix.com, así como en todas sus plataformas digitales y notificadas al USUARIO con una antelación razonable. Es responsabilidad del USUARIO revisar periódicamente estos Términos y Condiciones. El uso continuado del sitio web implica la aceptación de las modificaciones.',
  },
  {
    title: 'Derecho Aplicable y Jurisdicción',
    description:
      'Estos Términos y Condiciones se rigen por las leyes de fondo de la República Argentina. Ante cualquier controversia derivada del presente contrato, el USUARIO y la EMPRESA se someten a la jurisdicción de los Tribunales Ordinarios de la Capital Federal de la República Argentina, renunciando a cualquier otra jurisdicción.',
  },
  {
    title: 'Datos Brindados por el USUARIO y Política de Privacidad de la EMPRESA',
    description:
      'El USUARIO debe proporcionar información veraz y exacta. La EMPRESA no recopila datos sensibles y utilizará la información personal conforme al Art. 43 de la Constitución Nacional y la Ley 25.326 de Protección de Datos Personales. Los mismos podrán utilizarse para consultas sobre sus datos personales, uso y destino de los mismos. El USUARIO es responsable de la veracidad de los datos que suministra y acepta que la EMPRESA los conozca, pudiendo hacer uso de los mismos conforme el art. 5, Ley 25.326. La EMPRESA no realiza recopilación de ningún tipo de dato sensible del USUARIO. La EMPRESA se compromete a guardar la máxima reserva, a no divulgar y a mantener la confidencialidad de la información brindada por el USUARIO. Los datos se utilizan para validar órdenes, notificar modificaciones y enviar contenido promocional, salvo que el USUARIO se oponga y notifique fehacientemente dicha oposición a La Empresa a través del correo electrónico: finanflixteam@gmail.com.',
  },
  {
    title: 'Uso de Imagen del USUARIO',
    description:
      'El USUARIO consiente que su nombre, correo electrónico, fotografía o video personal, es decir, cede el derecho de imagen cuando se encuentre en un webinar, seminario, clase, capacitación y/o curso, tanto remoto como presencial, impartido por LA EMPRESA y ésta se encuentre grabando dicho encuentro. El USUARIO aceptará en los casos remotos y/o virtuales la grabación de dicho curso, no estando obligado a encender la videocámara en la reunión. En caso de decidir iniciar la cámara, acepta el uso y goce de Finanflix de la imagen y/o video para fines comerciales propios de la EMPRESA. En los casos en los que Finanflix obligara a ingresar a la reunión con la videocámara prendida al USUARIO, este brindará el consentimiento de uso y goce de imagen al ingresar al curso, webinar, reunión, capacitación, y/o cualquier otro evento organizado por la EMPRESA.',
  },
  {
    title: 'Cuenta de Usuario y Registración',
    description:
      'El USUARIO es responsable de mantener la confidencialidad de su cuenta y notificar a la EMPRESA inmediatamente cualquier uso no autorizado. La venta, cesión o transferencia de la cuenta está prohibida. ',
    description2:
      'La EMPRESA se reserva el derecho de rechazar incausadamente cualquier solicitud de registración o de cancelar una registración previamente aceptada, es decir, sin encontrarse obligado a comunicar o exponer las razones de la decisión, y sin que ello genere algún derecho a indemnización o resarcimiento.',
  },
  {
    title: 'Productos y Servicios',
    description:
      'FINANFLIX ofrece capacitación en tecnologías descentralizadas, web 3.0, metaverso, NFT’s, criptoactivos, criptomonedas, activos digitales, sus aspectos financieros, regulatorios y otros temas relacionados con las nuevas tecnologías. La información proporcionada al USUARIO o CLIENTE es educativa y no constituye asesoramiento económico y/o financiero de ningún tipo.',
    description2:
      'A tal fin, este AVISO LEGAL pone a disposición el siguiente servicio, por el cual el USUARIO podrá hacer un ofrecimiento de compra (o suscripción), el cual deberá ser previamente aceptado por FINANFLIX, antes de dar habilitación al sitio web y sus beneficios:',
  },
  {
    title: 'Suscripción FINANFLIX',
    description:
      'Con este modelo de servicio, podrás capacitarte de modalidad de aprendizaje asincrónico y sincrónico, con contenido educativo alojado en la plataforma provista por la EMPRESA para tal fin.',
    description2:
      'Modalidad de suscripción: La suscripción tiene un período inicial de 30 días con renovación automática, sujeta a los términos especificados en la sección de pagos. Opciones de suscripción semestral o anual también están disponibles.',
  },
];

const terms2 = [
  {
    title: 'Información de Productos y Servicios',
    description:
      'Los productos y servicios presentados en nuestro sitio web constituyen invitaciones para que los usuarios realicen ofertas de compra. La EMPRESA se reserva el derecho de aceptar o rechazar cualquier solicitud de compra según lo considere apropiado.',
    description2:
      'En nuestro catálogo en línea, proporcionamos información clara y detallada sobre cada producto y servicio, incluidos los precios, métodos de adquisición y contenidos específicos. Nos comprometemos a diseñar una interfaz de usuario intuitiva y accesible para todos, lo que facilita una elección informada y autónoma.',
    description3:
      'Es crucial que los usuarios revisen cuidadosamente la información disponible antes de efectuar cualquier compra o transacción en el sitio web. Para cualquier consulta, disponemos de varios canales de comunicación listados en nuestro sitio para su comodidad. Además, es importante tener en cuenta que las fotografías y vídeos en los sitios web https://finanflix.com y https://plataforma.finanflix.com son únicamente ilustrativos.',
  },
  {
    title: 'Proceso de Oferta y Compra:',
    description:
      'Los servicios, productos, catálogos y demás contenidos de nuestra tienda en línea no constituyen una oferta de venta directa, sino una invitación a los usuarios a enviar solicitudes de compra. Estas solicitudes dependen de la disponibilidad de los productos y se consideran ofertas por parte del usuario para adquirir mediante medios electrónicos.',
    description2:
      'Si la EMPRESA acepta una solicitud, esto constituye un ofrecimiento formal de venta bajo las condiciones especificadas en la solicitud, conforme al artículo 973 del Código Civil y Comercial de la Nación Argentina y al artículo 7 de la Ley 24.240.',
    description3:
      'En caso de indisponibilidad del producto o servicio después de realizado el pedido, el cliente será informado por correo electrónico sobre la anulación total o parcial del pedido. La anulación parcial por falta de disponibilidad no autoriza la cancelación del pedido completo, ni confiere derechos a compensaciones o indemnizaciones.',
    description4:
      'La EMPRESA se reserva el derecho de rechazar cualquier solicitud de compra sin necesidad de proporcionar justificación. El ejercicio de este derecho no conlleva ninguna obligación de compensación o indemnización por parte de Finanflix hacia el usuario o terceros.',
  },
  {
    title: 'Precios:',
    description:
      'Los precios listados en el sitio web están expresados en pesos argentinos e incluyen el Impuesto al Valor Agregado (IVA). La EMPRESA se reserva el derecho de modificar estos precios y condiciones sin previo aviso. Adicionalmente, cualquier gasto administrativo asociado con la operación será comunicado al usuario antes del pago, quien deberá aceptarlo para completar la transacción.',
    description2:
      'Los precios de los servicios mostrados en la página web de la EMPRESA tendrán validez sólo dentro de este medio y no necesariamente coincidirán con los de otros canales de venta de la EMPRESA.',
    description3:
      'La EMPRESA puede actualizar la información en los sitios web https://finanflix.com y https://plataforma.finanflix.com, incluyendo detalles sobre productos, servicios, precios, disponibilidad de stock, costos de envío y condiciones generales, en cualquier momento y sin necesidad de aviso previo.',
  },
  {
    title: 'Medios y formas de pago:',
    description:
      'El pago deberá realizarse utilizando uno de los medios habilitados por la EMPRESA. Estos métodos pueden ser modificados en cualquier momento antes de que el usuario seleccione uno para realizar su pago, pero no después. Una vez efectuado el pago, este será confirmado por el sistema que el usuario haya elegido, incluyendo opciones como Mercado Pago, Ualá, Mobbex, criptoactivos a través de exchanges, transferencia bancaria, o cualquier plataforma de pago que la EMPRESA disponga para su uso.',
    description2:
      'Es importante destacar que la EMPRESA no posee medios de pago propios y, por lo tanto, no asume responsabilidad alguna por las transacciones realizadas a través de sistemas bancarios, exchanges de criptoactivos u otros métodos similares. Las renovaciones automáticas se procesarán de acuerdo con los términos establecidos por cada plataforma de pago utilizada.',
    description3:
      'Medios de pago en diferentes monedas: Los medios de pago se ofrecen en pesos argentinos o su equivalente en moneda extranjera. A través de PayPal (PayPal Holdings Inc.), los pagos pueden realizarse en dólares estadounidenses. Estos se renuevan automáticamente al finalizar cada período contratado. Recomendamos consultar los términos y condiciones de PayPal en su sitio web.',
    description4:
      'Pago en criptoactivos: El pago también puede efectuarse a través de CoinPayments Inc., permitiendo al usuario elegir entre diez criptoactivos. Al concluir el período de suscripción, se enviará un correo para realizar el pago de forma manual, aunque FINANFLIX no garantiza la recepción de este correo, ya que el proceso es gestionado por CoinPayments Inc. Para más detalles, le invitamos a revisar los términos y condiciones en CoinPayments.',
    description5:
      'Pago en pesos argentinos: Los pagos en pesos pueden realizarse automáticamente a través de la plataforma Mobbex, vinculando la cuenta del usuario. Este pago se renueva automáticamente al finalizar cada período contratado. Se recomienda leer los términos y condiciones en Mobbex. Adicionalmente, la opción de transferencia bancaria requiere que, al finalizar el período, el usuario reciba un correo para proceder con la renovación. En caso de no cancelarse la suscripción y no efectuarse el pago, FINANFLIX se reserva el derecho a tomar acciones legales para el cobro de los servicios.',
  },
  {
    title: 'Gestión de Suscripciones:',
    description:
      'El usuario puede gestionar sus suscripciones desde el Discord o mediante los canales oficiales de Finanflix, incluyendo WhatsApp, donde podrá cancelar o renovar suscripciones suspendidas. Las cancelaciones tendrán efecto el mes siguiente y no implican la devolución del pago del mes en curso. FINANFLIX se reserva el derecho de cancelar suscripciones por incumplimiento de los términos y condiciones o por falta de pago.',
  },
  {
    title: 'Cancelación de Suscripciones:',
    description:
      'Las bajas pueden solicitarse a través de WhatsApp al número de teléfono +5491133997245 o mediante el formulario disponible en este enlace: https://forms.gle/UD31j6uZhWZuguin6.',
  },
  {
    title: 'Avisos de Renovación:',
    description:
      'La EMPRESA se reserva el derecho de modificar los montos de renovación, notificando a los usuarios con antelación a través del correo electrónico registrado. La renovación se considera una continuación del servicio y no es susceptible de devolución dentro de los diez días corridos.',
  },
  {
    title: 'Devoluciones:',
    description:
      'El USUARIO puede solicitar la devolución del servicio de SUSCRIPCIÓN dentro de los primeros 10 días corridos después de realizar el primer pago al mail: finanflixteam@gmail.com. Las renovaciones no son reembolsables.',
  },
  {
    title: 'Propiedad Intelectual e Industrial:',
    description:
      'El USUARIO puede solicitar la devolución del servicio de SUSCRIPCIÓN dentro de los primeros 10 días corridos después de realizar el primer pago al mail: finanflixteam@gmail.com. Las renovaciones no son reembolsables.',
  },
  {
    title: 'Devoluciones:',
    description:
      'Todo el contenido del sitio web de FINANFLIX, que incluye diseño gráfico, código fuente, logotipos, textos, gráficos, ilustraciones y fotografías, es propiedad exclusiva de FINANFLIX. Esto abarca todos los elementos visibles en las plataformas que la EMPRESA utiliza, salvo aquellos que son de dominio público. Además, todos los nombres comerciales, marcas o signos distintivos que aparecen en estas plataformas son propiedad de FINANFLIX y están protegidos por la legislación vigente en materia de propiedad intelectual.',
    description2:
      'La EMPRESA no otorga ninguna licencia ni autorización de uso personal al USUARIO sobre sus derechos de propiedad intelectual e industrial, ni sobre ningún otro derecho relacionado con su contenido. Por lo tanto, el USUARIO acepta que la reproducción, distribución, comercialización, transformación y, en general, cualquier otra forma de explotación de todo o parte de los contenidos de FINANFLIX, por cualquier medio y procedimiento, constituye una violación de los derechos de propiedad intelectual e industrial de FINANFLIX.',
    description3:
      'Cualquier uso no autorizado de estos contenidos es considerado una infracción grave de los derechos de propiedad intelectual e industrial y será tratado conforme a la Ley 11.723 y sus modificaciones, que regula el Régimen de Propiedad Intelectual en la República Argentina.',
  },
];

{
  /* TEXTO REFACTORIZADO  #refactorizacion  */
}

function TerminosCondicionesPage() {
  return (
    <div className="text-normal px-4 sm:px-0  flex flex-col gap-3 md:gap-7 md:text-justify  mb-10 pt-3 md:pt-0 ">
      <p className="w-full text-center md:text-end dark:text-white text-black font-sans text-[16px] ">
        Ciudad Autónoma de Buenos Aires, a los 9 días del mes de julio del 2025.
      </p>
      <div className="text-center">
        <BigTitle
          className="md:py-5 py-3 text-2xl md:text-4xl px-5 "
          title={'Términos y Condiciones'}
        />
      </div>

      {terms1.map((term, index) => (
        <div key={index}>
          <h2 className="text-xl sm:text-[1.5rem] font-[600] ">
            {index + 1}. {term.title}
          </h2>
          <div className="mt-[1rem] text-sm sm:text-[16px]">{term.description}</div>
          <div className="mt-[1rem] text-sm sm:text-[16px]">{term.description2}</div>
        </div>
      ))}

      <p className="font-sans text-sm sm:text-[16px]">
        Servicios incluidos: La siguiente lista de servicios se ofrece de manera enumerativa y no
        exhaustiva, y su inclusión no constituye una obligación por parte de la EMPRESA
      </p>
      <ul className="list-disc list-inside text-sm sm:text-[16px] text-start space-y-1">
        <li>
          Curso Cripto y Sistema Financiero, Parte Uno: Incluye acceso a clases semanales y campus
          virtual, cobertura de temas como el sistema bancario, criptomonedas y blockchain, cómo
          comprar y almacenar criptomonedas, introducción al análisis fundamental, De-Fi inicial y
          análisis técnico inicial.
        </li>
        <li>
          Clases en vivo: Sesiones quincenales de análisis fundamental. Dos sesiones por cada
          suscripción mensual.
        </li>
        <li>
          Actualización de mercado semanal: Informes informativos con análisis de las últimas
          novedades del mercado.
        </li>
        <li>Informes de coyuntura política mundial.</li>
        <li>
          Inglés cripto: Cursos diseñados para entender conceptos y el lenguaje específico de la
          criptoactividad, disponibles en niveles básico, intermedio y avanzado.
        </li>
        <li>Actualizaciones y novedades sobre el mercado NFT.</li>
        <li>Charlas y capacitaciones para emprendedores/as.</li>
        <li>Biblioteca de Alejandría y clases básicas de trading.</li>
        <li>Acceso exclusivo a encuentros presenciales.</li>
        <li>Novedades diarias.</li>
      </ul>

      <p className="font-sans text-sm sm:text-[16px]">
        Estos servicios están sujetos a cambios y disponibilidad según los términos y condiciones
        específicos detallados en la sección de pagos.
      </p>

      <p className="font-sans text-sm sm:text-[16px]">
        Disponibilidad de servicios: Es importante mencionar que algunos de los servicios listados
        pueden no estar disponibles en cada ciclo de suscripción. Esto dependerá exclusivamente de
        la disponibilidad mensual y de los instructores especializados en cada tema. Por lo tanto,
        la empresa no garantiza la oferta de todas las capacitaciones debido a circunstancias fuera
        de nuestro control directo.
      </p>
      <p className="font-sans text-sm sm:text-[16px]">
        Restricciones de uso: Los servicios mencionados son para uso exclusivo de los suscriptores y
        no pueden ser transferidos, ya sea de forma gratuita o mediante pago, a personas que no
        estén inscritas en los cursos. La información proporcionada en estos cursos es exclusiva
        para los clientes que han adquirido el servicio y no debe ser compartida con terceros.
        Ofrecer los cursos a un precio igual, inferior o superior puede resultar en la iniciación de
        acciones legales civiles, comerciales y penales contra el responsable o responsables de
        dicha infracción.
      </p>
      {terms2.map((term, index) => (
        <div key={index}>
          <h2 className="text-xl sm:text-[1.5rem] font-[600] ">
            {index + 1}. {term.title}
          </h2>
          <div className="mt-[1rem] text-sm sm:text-[16px]">{term.description}</div>
          <div className="mt-[1rem] text-sm sm:text-[16px]">{term.description2}</div>
          <div className="mt-[1rem] text-sm sm:text-[16px]">{term.description3}</div>
        </div>
      ))}

      <div className="text-start">
        <h2 className="pt-5 px-0 mx-0 ml-0 text-2xl">IMPORTANTE: AVISO LEGAL</h2>
      </div>

      <ul className="list-disc list-inside text-sm sm:text-[16px]  text-start space-y-1">
        <li>
          <b>Expectativas de Rendimiento en Inversiones:</b> La información ofrecida por Finanflix
          no garantiza el rendimiento futuro y no debe ser vista como asesoramiento de inversión.
          Los resultados pasados no son predictores de resultados futuros, y las inversiones
          conllevan riesgos que pueden alterar significativamente las condiciones de mercado.
        </li>
        <li>
          <b>Descripción de Servicios Educativos:</b> Finanflix provee recursos y herramientas
          educativas en el área financiera, sin ofrecer asesoramiento de inversión profesional. El
          éxito en la utilización de estos recursos depende exclusivamente del compromiso personal
          del alumno.
        </li>
        <li>
          <b>Limitaciones de Responsabilidad de Finanflix:</b> Finanflix no acepta responsabilidad
          por pérdidas o daños resultantes del uso de su información o servicios. Aunque nuestros
          programas se ofrecen con alta calidad, el aprendizaje y los resultados están sujetos al
          esfuerzo personal y a la volatilidad del mercado.
        </li>
        <li>
          <b>Código de Conducta para Usuarios:</b> Los usuarios de Finanflix deben adherirse a
          normas de respeto y civismo dentro de nuestra comunidad. Prohibimos comportamientos
          agresivos, maliciosos o disruptivos, así como recomendaciones financieras no autorizadas o
          compartir información de competidores.
        </li>
        <li>
          <b>Condiciones Específicas de Cursos y Eventos:</b> Los diversos programas educativos de
          Finanflix, como cursos y webinars, están regidos por términos y condiciones específicos
          que requieren revisión y consentimiento previos a la participación. Estos términos son
          obligatorios y fundamentales para la relación contractual.
        </li>
        <li>Actualizaciones y novedades sobre el mercado NFT.</li>
        <li>Charlas y capacitaciones para emprendedores/as.</li>
        <li>Biblioteca de Alejandría y clases básicas de trading.</li>
        <li>Acceso exclusivo a encuentros presenciales.</li>
        <li>Novedades diarias.</li>
      </ul>
      <Card className="text-start  p-5 dark:text-white text-black w-full sm:w-3/4 lg:w-2/4 ">
        <h2 className="  px-0 mx-0 ml-0 text-2xl py-3">CONTACTO</h2>
        <div className="flex flex-col gap-3 pt-3">
          <p className="font-sans text-sm sm:text-[16px]">
            Mail:{' '}
            <a
              className="font-sans text-blue-500 hover:text-black"
              href="mailto:finanflixteam@gmail.com"
            >
              finanflixteam@gmail.com
            </a>
          </p>
          <p className="font-sans text-sm sm:text-[16px]">
            Ciudad Autónoma de Buenos Aires, República Argentina
          </p>
          <p className="font-sans text-sm sm:text-[16px]">FINANFLIX S.R.L. – Todos los derechos reservados.</p>
        </div>
      </Card>
    </div>
  );
}

export default TerminosCondicionesPage;
