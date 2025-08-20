"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import Player from "@vimeo/player"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Pause, Volume2, VolumeX, Maximize2, Subtitles, Settings, ChevronDown, Check } from "lucide-react"
import "./vimeo.css"

interface VimeoPlayerProps {
  videoId: number
}

// Tipos para las opciones de calidad y velocidad
interface VideoQuality {
  id: string
  label: string
  active?: boolean
}

interface PlaybackSpeed {
  value: number
  label: string
  active?: boolean
}

const VimeoTrailerControls: React.FC<VimeoPlayerProps> = ({ videoId }) => {
  const initialTime = 5;
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLastLesson, setIsLastLesson] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados para los nuevos controles
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<VideoQuality[]>([]);
  const [currentQuality, setCurrentQuality] = useState<string>('auto');
  const [playbackSpeeds] = useState<PlaybackSpeed[]>([
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: 'Normal', active: true },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
  ]);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [availableTextTracks, setAvailableTextTracks] = useState<any[]>([]);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);

  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

    const [hasClicked, setHasClicked] = useState(false);
  const [isInView, setIsInView] = useState(false);







  const handleMouseEnter = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }

    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    setControlsTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 1000); // <- esta coma estaba mal colocada
      setControlsTimeout(timeout);
    }
  };

  // Inicializar el reproductor de Vimeo
  useEffect(() => {
    if (playerRef.current) {
      // Configuración del reproductor de Vimeo sin controles nativos
      const vimeoPlayer = new Player(playerRef.current, {
        id: videoId,
        autopause: true,
        autoplay: false,
        muted: false,
        loop: false,
        controls: false, // Desactivamos los controles nativos
        byline: false,
        portrait: false,
        title: false,
        dnt: true,
        responsive: true,
        playsinline: true,
        background: false,
        color: '#FF5252',
        texttrack: 'es', // Intenta cargar subtítulos en español por defecto
                transparent: false,
      });

      setPlayer(vimeoPlayer);

      // Obtener la duración del video
      vimeoPlayer.getDuration().then(videoDuration => {
        setDuration(videoDuration);
      });

      // Obtener las calidades disponibles
      vimeoPlayer.getVideoTitle().then(() => {
        // Necesitamos esperar a que el video esté listo
        setTimeout(() => {
          vimeoPlayer
            .getQualities()
            .then((qualities: any[]) => {
              const formattedQualities = qualities.map(q => ({
                id: q.id,
                label: q.label,
                active: q.active,
              }));
              setAvailableQualities(formattedQualities);

              // Establecer la calidad actual
              const activeQuality = formattedQualities.find(q => q.active);
              if (activeQuality) {
                setCurrentQuality(activeQuality.id);
              }
            })
            .catch(err => {
              console.error('Error getting qualities:', err);
            });

          // Obtener los subtítulos disponibles
          vimeoPlayer
            .getTextTracks()
            .then((tracks: any[]) => {
              setAvailableTextTracks(tracks);
            })
            .catch(err => {
              console.error('Error getting text tracks:', err);
            });
        }, 1000);
      });

      // Actualizar el tiempo actual periódicamente
      const timeUpdateInterval = setInterval(() => {
        vimeoPlayer.getCurrentTime().then(time => {
          setCurrentTime(time);
        });
      }, 500);

      vimeoPlayer.on('play', () => {
        setIsPlaying(true);
      });

      vimeoPlayer.on('pause', () => {
        setIsPlaying(false);
      });

      vimeoPlayer.on('ended', async () => {
        setVideoEnded(true);
        setIsPlaying(false);

      
      });

      return () => {
        clearInterval(timeUpdateInterval);
        vimeoPlayer.unload();
      };
    }
  }, [videoId]);


  // Boton de Play

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  // Boton de mute

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.setVolume(volume);
        setIsMuted(false);
      } else {
        player.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  // Handler de volumen

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  // Handler de minuto donde reproducimos

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number.parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (player) {
      player.setCurrentTime(seekTime);
    }
  };

  // Activa pantalla completa

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Activa el menu de los subtitulos

  const toggleSubtitles = () => {
    if (player && availableTextTracks.length > 0) {
      if (subtitlesEnabled) {
        player.disableTextTrack();
        setSubtitlesEnabled(false);
      } else {
        // Activar el primer track disponible
        const firstTrack = availableTextTracks[0];
        player.enableTextTrack(firstTrack.language, firstTrack.kind);
        setSubtitlesEnabled(true);
      }
    } else {
      setShowSubtitlesMenu(!showSubtitlesMenu);
    }
  };

  // Activa los subtitulos

  const selectTextTrack = (language: string, kind: string) => {
    if (player) {
      player.enableTextTrack(language, kind);
      setSubtitlesEnabled(true);
      setShowSubtitlesMenu(false);
    }
  };

  // Desactiva los subtitulos

  const disableTextTrack = () => {
    if (player) {
      player.disableTextTrack();
      setSubtitlesEnabled(false);
      setShowSubtitlesMenu(false);
    }
  };

  // Activa la configuracion

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
    setShowQualityMenu(false);
    setShowSpeedMenu(false);
    setShowSubtitlesMenu(false);
  };

  // Menu de Calidad del video

  const toggleQualityMenu = () => {
    setShowQualityMenu(!showQualityMenu);
    setShowSpeedMenu(false);
    setShowSubtitlesMenu(false);
  };

  // Velocidad de reproduccion del video

  const toggleSpeedMenu = () => {
    setShowSpeedMenu(!showSpeedMenu);
    setShowQualityMenu(false);
    setShowSubtitlesMenu(false);
  };

  // Setea de Calidad del video

  const setQuality = (qualityId: string) => {
    if (player) {
      player.setQuality(qualityId);
      setCurrentQuality(qualityId);
      setShowQualityMenu(false);
      setShowSettingsMenu(false);
    }
  };

  // Setea velocidad de reproduccin

  const setPlaybackSpeed = (speed: number) => {
    if (player) {
      player.setPlaybackRate(speed);
      setCurrentSpeed(speed);
      setShowSpeedMenu(false);
      setShowSettingsMenu(false);
    }
  };

  // Formatear tiempo en minutos:segundos
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Obtener la etiqueta de velocidad actual
  const getCurrentSpeedLabel = () => {
    const speed = playbackSpeeds.find(s => s.value === currentSpeed);
    return speed ? speed.label : 'Normal';
  };

  // Obtener la etiqueta de calidad actual
  const getCurrentQualityLabel = () => {
    const quality = availableQualities.find(q => q.id === currentQuality);
    return quality ? quality.label : 'Auto';
  };

  // ocultar los controles después de 3 segundos de inactividad. - limpieza
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);


   // Observer para detectar si el video está en viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    if (playerRef.current) {
      observer.observe(playerRef.current);
    }

    return () => {
      if (playerRef.current) observer.unobserve(playerRef.current);
    };
  }, []);

  // Listener para detectar el primer clic del usuario
  useEffect(() => {
    const handleClick = () => {
      setHasClicked(true);
    };

    if (!hasClicked) {
      window.addEventListener("click", handleClick);
    }

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [hasClicked]);

  // Si ambas condiciones se cumplen, reproduce el video
  useEffect(() => {
    if (player && hasClicked && isInView) {
      player.play().catch((err: any) => {
        console.error("No se pudo reproducir:", err);
      });
    }
  }, [player, hasClicked, isInView]);


  

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden dark:rounded-[36px] rounded-[36px]"
      ref={containerRef}
    >
      {!videoEnded && (
        <div className="relative  ">
          <div
            ref={playerRef}
            className="max-w-full w-full  border-none m-0 p-0 dark:rounded-[36px] rounded-[36px]  "
            style={{ overflow: "hidden" }}
          ></div>

          {/* Barra de Control personalizada */}

          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16  px-4 transition-opacity duration-300 pb-5 rounded-none ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Barra de progreso */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 mb-4 appearance-none bg-white/30 rounded-full overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF5252 0%, #FF5252 ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, rgba(255, 255, 255, 0.3) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255, 255, 255, 0.3) 100%)`,
              }}
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* Boton Play | Pause */}

                <button
                  onClick={togglePlay}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                </button>

                <div className="flex items-center gap-2">
                  {/* Boton Mute  */}

                  <button onClick={toggleMute} className="text-white hover:text-white/80 transition-colors">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>

                  {/* Barra de volumen   */}

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 appearance-none bg-white/30 rounded-full overflow-hidden cursor-pointer hidden md:block"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${
                        volume * 100
                      }%, rgba(255, 255, 255, 0.3) ${volume * 100}%, rgba(255, 255, 255, 0.3) 100%)`,
                    }}
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Botón de subtítulos */}
                <div className="relative flex ">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleSubtitles}
                          className={`text-white hover:text-white/80 transition-colors p-1 rounded ${
                            subtitlesEnabled ? "bg-[#FF5252]/50" : ""
                          }`}
                        >
                          <Subtitles className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="dark:text-white text-white">
                          {subtitlesEnabled ? "Deshabilitar Subtitulos" : "Habilitar Subtitulos"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Menú de subtítulos */}
                  {showSubtitlesMenu && availableTextTracks.length > 0 && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-md shadow-lg p-2 min-w-[150px] z-10">
                      <div className="text-white text-xs font-medium mb-1 px-2">Subtítulos</div>
                      <button
                        onClick={disableTextTrack}
                        className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${
                          !subtitlesEnabled ? "bg-[#FF5252]/30" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <span>Desactivados</span>
                          {!subtitlesEnabled && <Check className="h-4 w-4 ml-auto" />}
                        </div>
                      </button>
                      {availableTextTracks.map((track, index) => (
                        <button
                          key={index}
                          onClick={() => selectTextTrack(track.language, track.kind)}
                          className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${
                            subtitlesEnabled ? "bg-[#FF5252]/30" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <span>{track.label || track.language}</span>
                            {subtitlesEnabled && <Check className="h-4 w-4 ml-auto" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón de configuración */}
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleSettingsMenu}
                          className="text-white hover:text-white/80 transition-colors p-1 rounded"
                        >
                          <Settings className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="dark:text-white text-white">Configuración</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Menú de configuración */}
                  {showSettingsMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-md shadow-lg p-2 min-w-[180px] z-10 space-y-1">
                      <div className="text-white text-xs font-medium mb-1 px-2">Configuración</div>

                      {/* Opción de calidad */}
                      <button
                        onClick={toggleQualityMenu}
                        className="w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded"
                      >
                        <div className="flex items-center justify-between ">
                          <span>Calidad</span>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">{getCurrentQualityLabel()}</span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </button>

                      {/* Opción de velocidad */}
                      <button
                        onClick={toggleSpeedMenu}
                        className="w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded"
                      >
                        <div className="flex items-center justify-between">
                          <span>Velocidad</span>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">{getCurrentSpeedLabel()}</span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Menú de calidad */}
                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-md shadow-lg p-2 min-w-[150px] z-10 space-y-1">
                      <div className="text-white text-xs font-medium mb-1 px-2">Calidad</div>
                      {availableQualities.map((quality) => (
                        <button
                          key={quality.id}
                          onClick={() => setQuality(quality.id)}
                          className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${
                            currentQuality === quality.id ? "bg-[#FF5252]/30" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <span>{quality.label}</span>
                            {currentQuality === quality.id && <Check className="h-4 w-4 ml-auto" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Menú de velocidad */}
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-md shadow-lg p-2 min-w-[150px] z-10 space-y-1 space-x-1">
                      <div className="text-white text-xs font-medium mb-1 px-2">Velocidad</div>
                      {playbackSpeeds.map((speed) => (
                        <button
                          key={speed.value}
                          onClick={() => setPlaybackSpeed(speed.value)}
                          className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${
                            currentSpeed === speed.value ? "bg-[#FF5252]/30" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <span>{speed.label}</span>
                            {currentSpeed === speed.value && <Check className="h-4 w-4 ml-auto" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón de pantalla completa */}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={toggleFullscreen} className="text-white hover:text-white/80 transition-colors">
                        <Maximize2 className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="dark:text-white text-white">Pantalla Completa</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Logo FINANFLIX */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/50 px-3 py-1 rounded-md">
              <span className="text-white text-sm font-medium">FINANFLIX</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VimeoTrailerControls
