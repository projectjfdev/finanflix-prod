import { Eye, Search, SearchX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import MediumTitle from '@/components/MediumTitle/MediumTitle';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import ModalClaseEnVivoUpdate from '@/components/Dashboard/ModalClaseEnVivoUpdate';
import liveLessonService from '@/utils/Services/livelessonsService';
import { Card } from '@/components/ui/card';
import { MainPagination } from '@/components/MainPagination/MainPagination';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import { BtnDeleteLiveLesson } from '@/components/Dashboard/BtnDeleteLiveLesson';

export default async function AdminLiveClassesPage({
  searchParams: { q = 'all', category = 'all', sort = 'newest', page = '1' },
}: {
  searchParams: {
    q: string;
    category: string;
    sort: string;
    page: string;
  };
}) {
  const getFilterUrl = ({
    c,
    s,

    pg,
  }: {
    c?: string;
    s?: string;

    pg?: string;
  }) => {
    const params = {
      q,
      category,

      sort,
      page,
    };
    if (c) params.category = c;

    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/dashboard/clases-en-vivo?${new URLSearchParams(params).toString()}#filtros`;
  };

  // const categories = await liveLessonService.getCategories();
  const { countLiveLessons, liveLessons, pages } = await liveLessonService.getByQuery({
    category,
    q,
    page,
    sort,
  });

  return (
    <div className="w-full ml-4 md:ml-8">
      <div className="text-2xl mb-3 font-poppins">
        <MediumTitle
          className="dark:text-white text-black"
          title="Administración de Clases en Vivo"
        />
      </div>
      <div className="flex-col dark:bg-background  rounded-2xl  mb-16" id="#filtros">
        <div className="flex items-center">
          <span className="font-bold text-primary mr-1">
            {liveLessons.length === 0 ? 'No' : countLiveLessons} Resultados
          </span>
          {q !== 'all' && q !== '' && ' - ' + q}
          {category !== 'all' && ' - ' + category}
          &nbsp;
          {(q !== 'all' && q !== '') || category !== 'all' ? (
            <Link href="/dashboard/clases-en-vivo">
              <Card className="w-full flex gap-3 ml-5 items-center justify-center py-2 hover:bg-secondary">
                <span>Eliminar filtros </span>
                <SearchX size={15} />
              </Card>
            </Link>
          ) : null}
        </div>
        <div className="flex items-center my-4 gap-1  dark:text-white text-black cursor-pointer bg-card rounded-full px-3 py-1 w-[250px]">
          <Search className="w-4 h-4 md:w-5 md:h-5" />
          <SearchBox actionForm="dashboard/clases-en-vivo" />
        </div>
        <div className="rounded-md border hidden md:block p-3 dark:bg-background bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveLessons?.map((liveClass: any) => {
                const serializedLiveClass = JSON.parse(JSON.stringify(liveClass));
                return (
                  <TableRow key={liveClass?._id.toString()}>
                    <TableCell className="font-medium">{liveClass?._id.toString()}</TableCell>
                    <TableCell>{liveClass.title}</TableCell>
                    <TableCell>
                      {liveClass?.createdAt
                        ? new Date(liveClass.createdAt).toLocaleDateString()
                        : 'Fecha no disponible'}
                    </TableCell>

                    <TableCell>{liveClass.category || 'N/A'}...</TableCell>

                    <TableCell className="text-left flex justify-end flex-col items-end ">
                      <Link
                        href={`/clase-en-vivo/${liveClass._id.toString()}?videoUrl=${liveClass.videoUrl
                          .split('/')
                          .pop()}`}
                        className="w-full text-end flex justify-end"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <ModalClaseEnVivoUpdate liveLesson={serializedLiveClass} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="text-end w-full flex justify-end  ">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-transparent w-fit  "
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la
                              clase en vivo y todos los datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <BtnDeleteLiveLesson liveLessonId={liveClass._id.toString()} />
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <MainPagination page={page} pages={pages} getFilterUrl={getFilterUrl} />
        </div>
        <div className="flex md:hidden p-4 w-full">
          <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
            {liveLessons?.map((liveClass: any) => {
              const serializedLiveClass = JSON.parse(JSON.stringify(liveClass));
              return (
                <AccordionItem
                  key={liveClass._id.toString()}
                  value={liveClass._id.toString()}
                  className="w-full border rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md "
                >
                  <AccordionTrigger className="text-left w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">
                        {liveClass && liveClass.title.length > 25
                          ? liveClass.title.substring(0, 25) + '...'
                          : liveClass.title}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {liveClass?.createdAt
                          ? new Date(liveClass.createdAt).toLocaleDateString()
                          : 'Fecha no disponible'}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="p-4  border-t flex flex-col gap-3">
                      <p className="text-sm dark:text-[#A7A7A7] text-gray-700 ">
                        <span className="font-semibold">Título:</span>{' '}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {liveClass?.title}
                        </span>
                      </p>

                      <Separator />

                      <p className="text-sm dark:text-[#A7A7A7] text-gray-700">
                        <span className="font-semibold">Fecha:</span>{' '}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {liveClass?.createdAt
                            ? new Date(liveClass.createdAt).toLocaleDateString()
                            : 'Fecha no disponible'}
                        </span>
                      </p>

                      <Separator />

                      <p className="text-sm dark:text-[#A7A7A7] text-gray-700">
                        <span className="font-semibold">Descripción:</span>{' '}
                        {liveClass.description.length > 100
                          ? `${liveClass.description.substring(0, 100)}...`
                          : liveClass.description}
                      </p>
                      <Separator />

                      <p className="text-sm dark:text-[#A7A7A7] text-gray-700">
                        <span className="font-semibold">Categoría:</span> {liveClass.category}
                      </p>
                      <Separator />

                      <div className="flex justify-start space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ModalClaseEnVivoUpdate liveLesson={serializedLiveClass} />
                          <span className="ml-2">Editar</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-100 dark:hover:bg-red-900"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la
                                clase en vivo y todos los datos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <BtnDeleteLiveLesson liveLessonId={liveClass._id.toString()} />
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
// {isApproved && (
//   <Alert
//     className={`mt-4 border ${
//       isApproved.success ? "border-green-500" : "border-red-500"
//     }`}
//   >
//     {/* <RocketIcon className="h-4 w-4" /> */}
//     <AlertTitle
//       className={isApproved.success ? "text-green-500" : "text-red-500"}
//     >
//       {isApproved.success ? "Eliminado" : "Algo falló"}
//     </AlertTitle>
//     <AlertDescription>{isApproved.message}</AlertDescription>
//   </Alert>
// )}
