'use client';

import { IUserCourse } from '@/interfaces/courseModel';
import { lessonIsViewed } from '@/utils/Endpoints/coursesEndpoint';
import { formatDuration } from '@/utils/FormatDuration/FormatDuration';
import { BookOpenText, Check, FileDown, TvMinimalPlay } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback, useRef } from 'react';

interface Props {
  id: string;
  videoUrl?: string;
  textContent?: string;
  lessonIndex: number;
  // videoDurations: Map<string, number>;
  videoUrlLesson?: string;
  title: string;
  type: string;
  key: string;
  downloadableFile?: string;
  lessonId: string;
  duration: number;
  isActive?: boolean;
  sectionIndex: number; // NUEVO: Prop para indicar si esta lección está activa
}

const ButtonChangeLesson = ({
  id,
  videoUrl,
  textContent,
  lessonIndex,
  // videoDurations,
  duration,
  videoUrlLesson,
  title,
  type,
  key,
  downloadableFile,
  lessonId,
  isActive = false,
  sectionIndex, // NUEVO: Valor por defecto false
}: Props) => {
  const { data: session } = useSession();
  const [courseProgress, setCourseProgress] = useState<IUserCourse>();
  // utilizo useRef para evitar repeticiones
  // const isFetched = useRef(false);

  const encodeUrl = (url: string) => Buffer.from(url).toString('base64');

  const urlWithoutProtocol = textContent?.replace(/^https?:\/\//, '');
  const encodedTextContent = urlWithoutProtocol ? encodeUrl(urlWithoutProtocol) : '';

  useEffect(() => {
    const handleIsViewed = async () => {
      if (!session?.user?._id || !id) return;

      try {
        const response = await fetch(
          `/api/cursos/course-progress/find-one?userId=${session?.user?._id}&courseId=${id}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch course progress');
        }

        const data = await response.json();
        setCourseProgress(data);
      } catch (error) {
        console.error('Error fetching course progress:', error);
      }
    };

    // FIXED: De esta manera se evita multiples peticiones a api/cursos/course-progress/find-one etc
    // if (!isFetched.current) {
    //   isFetched.current = true;
    // }
    handleIsViewed();
  }, [id, session?.user?._id]); // handle is viewed se ejecuta solo cuando se monta o id de curso o use session id cambia

  const saveOpenSection = () => {
    try {
      // Guardar el índice de la sección actual en localStorage
      localStorage.setItem(`course-${id}-open-section`, String(sectionIndex));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Función para guardar la lección actual en localStorage
  const saveLastViewedLesson = () => {
    try {
      // Guardar el ID de la lección actual en localStorage
      localStorage.setItem(`course-${id}-last-lesson`, lessonId);

      // 👉 Guardar el índice de la lección (ej: '03')
      localStorage.setItem(`course-${id}-last-lesson-index`, String(lessonIndex));

      // Guardar información adicional necesaria para la redirección
      if (type === 'videoUrl' && videoUrl) {
        localStorage.setItem(`course-${id}-last-lesson-video`, videoUrl);
      } else if (textContent) {
        localStorage.setItem(`course-${id}-last-lesson-text`, encodedTextContent);
      }
    } catch (error) {
      console.error('Error saving lesson to localStorage:', error);
    }
  };

  // Memoize button click handler
  const handleButtonClickVideo = useCallback(() => {
    saveOpenSection();
    saveLastViewedLesson(); // Guardar la lección actual antes de navegar
    window.location.href = `/curso/${id}?videoUrl=${videoUrl}&lessonId=${lessonId}`;
  }, [id, videoUrl, lessonId, sectionIndex]);

  // Check if the specific lesson has been viewed (with `isViewed.status`)
  const isLessonViewed = (lessonId: string) => {
    // Verificar si secciones y lecciones existen y si la lección tiene la propiedad isViewed.status
    return (
      courseProgress?.progress?.some(section =>
        section?.lessons?.some(
          lesson => lesson?.lessonId?.toString() === lessonId && lesson?.isViewed?.status === true
        )
      ) ?? false
    );
  };

  const handleButtonClickPDF = useCallback(async () => {
    saveOpenSection();
    saveLastViewedLesson(); // Guardar la lección actual antes de navegar
    window.location.href = `/curso/${id}?textContent=${encodedTextContent}`;
    const res = await lessonIsViewed({
      lessonId,
      userCourseId: courseProgress?._id?.toString(),
    });
    if (res.success) {
      fetch(
        `/api/revalidate?path=/api/cursos/course-progress/find-one?userId=${session?.user?._id}&courseId=${id}`
      );
    }
  }, [id, textContent, lessonId, courseProgress, sectionIndex]);

  return (
    <>
      {type === 'videoUrl' ? (
        <div className="overflow-hidden break-words">
          <div
            key={key}
            onClick={handleButtonClickVideo}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition ${isActive
              ? 'bg-primary/10 border-l-4 border-primary'
              : 'dark:hover:bg-muted hover:bg-[#E0EAF3] '
              }`}
          >
            <div className="bg-[#4527A0] text-white rounded-lg p-2 mr-3 flex items-center justify-center">
              <TvMinimalPlay className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <span className="font-medium">
                { /* Lección*/} {String(lessonIndex + 1).padStart(2, '0')}: {title}
              </span>
              <div className="flex items-center text-sm dark:text-white text-black">
                Lección {String(lessonIndex + 1)} {videoUrlLesson && duration ? `- ${formatDuration(duration)} min` : ''}
                {isLessonViewed(lessonId) && (
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                )}
              </div>
            </div>
          </div>

          {/* {downloadableFile && (
            <a
              href={downloadableFile}
              // download
              rel="noopener noreferrer"
              className="flex  p-3 py-1 dark:hover:bg-muted hover:bg-[#E0EAF3] items-center text-gray-400 font-thin "
              target="_blank"
            >
              <div className="bg-[#4527A0] text-white rounded-lg p-2 mr-3 flex items-center justify-center">
                <FileDown className="h-3 w-3" />
              </div>
              <div className='flex-1'><span className="text-sm dark:text-white text-black">Material de estudio - clase {lessonIndex + 1}</span></div>
            </a>
          )} */}

          {downloadableFile && (
            <a
              href={`https://docs.google.com/gview?url=${encodeURIComponent(downloadableFile)}&embedded=true`}
              rel="noopener noreferrer"
              className="flex gap-3 pl-3 py-1 dark:hover:bg-muted hover:bg-[#E0EAF3] w-full items-center text-gray-400 font-thin"
              target="_blank"
            >
              <FileDown size={15} />
              <span className="text-[12px]">Material de estudio - clase {lessonIndex + 1}</span>
            </a>
          )}
        </div>
      ) : (
        <div>
          <div
            key={lessonIndex}
            onClick={handleButtonClickPDF}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition ${isActive
              ? 'bg-primary/10 border-l-4 border-primary'
              : 'dark:hover:bg-muted hover:bg-[#E0EAF3]'
              }`}
          >
            <div className="bg-[#4527A0] text-white rounded-lg p-2 mr-3 flex items-center justify-center">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="font-medium">
                Lección {String(lessonIndex + 1).padStart(2, '0')}: {title}
              </span>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                Texto
                {isLessonViewed(lessonId) && (
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                )}
              </div>
            </div>
          </div>

          {/* {downloadableFile && (
            // <a
            //   href={downloadableFile}
            //   // download
            //   rel="noopener noreferrer"
            //   className="flex gap-3 pl-3 py-1 dark:hover:bg-muted hover:bg-[#E0EAF3] w-full items-center text-gray-400 font-thin"
            //   target="_blank"
            // >
            //   <FileDown size={15} />
            //   <span className="text-[12px]">Material de estudio - clase {lessonIndex + 1}</span>
            // </a>
              )} */}

          {downloadableFile && (
            <a
              href={`https://docs.google.com/gview?url=${encodeURIComponent(downloadableFile)}&embedded=true`}
              rel="noopener noreferrer"
              className="flex gap-3 pl-3 py-1 dark:hover:bg-muted hover:bg-[#E0EAF3] w-full items-center text-gray-400 font-thin"
              target="_blank"
            >
              <FileDown size={15} />
              <span className="text-[12px]">Material de estudio - clase {lessonIndex + 1}</span>
            </a>
          )}

        </div>
      )}
    </>
  );


};

export default ButtonChangeLesson;
