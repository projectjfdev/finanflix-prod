import React, { useEffect, useRef, useState } from "react";

const Autoplay = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasUnmuted, setHasUnmuted] = useState(
    () => localStorage.getItem("hasUnmuted") === "true"
  );

  // Detectar visibilidad del video
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  // Reproducir/Pausar según visibilidad
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play().catch((err) =>
        console.warn("Error al reproducir video:", err)
      );
    } else {
      video.pause();
    }
  }, [isVisible]);

  // Detectar primer scroll como "interacción válida"
  useEffect(() => {
    const handleScroll = () => {
      if (!hasUnmuted) {
        setHasUnmuted(true);
        localStorage.setItem("hasUnmuted", "true");

        if (videoRef.current) {
          videoRef.current.muted = false;
        }
      }
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasUnmuted]);

  // Botón manual si el usuario quiere activar sonido
  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setHasUnmuted(true);
      localStorage.setItem("hasUnmuted", "true");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        width="100%"
        height="auto"
        muted={!hasUnmuted}
        loop
        playsInline
        preload="auto"
        style={{ maxHeight: "500px", width: "100%", borderRadius: "8px" }}
      >
        Tu navegador no soporta el video.
      </video>

      {isVisible && !hasUnmuted && (
        <button
          onClick={handleUnmute}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            padding: "10px 16px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Activar sonido 🔊
        </button>
      )}
    </div>
  );
};

export default Autoplay;
