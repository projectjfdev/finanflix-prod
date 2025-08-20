'use client';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { lessonIsViewed } from '../Endpoints/coursesEndpoint';
import VideoCircleCountDown from '@/components/VideoCircleCountDown/VideoCircleCountDown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Subtitles,
  Settings,
  ChevronDown,
  Check,
  SkipForward,
  SkipBack,
} from 'lucide-react';
import './vimeo.css';
import CourseCompletionModal from '@/components/Modal/CourseCompletionModal';
import { cn } from '@/lib/utils';

interface VimeoPlayerProps {
  videoId: number;
  lessonId: string;
  userCourseId: string;
  // nextVideo?: string;
  nextLesson?: string;
  courseId: string;
  nextTextContent?: string;
}

// Tipos para las opciones de calidad y velocidad
interface VideoQuality {
  id: string;
  label: string;
  active?: boolean;
}

interface PlaybackSpeed {
  value: number;
  label: string;
  active?: boolean;
}

const VimeoPlayerWithCustomControls: React.FC<VimeoPlayerProps> = ({
  videoId,
  lessonId,
  userCourseId,
  nextLesson,
  courseId,
}) => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);


  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
    }
  }, []);



  const encodeUrl = (url: string) => Buffer.from(url).toString('base64');


  if (!userCourseId || !courseId) {
    console.warn("Missing userCourseId or courseId for course completion check.");
    return false;
  }


  // Función para verificar si el curso está completamente terminado
  const checkCourseCompletion = async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cursos/check-course-completion?courseId=${courseId}`);
      const data = await response.json();
      console.log(data, "data course completed");
      return data.isCompleted || false;



    } catch (error) {
      console.error('Error checking course completion:', error);
      return false;
    }
  };

  //console.log(userCourseId, "userCourseId"); asad
  //console.log(courseId, "userCourseId");

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

  // Guardar la lección actual en localStorage cuando se carga el componente as
  useEffect(() => {
    try {
      localStorage.setItem(`course-${courseId}-last-lesson`, lessonId);
      if (videoId) {
        localStorage.setItem(`course-${courseId}-last-lesson-video`, videoId.toString());
      }
    } catch (error) {
      console.error('Error saving lesson to localStorage:', error);
    }
  }, [courseId, lessonId, videoId]);




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

        if (lessonId) {
          const res = await lessonIsViewed({ lessonId, userCourseId });
          if (res.success) {
            fetch(
              `/api/revalidate?path=/api/cursos/course-progress/find-one?userId=${userCourseId}&courseId=${courseId}`
            );
            fetch(
              `/api/revalidate?path=/api/cursos/check-course-completion?courseId=${courseId}`
            );
          }

          // Verificar si el curso está completamente terminado después de marcar esta lección como vista
          const courseCompleted = await checkCourseCompletion();
          setIsCourseCompleted(courseCompleted);
        }
      });

      return () => {
        clearInterval(timeUpdateInterval);
        vimeoPlayer.unload();
      };
    }
  }, [videoId, lessonId, userCourseId, courseId]);

  useEffect(() => {
    if (!nextLesson) {
      setIsLastLesson(true);
    }

    let timer: NodeJS.Timeout;
    if (videoEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft > 1) {
            return prevTimeLeft - 1;
          } else {
            clearInterval(timer);
            goToTheNextLesson();
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [videoEnded, timeLeft, isLastLesson]);

  // Funcion para ir a la leccion anterior
  const goToPreviousLesson = async () => {
    // FIND THE CURRENT LESSON AND SECTION IN THE COURSE
    let currentSectionIndex = -1;
    let currentLessonIndex = -1;
    let previousLesson: {
      videoUrl?: string;
      lessonId?: string;
      textContent?: string;
    } | null = null;

    // OBTENGO LA DATA DEL CURSO POR ID
    const courseResponse = await fetch(`/api/cursos/course-by-id/${courseId}`);
    const courseData = await courseResponse.json();

    // ENCUENTRO LA POSICION DE LA LECCION ACTUAL
    for (let i = 0; i < courseData.sections?.length; i++) {
      const section = courseData.sections[i];
      for (let j = 0; j < section.lessons?.length; j++) {
        if (section.lessons[j]._id.toString() === lessonId) {
          currentSectionIndex = i;
          currentLessonIndex = j;
          break;
        }
      }
      if (currentSectionIndex !== -1) break;
    }

    // DETERMINO LA LECCION ANTERIOR
    if (currentSectionIndex !== -1 && currentLessonIndex !== -1) {
      if (currentLessonIndex > 0) {
        // SI NO ES LA PRIMERA LECCION EN LA SECCION VOY A LA ANTERIOR
        const prevLesson = courseData.sections[currentSectionIndex].lessons[currentLessonIndex - 1];
        previousLesson = {
          videoUrl: prevLesson.videoUrl?.split('/').pop(),
          lessonId: prevLesson._id.toString(),
          textContent: prevLesson.textContent,
        };
      } else if (currentSectionIndex > 0) {
        // SI ESTOY EN LA PRIMERA LECCION DE LA SECCION, VA A LA ULTIMA LECCION DE LA SECCION ANTERIOR
        const prevSection = courseData.sections[currentSectionIndex - 1];
        const lastLessonIndex = prevSection.lessons.length - 1;
        const prevLesson = prevSection.lessons[lastLessonIndex];
        previousLesson = {
          videoUrl: prevLesson.videoUrl?.split('/').pop(),
          lessonId: prevLesson._id.toString(),
          textContent: prevLesson.textContent,
        };
      }
    }

    // NAVEGO A LA LECCION ANTERIOR
    if (previousLesson) {
      try {
        // UPDATE LOCAL STORAGE WITH PREVIOUS LESSON INFO
        localStorage.setItem(`course-${courseId}-last-lesson`, previousLesson.lessonId || '');
        if (previousLesson.videoUrl) {
          localStorage.setItem(`course-${courseId}-last-lesson-video`, previousLesson.videoUrl);
          localStorage.removeItem(`course-${courseId}-last-lesson-text`);
        } else if (previousLesson.textContent) {
          localStorage.removeItem(`course-${courseId}-last-lesson-video`);
          const urlWithoutProtocol = previousLesson.textContent?.replace(/^https?:\/\//, '');
          const encodedTextContent = urlWithoutProtocol ? encodeUrl(urlWithoutProtocol) : '';
          localStorage.setItem(`course-${courseId}-last-lesson-text`, encodedTextContent);
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }

      // NAVEGO A LA LECCION ANTERIOR
      if (previousLesson.videoUrl) {
        window.location.href = `/curso/${courseId}?videoUrl=${previousLesson.videoUrl}&lessonId=${previousLesson.lessonId}`;
      } else if (previousLesson.textContent) {
        const urlWithoutProtocol = previousLesson.textContent?.replace(/^https?:\/\//, '');
        const encodedTextContent = urlWithoutProtocol ? encodeUrl(urlWithoutProtocol) : '';
        window.location.href = `/curso/${courseId}?textContent=${encodedTextContent}&lessonId=${previousLesson.lessonId}`;
      }
    }
  };

  // Funcion para ir a la siguiente leccion
  // FUNCIÓN REFACTORIZADA PARA IR A LA SIGUIENTE LECCIÓN
  const goToTheNextLesson = async () => {
    // ENCONTRAR LA LECCIÓN ACTUAL Y LA SECCIÓN EN EL CURSO
    let currentSectionIndex = -1;
    let currentLessonIndex = -1;
    let nextLesson: {
      videoUrl?: string;
      lessonId?: string;
      textContent?: string;
    } | null = null;

    // OBTENER LOS DATOS DEL CURSO DESDE EL SERVIDOR
    const courseResponse = await fetch(`/api/cursos/course-by-id/${courseId}`);
    const courseData = await courseResponse.json();

    // ENCONTRAR LA POSICIÓN DE LA LECCIÓN ACTUAL
    for (let i = 0; i < courseData.sections?.length; i++) {
      const section = courseData.sections[i];
      for (let j = 0; j < section.lessons?.length; j++) {
        if (section.lessons[j]._id.toString() === lessonId) {
          currentSectionIndex = i;
          currentLessonIndex = j;
          break;
        }
      }
      if (currentSectionIndex !== -1) break;
    }

    // DETERMINAR LA SIGUIENTE LECCIÓN
    if (currentSectionIndex !== -1 && currentLessonIndex !== -1) {
      const currentSection = courseData.sections[currentSectionIndex];

      if (currentLessonIndex < currentSection.lessons.length - 1) {
        // SI NO ES LA ÚLTIMA LECCIÓN EN LA SECCIÓN, IR A LA SIGUIENTE LECCIÓN EN LA MISMA SECCIÓN
        const nextLessonData = currentSection.lessons[currentLessonIndex + 1];
        nextLesson = {
          videoUrl: nextLessonData.videoUrl?.split('/').pop(),
          lessonId: nextLessonData._id.toString(),
          textContent: nextLessonData.textContent,
        };
      } else if (currentSectionIndex < courseData.sections.length - 1) {
        // SI ES LA ÚLTIMA LECCIÓN EN LA SECCIÓN, IR A LA PRIMERA LECCIÓN DE LA SIGUIENTE SECCIÓN
        const nextSection = courseData.sections[currentSectionIndex + 1];
        const nextLessonData = nextSection.lessons[0];
        nextLesson = {
          videoUrl: nextLessonData.videoUrl?.split('/').pop(),
          lessonId: nextLessonData._id.toString(),
          textContent: nextLessonData.textContent,
        };
      } else {
        // ES LA ÚLTIMA LECCIÓN DEL CURSO
        setIsLastLesson(true);
      }
    }

    // NAVEGAR A LA SIGUIENTE LECCIÓN
    if (nextLesson) {
      try {
        // ACTUALIZAR LOCALSTORAGE CON LA INFORMACIÓN DE LA SIGUIENTE LECCIÓN
        localStorage.setItem(`course-${courseId}-last-lesson`, nextLesson.lessonId || '');
        if (nextLesson.videoUrl) {
          localStorage.setItem(`course-${courseId}-last-lesson-video`, nextLesson.videoUrl);
          localStorage.removeItem(`course-${courseId}-last-lesson-text`);
        } else if (nextLesson.textContent) {
          localStorage.removeItem(`course-${courseId}-last-lesson-video`);
          const urlWithoutProtocol = nextLesson.textContent?.replace(/^https?:\/\//, '');
          const encodedTextContent = urlWithoutProtocol ? encodeUrl(urlWithoutProtocol) : '';
          localStorage.setItem(`course-${courseId}-last-lesson-text`, encodedTextContent);
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }

      // NAVEGAR A LA SIGUIENTE LECCIÓN
      if (nextLesson.videoUrl) {
        window.location.href = `/curso/${courseId}?videoUrl=${nextLesson.videoUrl}&lessonId=${nextLesson.lessonId}`;
      } else if (nextLesson.textContent) {
        const urlWithoutProtocol = nextLesson.textContent?.replace(/^https?:\/\//, '');
        const encodedTextContent = urlWithoutProtocol ? encodeUrl(urlWithoutProtocol) : '';
        window.location.href = `/curso/${courseId}?textContent=${encodedTextContent}&lessonId=${nextLesson.lessonId}`;
      }

      // MARCAR LA LECCIÓN COMO VISTA
      // if (nextLesson.lessonId && userCourseId) {
      //   const res = await lessonIsViewed({
      //     lessonId: nextLesson.lessonId,
      //     userCourseId,
      //   });
      // }
    }
  };

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

  // const toggleFullscreen = () => {
  //   if (!document.fullscreenElement && containerRef.current) {
  //     containerRef.current.requestFullscreen().catch(err => {
  //       console.error(`Error attempting to enable full-screen mode: ${err.message}`);
  //     });
  //     setIsFullscreen(true);
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //       setIsFullscreen(false);
  //     }
  //   }
  // };





  const toggleFullscreen = async () => {
    const element = containerRef.current;

    if (!element) return;

    if (isIOS) {
      // 💡 Simular fullscreen en iOS con CSS
      if (!isFullscreen) {
        element.classList.add('fullscreen-ios');
        window.scrollTo(0, 0); // Previene scroll
        setIsFullscreen(true);
      } else {
        element.classList.remove('fullscreen-ios');
        setIsFullscreen(false);
      }
      return;
    }

    // Check if fullscreen is supported
    const isFullscreenEnabled =
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled;

    if (!isFullscreenEnabled) {
      alert('Pantalla completa no está soportada en este dispositivo o navegador.');
      return;
    }

    // ✅ Entrar en fullscreen
    if (!document.fullscreenElement) {
      const requestFullscreen =
        element.requestFullscreen ||
        (element as any).webkitRequestFullscreen ||
        (element as any).mozRequestFullScreen ||
        (element as any).msRequestFullscreen;

      if (requestFullscreen) {
        try {
          await requestFullscreen.call(element);
          setIsFullscreen(true);

          // 👇 Intentar forzar orientación solo DESPUÉS de entrar a fullscreen
          const orientation = screen.orientation as any;
          if (orientation?.lock) {
            try {
              await orientation.lock('landscape');
            } catch (err: any) {
              console.warn('No se pudo forzar orientación:', err.message);
            }
          }
        } catch (err: any) {
          console.error('Error al intentar pantalla completa:', err.message);
        }
      }
    } else {
      // ✅ Salir de fullscreen
      const exitFullscreen =
        document.exitFullscreen ||
        (document as any).webkitExitFullscreen ||
        (document as any).mozCancelFullScreen ||
        (document as any).msExitFullscreen;

      if (exitFullscreen) {
        try {
          await exitFullscreen.call(document);
          setIsFullscreen(false);
        } catch (err: any) {
          console.error('Error al salir de pantalla completa:', err.message);
        }
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

  // Este useEffect se encarga de detectar cambios en el modo de pantalla completa. Si no esta este useEffect, cuando minimizo el video mediante la tecla escape, se rompe el diseño
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  useEffect(() => {
    if (isCourseCompleted) {
      localStorage.setItem(`course-${courseId}-completed`, JSON.stringify(true));
    }
  }, [isCourseCompleted, courseId]);


  useEffect(() => {
    const isCompleted = JSON.parse(localStorage.getItem(`course-${courseId.toString()}-completed`) || 'false');
    const hasModalBeenShown = localStorage.getItem(`course-${courseId.toString()}-modal-shown`);

    if (videoEnded && isCompleted && !hasModalBeenShown) {
      setIsModalOpen(true);
      localStorage.setItem(`course-${courseId.toString()}-modal-shown`, 'true');
    }
  }, [videoEnded, courseId]);



  console.log(videoEnded, "videoEnded");
  console.log(courseId, "courseId");
  console.log(isCourseCompleted, "isCourseCompleted");


  console.log(isCourseCompleted);



  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative dark:rounded-[36px] rounded-[36px] overflow-hidden"
      ref={containerRef}
    >
      {!videoEnded && (
        <div className="relative">
          <div
            ref={playerRef}
            className={cn(
              'max-w-full w-full border-none m-0 p-0 dark:rounded-[36px] rounded-[36px]',
              isFullscreen && 'w-screen h-screen object-contain bg-black'
            )}
            style={{ overflow: 'hidden' }}
          ></div>

          {/* Barra de Control personalizada */}

          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-6 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Barra de progreso */}
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 mb-4 appearance-none bg-white/30 rounded-full overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF5252 0%, #FF5252 ${(currentTime / duration) * 100
                  }%, rgba(255, 255, 255, 0.3) ${(currentTime / duration) * 100
                  }%, rgba(255, 255, 255, 0.3) 100%)`,
              }}
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Boton Play | Pause */}

                <button
                  onClick={goToPreviousLesson}
                  className="p-2 rounded dark:text-white text-white dark:hover:text-white/80 hover:text-white/80"
                >
                  <SkipBack className='h-4 w-4 sm:h-5 sm:w-5' />
                </button>

                <button
                  onClick={togglePlay}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5  text-white" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => goToTheNextLesson()}
                  className="p-2 rounded dark:text-white text-white dark:hover:text-white/80 hover:text-white/80"
                >
                  <SkipForward className='h-4 w-4 sm:h-5 sm:w-5' />
                </button>

                <div className="flex items-center gap-2">
                  {/* Boton Mute  */}

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
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
                      background: `linear-gradient(to right, white 0%, white ${volume * 100
                        }%, rgba(255, 255, 255, 0.3) ${volume * 100
                        }%, rgba(255, 255, 255, 0.3) 100%)`,
                    }}
                  />
                </div>

                <span className="text-white text-xs sm:text-sm ml-1 md:ml-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                {/* Botón de subtítulos */}
                <div className="relative flex ">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleSubtitles}
                          className={`text-white hover:text-white/80 transition-colors p-1 rounded ${subtitlesEnabled ? 'bg-[#FF5252]/50' : ''
                            }`}
                        >
                          <Subtitles className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="dark:text-white text-white">
                          {subtitlesEnabled ? 'Deshabilitar Subtitulos' : 'Habilitar Subtitulos'}
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
                        className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${!subtitlesEnabled ? 'bg-[#FF5252]/30' : ''
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
                          className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${subtitlesEnabled ? 'bg-[#FF5252]/30' : ''
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
                          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
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
                      {availableQualities.map(quality => (
                        <button
                          key={quality.id}
                          onClick={() => setQuality(quality.id)}
                          className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${currentQuality === quality.id ? 'bg-[#FF5252]/30' : ''
                            }`}
                        >
                          <div className="flex items-center">
                            <span>{quality.label}</span>
                            {currentQuality === quality.id && <Check className="h-4 w-4 sm:h-5 sm:w-5 ml-auto" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Menú de velocidad */}
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-md shadow-lg p-2 min-w-[150px] z-10 space-y-1 space-x-1">
                      <div className="text-white text-xs font-medium mb-1 px-2">Velocidad</div>
                      {playbackSpeeds.map(speed => (
                        <button
                          key={speed.value}
                          onClick={() => setPlaybackSpeed(speed.value)}
                          className={`w-full text-left px-2 py-1 text-sm text-white hover:bg-white/10 rounded ${currentSpeed === speed.value ? 'bg-[#FF5252]/30' : ''
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
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-white/80 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
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

      {videoEnded && !isLastLesson && <VideoCircleCountDown />}



      {/* Mostrar modal solo si el video terminó Y el curso está completamente terminado */}
      {/* {videoEnded && isCourseCompleted && isModalOpen && (
        <CourseCompletionModal
          onClose={() => setIsModalOpen(false)}
          courseId={`/${courseId}`}
        />
      )} */}

      {isModalOpen && (
        <CourseCompletionModal
          onClose={() => setIsModalOpen(false)}
          courseId={`/${courseId}`}
        />
      )}

    </div>
  );
};

export default VimeoPlayerWithCustomControls;
