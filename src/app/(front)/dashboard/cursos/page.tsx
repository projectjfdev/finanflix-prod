"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Plus, Share2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import MediumTitle from "@/components/MediumTitle/MediumTitle";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICourse } from "@/interfaces/course";
import { getAllCourses } from "@/utils/Endpoints/coursesEndpoint";
import ModalCourseUpdate from "@/components/Dashboard/ModalCourseUpdate";
// import { Loading } from "@/utils/Loading/Loading";
import { LoadingFinanflix } from "@/utils/Loading/LoadingFinanflix";
import { deleteCourse } from "@/utils/Endpoints/endpointsConfig";

import { Toaster, toast } from "sonner";
import BigTitle from "@/components/BigTitle/BigTitle";
import { Separator } from "@/components/ui/separator";
import { useObtainURL } from "@/hooks/useObtainURL";
import { ISubscriptionPlan } from "@/interfaces/subscriptionPlan";
import { getSuscriptionsPlans } from "@/utils/Endpoints/suscriptionsPlanEndpoint";

export default function CoursesSection() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [suscriptions, setSuscriptions] = useState<ISubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteValue, setConfirmDeleteValue] = useState("");
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const { currentUrl } = useObtainURL();

  const getCourses = async () => {
    try {
      const res = await getAllCourses();
      setCourses(res?.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSuscriptions = async () => {
    try {
      const res = await getSuscriptionsPlans();
      setSuscriptions(res?.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    getSuscriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      if (confirmDeleteValue === "quiero-borrar-mi-curso") {
        await deleteCourse(courseId);

        toast.success("Curso Eliminado!", {
          description: "El curso ha sido eliminado exitosamente.",
          action: {
            label: "X",
            onClick: () => {
              window.close();
            },
          },
        });

        return;
        // setTimeout(() => {
        //   router.push("/dashboard")
        // }, 3000);
        // return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // const handleShare = () => {
  //   const testUrl = `http://localhost:3000/course/${courses?._id.toString()}`
  //   navigator.clipboard.writeText(testUrl).then(() => {
  //     setShowShareTooltip(true)
  //     setTimeout(() => setShowShareTooltip(false), 2000)
  //   })
  // }

  const handleShare = (courseId: string) => {
    // const courseUrl = `https://finanflix-project.vercel.app/checkout/${courseId}`;
    const courseUrl = `${currentUrl}/checkout/${courseId}`;
    navigator.clipboard.writeText(courseUrl).then(() => {
      // TODO: Solucionar despues toasters duplicados
      // toast.success("URL copiada al portapapeles!");
      alert("url copiada exitosamente");
    });
  };

  return (
    <div className="ml-4 md:ml-8 h-screen flex flex-col w-full">
      <MediumTitle
        title="Cursos del Administrador"
        className="dark:text-white text-black"
      />
      <Card className="dark:bg-background bg-white px-4 pb-4 h-full mb-10 dark:shadow-gray-950 shadow-gray-200  border shadow-2xl mt-3 rounded-3xl flex flex-col">
        <div className="text-2xl font-poppins flex flex-col md:flex-row items-start gap-1 md:gap-0 md:justify-between ">
          <div className="md:ml-3 py-4">
            <Link href={"/dashboard/nuevo-curso"}>
              <div className="bg-primary text-primary-foreground hover:bg-primary/90 text-white text-[10.48px] md:text-sm rounded-full flex py-1 px-3 md:p-3 gap-1 items-center justify-center">
                <Plus className="h-3 w-3 md:h-4 md:w-4 text-white" /> Crear
                Curso
              </div>
            </Link>
          </div>
        </div>
        <Card className="dark:bg-background bg-white p-5 flex-grow border overflow-hidden rounded-lg">
          <ScrollArea className="h-full w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {courses?.map((course) => (
                <Card className="flex flex-col shadow-lg transition-transform duration-300 ease-in-out hover:scale-[1.009] hover:shadow-xl relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-white/80 hover:bg-white"
                      onClick={() => handleShare(course?._id.toString())}
                    >
                      <Share2 className="h-4 w-4 text-gray-800" />
                    </Button>
                    {showShareTooltip && (
                      <div className="absolute right-0 mt-2 px-2 py-1 bg-black text-white text-xs rounded">
                        URL copied!
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-0">
                    <div className="relative w-full pt-[56.25%]">
                      <Image
                        className="object-cover rounded-t-lg"
                        src={course?.thumbnail?.url || "/finanflix.png"}
                        alt={course.title || "Imagen del curso finanflix"}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 ">
                    <CardTitle className="mb-2 truncate dark:text-white text-black ">
                      {course.title}
                    </CardTitle>
                    <p className="dark:text-[#A7A7A7] text-black mb-3 font-poppins truncate">
                      {course?.subtitle}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-start gap-3 p-4 dark:bg-gray-800 rounded-b-lg dark:text-white text-black ">
                    <Link
                      href={`/curso/${course?._id}`}
                      className="border border-input h-9 w-9 flex justify-center dark:bg-background items-center shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full"
                    >
                      <Eye className="dark:text-white text-black h-4 w-4" />
                    </Link>
                    <Button variant="outline" size="icon">
                      <ModalCourseUpdate course={course} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Para confirmar la eliminación, por favor, copia y
                            pega el siguiente valor en el campo de abajo:
                            <strong>"quiero-borrar-mi-curso"</strong>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="p-4">
                          <input
                            type="text"
                            value={confirmDeleteValue}
                            onChange={(e) =>
                              setConfirmDeleteValue(e.target.value)
                            }
                            className="border p-2 w-full max-w-xs"
                            placeholder="Escribe aquí el código para confirmar"
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteCourse(course._id.toString())
                            }
                            disabled={
                              confirmDeleteValue !== "quiero-borrar-mi-curso"
                            }
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Separator />
            <BigTitle
              className="dark:text-white text-black pt-[21px] pb-3 text-2xl"
              title="Suscripciones Finanflix"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {suscriptions.map((e) => {
                // Tipos de suscripción
                const subscriptionTypes = ["basic", "icon", "diamond"];

                return (
                  <Card
                    className="flex flex-col shadow-lg transition-transform duration-300 ease-in-out hover:scale-[1.009] hover:shadow-xl relative"
                    key={e._id.toString()}
                  >
                    <CardHeader className="p-0">
                      <div className="relative w-full pt-[56.25%]">
                        <Image
                          className="object-cover rounded-t-lg"
                          src="/finanflix.png"
                          alt="Imagen del curso finanflix"
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                      <CardTitle className="mb-2 truncate dark:text-white text-black">
                        Suscripción {e.name}
                      </CardTitle>
                      <p className="dark:text-[#A7A7A7] text-black mb-3 font-poppins truncate">
                        Tipos de suscripciones:
                      </p>
                      <div>
                        {subscriptionTypes.map((subscriptionType) => (
                          <div
                            key={subscriptionType}
                            className="flex items-center justify-between mb-2"
                          >
                            <p className="text-lg font-semibold text-gray-700 dark:text-white">
                              Tipo: {subscriptionType}
                            </p>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const courseUrl = `${currentUrl}/suscripcion/${e._id.toString()}?type=${subscriptionType}&step=billing`;
                                  navigator.clipboard
                                    .writeText(courseUrl)
                                    .then(() => {
                                      alert(
                                        `URL ${e.frequencyType} de tipo ${subscriptionType} copiada`
                                      );
                                    });
                                }}
                                className="rounded-full p-2"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Link
                                href={`${currentUrl}/suscripcion/${e._id.toString()}?type=${subscriptionType}`}
                                className="border border-input h-9 w-9 flex justify-center items-center shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full p-2"
                              >
                                <Eye className="dark:text-white text-black h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      </Card>
    </div>
  );
}
