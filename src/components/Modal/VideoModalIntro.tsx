"use client";

import { useEffect, useState } from "react";
import Cookies from "cookiejs";
import VideoModal from "./VideoModal";

export default function VideoModalIntro() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open); // Cierra el modal
  };



  useEffect(() => {

    // Verifica si el consentimiento de cookies ha sido aceptado
    const cookieConsent = Cookies.get("cookieConsent") === "true";  // Aquí verificas el consentimiento

    if (!cookieConsent) {
      // Si no se ha aceptado el consentimiento de cookies, no mostramos el modal
      return;
    }

    // Verifica si la cookie 'videoViewed' está en 'true'
    const videoViewed = Cookies.get("presentationViewed") === "true";

    if (!videoViewed) {
      // Abre el modal después de 1.5 segundos si la cookie está presente
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 1500);

      // Limpia el temporizador al desmontar el componente
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {Cookies.get("cookieConsent") === "true" && (
        <VideoModal isOpen={isModalOpen} onOpenChange={handleCloseModal} />
      )}
      {/* <VideoModal isOpen={isModalOpen} onOpenChange={handleCloseModal} /> */}
    </>
  );
}
