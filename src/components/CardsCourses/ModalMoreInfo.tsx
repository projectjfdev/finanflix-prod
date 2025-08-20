import { Ban, Lock, Unlock } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import './modalmoreinfo.css';
import { ISection } from '@/interfaces/course';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';

interface Props {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  userHasSubscription: boolean; // Prop to indicate if the user has a subscription
  myCourses: boolean | undefined;
  sections?: ISection[];
  outOfSale?: boolean; // Prop to indicate if the course is out of sale
  isOnlyForSubscribers?: boolean;
  handleRedirectBtn: (id: string) => void; // Function to handle redirection
  open?: boolean; // New prop to control dialog state
  onOpenChange?: (open: boolean) => void; // New prop to handle state changes
}

export const ModalMoreInfo = ({
  _id,
  thumbnail,
  title,
  description,
  sections,
  userHasSubscription,
  myCourses,
  handleRedirectBtn,
  open,
  onOpenChange,
  outOfSale,
  isOnlyForSubscribers,
}: Props) => {
  // Función para manejar el clic en "Ver Curso"
  const handleViewCourse = () => {
    // Intentar obtener la última lección vista del localStorage
    try {
      const lastLessonId = localStorage.getItem(`course-${_id}-last-lesson`);

      if (lastLessonId) {
        // Si hay una última lección, verificar si es video o texto
        const lastLessonVideo = localStorage.getItem(`course-${_id}-last-lesson-video`);
        const lastLessonText = localStorage.getItem(`course-${_id}-last-lesson-text`);

        // Construir la URL de redirección según el tipo de lección
        if (lastLessonVideo) {
          window.location.href = `/curso/${_id}?videoUrl=${lastLessonVideo}&lessonId=${lastLessonId}`;
          return;
        } else if (lastLessonText) {
          window.location.href = `/curso/${_id}?textContent=${lastLessonText}`;
          return;
        }
      }

      // Si no hay última lección o falla algo, usar la redirección predeterminada
      handleRedirectBtn(_id);
    } catch (error) {
      // console.error('Error accessing localStorage:', error);
      // En caso de error, usar la redirección predeterminada
      handleRedirectBtn(_id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeButtonClassName="..."
        className="sm:max-w-[700px] max-h-[90vh] p-0 flex flex-col overflow-hidden"
      >
        {/* Imagen fija arriba, no scrolleable */}
        <div className="relative aspect-video w-full shrink-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 pointer-events-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-32 before:bg-gradient-to-t before:from-background before:to-transparent" />
        </div>

        {/* Contenido scrollable */}
        <div className="px-8 pb-8 overflow-y-auto grow custom-scrollbar">
          {myCourses || userHasSubscription ? (
            <Button
              onClick={handleViewCourse}
              className="text-sm flex px-5 py-2 mt-6 mb-4 bg-[#4A90E2] rounded-full text-white font-poppins hover:bg-[#3f7abe] border-none"
            >
              <Unlock size={16} className="mr-2" />
              Ver Curso
            </Button>
          ) : (
            <Button
              onClick={() => handleRedirectBtn(_id)}
              className={cn(
                'text-white border-none text-sm font-poppins py-2 px-4 mt-6 mb-4 rounded-full flex items-center',
                outOfSale
                  ? 'bg-gray-500 dark:bg-gray-600 hover:bg-gray-600'
                  : 'bg-[#4BBD3A] hover:bg-[#4bbd3ac7]'
              )}
            >
              {outOfSale ? <Ban size={16} className="mr-2" /> : <Lock size={16} className="mr-2" />}
              {isOnlyForSubscribers ? (
                <span>Suscribirme</span>
              ) : (
                <span>{outOfSale ? 'Consultar' : 'Comprar'}</span>
              )}
            </Button>
          )}

          <div className="text-base text-muted-foreground my-4">{title}</div>
          <p className="text-base text-foreground">{description}</p>

          <Accordion type="multiple">
            {sections?.map((chapter, index) => (
              <AccordionItem value={`section-${index}`} key={index}>
                <AccordionTrigger className="text-left text-sm sm:text-[14px] font-medium flex justify-between gap-2 dark:text-white text-white">
                  Sección {index + 1}: {chapter.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 px-2 py-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {chapter?.lessons?.map((lesson, lessonIndex) =>
                      lesson.isFree || myCourses || userHasSubscription ? (
                        <a
                          key={lessonIndex}
                          href={
                            myCourses || userHasSubscription
                              ? `/curso/${_id}?videoUrl=${lesson?.videoUrl
                                ?.split('/')
                                .pop()}&lessonId=${lesson?._id}`
                              : `/freeLesson/${lesson?.videoUrl?.split('/').pop()}`
                          }
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted text-primary"
                        >
                          <span className="flex-1">{lesson.title}</span>
                          <Unlock className="h-4 w-4 text-gray-400" />
                        </a>
                      ) : (
                        <div
                          key={lessonIndex}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-muted/30 text-gray-400"
                        >
                          <span className="flex-1">{lesson.title}</span>
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                      )
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};
