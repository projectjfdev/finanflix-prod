'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, ChevronsUpDown, Router } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Types } from 'mongoose';
import { getUsersByEmail } from '@/utils/Endpoints/adminEndpoints';
import { Card } from '../ui/card';

interface IEnrolledCourses {
  _id: Types.ObjectId;
  title: string;
}

interface UserProps {
  _id: Types.ObjectId;
  email: string;
  username: string;
  enrolledCourses: IEnrolledCourses[];
}

interface ApprovedProps {
  message: string;
  success: null | boolean;
}

export const RemoveUserCourse = () => {
  const [openUser, setOpenUser] = useState(false);
  const [valueUserRemove, setValueUserRemove] = useState('');
  const [usersRemove, setUsersRemove] = useState<UserProps[]>([]);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isApprovedRemove, setIsApprovedRemove] = useState<ApprovedProps>();
  const [visibleCourses, setVisibleCourses] = useState<IEnrolledCourses[]>([]);

  const getUsers = async (searchValue: string) => {
    setLoadingRemove(true);
    try {
      const res = await getUsersByEmail(searchValue);
      setUsersRemove(res.data || []);
    } catch (error) {
      // console.error('Error al obtener usuarios:', error);
      setUsersRemove([]);
    } finally {
      setLoadingRemove(false);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    setValueUserRemove(searchValue);
    if (searchValue) {
      setTimeout(() => {
        getUsers(searchValue);
      }, 500);
    }
  };

  const selectedUser = usersRemove.find(u => u.email === valueUserRemove);

  const handleCheckboxChange = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const handleDeleteCourses = async () => {
    try {
      const queryString = selectedCourses.map(id => `courses=${id}`).join('&');
      const response = await fetch(
        `/api/admin/remove-user-course/${selectedUser?._id}?${queryString}`,
        { method: 'DELETE' }
      );

      const res = await response.json();

      if (res.success) {
        setIsApprovedRemove(res);
        setSelectedCourses([]);
        // setTimeout(() => {
        //   window.location.href = '/dashboard/cursos-de-usuarios';
        // }, 3000);

        setVisibleCourses(prevCourses =>
          prevCourses.filter(course => !selectedCourses.includes(course._id.toString()))
        );
      }

      // alert("Cursos eliminados correctamente.");
    } catch (error) {
      // console.error('Error al eliminar cursos:', error);
      alert('Hubo un error al eliminar los cursos.');
    }
  };

  return (
    <div className="w-full flex flex-col justify-center ">
      <Card className="mx-auto py-7 px-5  md:px-20 shadow-lg">
        <Popover open={openUser} onOpenChange={setOpenUser}>
          <PopoverTrigger asChild>
            <div className="dark:text-white text-black">
              <Button variant="outline" role="combobox" aria-expanded={openUser}>
                {valueUserRemove
                  ? usersRemove.find(u => u.email === valueUserRemove)?.email || 'Sin resultados'
                  : 'Selecciona un usuario...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>

          <PopoverContent className="p-0 w-full ">
            <Command>
              <CommandInput
                placeholder="Buscar por email..."
                value={valueUserRemove}
                onValueChange={handleSearchChange}
              />
              <CommandList>
                {loadingRemove ? (
                  <div className="p-4 text-center">Buscando...</div>
                ) : (
                  <>
                    <CommandEmpty>No hay resultados.</CommandEmpty>
                    <CommandGroup>
                      {usersRemove.length > 0 &&
                        usersRemove.map(u => (
                          <CommandItem
                            key={u._id.toString()}
                            value={u.email}
                            // onSelect={currentValue => {
                            //   setValueUserRemove(
                            //     currentValue === valueUserRemove ? '' : currentValue
                            //   );
                            //   setOpenUser(false);
                            // }}
                            onSelect={currentValue => {
                              setValueUserRemove(
                                currentValue === valueUserRemove ? '' : currentValue
                              );
                              const user = usersRemove.find(u => u.email === currentValue);
                              if (user) {
                                setVisibleCourses(user.enrolledCourses);
                              } else {
                                setVisibleCourses([]);
                              }
                              setOpenUser(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                valueUserRemove === u.email ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {u.email}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="mt-4 dark:text-white text-black truncate">
          {selectedUser ? (
            <div>
              <h2 className="font-semibold">Cursos inscritos de {selectedUser.username}:</h2>
              <ul className="list-disc ml-4 py-3">
                {/* {selectedUser.enrolledCourses.map(course => (
                  <li key={course._id.toString()} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id.toString())}
                      onChange={() => handleCheckboxChange(course._id.toString())}
                      className="mr-2"
                    />
                    {course.title}
                  </li>
                ))} */}

                {visibleCourses.map(course => (
                  <li key={course._id.toString()} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id.toString())}
                      onChange={() => handleCheckboxChange(course._id.toString())}
                      className="mr-2"
                    />
                    {course.title}
                  </li>
                ))}
              </ul>
              <Button
                variant="destructive"
                onClick={handleDeleteCourses}
                className="mt-4 hover:bg-secondary"
              >
                Eliminar cursos seleccionados
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 w-full break-words hidden md:flex">
                Selecciona un usuario para ver y eliminar sus cursos.
              </p>
              <p className="text-gray-500 w-full break-words flex md:hidden p-0 m-0">
                Selecciona un usuario
              </p>
            </>
          )}
        </div>
        {isApprovedRemove && (
          <Alert
            className={`mt-4 border ${isApprovedRemove.success ? 'border-green-500' : 'border-red-500'
              }`}
          >
            {/* <RocketIcon className="h-4 w-4" /> */}
            <AlertTitle className={isApprovedRemove.success ? 'text-green-500' : 'text-red-500'}>
              {isApprovedRemove.success ? 'Eliminado' : 'Algo falló'}
            </AlertTitle>
            <AlertDescription>{isApprovedRemove.message}</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};
