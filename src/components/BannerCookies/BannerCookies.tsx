'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import cookie from 'cookiejs';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cookieSetTime, setCookieSetTime] = useState<Date | string>('');
  // estados para debugear el timer de las cookies
  const [isCookieAccepted, setIsCookieAccepted] = useState(false);
  const [isCookieDeclined, setIsCookieDeclined] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const consent = getCookie('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // const giveCookieConsent = () => {
  //   setCookie("cookieConsent", "true", expirationDateString);
  //   console.log("cookie aceptada en el horario:", expirationDateString);
  //   setIsVisible(false);
  // };

  // Establecer cookie con expiración en 2 minutos
  const giveCookieConsent = () => {
    const expirationDate = new Date();
    // expirationDate.setSeconds(expirationDate.getSeconds() + 10); // 10 segundos para testeo rapido
    expirationDate.setDate(expirationDate.getDate() + 1); // fecha de expiracion de la cookie 1 dia
    const expirationDateString = expirationDate.toUTCString();

    setCookie('cookieConsent', 'true', expirationDateString); // Establecer cookie de consentimiento
    setCookieSetTime(expirationDateString); // Guardar el tiempo en que se estableció la cookie
    setIsCookieAccepted(true); // Marcar que la cookie fue aceptada
    setIsVisible(false); // Cerrar el modal
    window.location.reload();
  };

  const handleDecline = () => {
    const expirationDate = new Date();
    // expirationDate.setSeconds(expirationDate.getSeconds() + 10); // 10 segundos para testeo rapido
    expirationDate.setDate(expirationDate.getDate() + 1); // fecha de expiracion de la cookie 1 dia
    const expirationDateString = expirationDate.toUTCString();

    setCookie('cookieConsent', 'false', expirationDateString);
    setCookieSetTime(expirationDateString); // establece el timer de la cookie
    setIsCookieDeclined(true); // Marcar que la cookie fue rechazada

    // cookie.clear("presentationViewed");
    setIsVisible(false);
  };

  // cerrar el modal
  const handleCloseModal = () => {
    const expirationDate = new Date();
    // expirationDate.setSeconds(expirationDate.getSeconds() + 10); // 10 segundos para testeo rapido
    expirationDate.setDate(expirationDate.getDate() + 1); // fecha de expiracion de la cookie 1 dia
    const expirationDateString = expirationDate.toUTCString();
    setCookie('cookieConsent', 'false', expirationDateString);
    setCookieSetTime(expirationDateString);
    setIsCookieDeclined(true);

    setIsVisible(false);
  };

  useEffect(() => {
    if (isCookieDeclined) {
      // Solo loguea cuando la cookie haya sido rechazada
      // console.log("cookie rechazada en horario:", cookieSetTime);

      // Inicia un contador que aumenta cada segundo
      const interval = setInterval(() => {
        setCounter(prevCounter => {
          const newCounter = prevCounter + 1;
          // console.log(`Contador: ${newCounter} segundos`); // Mostrar contador en consola en tiempo real
          return newCounter;
        });
      }, 1000);

      // Limpiar el intervalo cuando el componente se desmonte o cuando no sea necesario
      return () => clearInterval(interval);
    }

    if (isCookieAccepted) {
      // Solo loguea cuando la cookie haya sido rechazada
      // console.log("cookie aceptada en horario:", cookieSetTime);

      // Inicia un contador que aumenta cada segundo
      const interval = setInterval(() => {
        setCounter(prevCounter => {
          const newCounter = prevCounter + 1;
          // console.log(`Contador: ${newCounter} segundos`); // Mostrar contador en consola en tiempo real
          return newCounter;
        });
      }, 1000);

      // Limpiar el intervalo cuando el componente se desmonte o cuando no sea necesario
      return () => clearInterval(interval);
    }
  }, [isCookieDeclined, cookieSetTime]); // Se ejecuta solo cuando la cookie es rechazada o el tiempo cambia

  // utilizar logica de preferencias, donde el usuario decide que cookies acepta o no - utilizar esto cuando haga marketing o analisis de datos
  // const handlePreferences = () => {
  //   // setCookie("cookieConsent", "preference", expirationDateString);
  //   setIsVisible(false);
  // };

  // Functions to manage cookies
  const getCookie = (name: string) => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    return null;
  };

  // Functions to set cookies
  const setCookie = (name: string, value: string, expires: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0  right-0 bg-transparent text-white p-4 text-center z-[1000] ">
      <section className="fixed max-w-md p-4 mx-auto bg-white border border-gray-200 dark:bg-gray-800 left-12 bottom-16 dark:border-gray-700 rounded-2xl">
        <h2 className="font-semibold text-gray-800 dark:text-white">🍪 ¡Usamos cookies!</h2>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Hola, este sitio web utiliza cookies esenciales para garantizar su correcto
          funcionamiento, así como cookies de seguimiento para comprender cómo interactúas con él.
          Estas últimas solo se activarán después de tu consentimiento. <br></br>
        </p>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Si cierras este mensaje sin hacer cambios, se guardarán las configuraciones
          predeterminadas.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4 shrink-0">
          <Button
            onClick={giveCookieConsent}
            className=" text-xs  bg-primary font-medium rounded-lg hover:bg-tertiary px-4 py-2.5 duration-300 transition-colors focus:outline-none"
          >
            Aceptar Cookies
          </Button>

          <Button
            onClick={() => {
              handleDecline();
            }}
            className=" text-xs  bg-primary font-medium rounded-lg hover:bg-tertiary px-4 py-2.5 duration-300 transition-colors focus:outline-none"
          >
            Rechazar Cookies
          </Button>

          <Button
            onClick={() => {
              // handlePreferences();
              window.open('/terminos-y-condiciones', '_blank');
            }}
            className="text-xs  bg-primary font-medium rounded-lg hover:bg-tertiary px-4 py-2.5 duration-300 transition-colors focus:outline-none"
          >
            Términos y Condiciones
          </Button>

          <Button
            onClick={() => handleDecline()}
            className="bg-primary text-xs border text-white hover:bg-tertiary  dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium rounded-lg px-4 py-2.5 duration-300 transition-colors focus:outline-none"
          >
            Cerrar Modal
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CookieConsent;
