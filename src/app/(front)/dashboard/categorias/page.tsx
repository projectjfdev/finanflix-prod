'use client';

import React, { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategoryById,
  getCategories,
} from '@/utils/Endpoints/adminEndpoints';

import { Separator } from '@/components/ui/separator';

import { SuccessModal } from '@/components/SuccessModal/SuccesModal';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { InputText } from '@/components/Inputs/InputText';
import { Button } from '@/components/ui/button';
import { ICategory } from '@/interfaces/category';
import { Trash2 } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

interface ApprovedProps {
  message: string;
  success: boolean;
}

interface DeleteProps {
  message: string;
  success: boolean;
}

export default function CategoriasPage() {
  const [isApproved, setIsApproved] = useState<ApprovedProps>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>();
  const [deleteCategory, setDeleteCategory] = useState<DeleteProps>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getCats = async () => {
    const res = await getCategories();
    setCategories(res?.data);
  };

  const onSubmit = async (data: Record<string, any>) => {
    const res = await createCategory(data);
    setIsApproved(res);
    setShowSuccessModal(true);
    if (res.success) {
      await getCats();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await deleteCategoryById(id);
    setDeleteCategory(res);
    if (res.success) {
      await getCats();
    }
  };

  useEffect(() => {
    getCats();
  }, []);

  return (
    <div className="w-full">
      {/* Título Principal */}
      <div className="text-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Crear una nueva categoría</h1>
      </div>

      {/* Descripción */}
      <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
        Crea una nueva categoría para organizar los cursos de{' '}
        <span className="font-semibold text-primary">Finanflix</span>.
        <br />
        <span className="font-medium">Paso 1:</span> Ingresa un nombre único para la categoría.
        <br />
        <span className="font-medium">Paso 2:</span> Haz clic en{' '}
        <span className="font-semibold">Crear categoría</span> para agregarla al sistema.
      </p>
      <Separator className="my-4" />
      <div className="flex justify-center gap-5">
        <form className="space-y-5 text-center" onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="name" className="text-base md:text-lg">
            Nombre de la categoría
          </Label>
          <InputText
            type="text"
            errors={errors?.name?.message}
            placeholder="Ejemplo: Análisis técnico"
            className="dark:bg-card bg-background rounded-md border"
            register={register('name')}
            name="name"
          />
          <Button type="submit" className="bg-primary hover:bg-secondary">
            Crear categoría
          </Button>
        </form>
      </div>

      <Separator className="my-4" />

      {isApproved && showSuccessModal && (
        <SuccessModal
          success={isApproved.success}
          text={isApproved.message}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {/* CATEOGIRAS DISPONIBLES */}
      <h5 className="w-full text-center text-base md:text-lg">Categorias disponibles</h5>
      <div className="w-full flex justify-center text-center mt-5 ">
        <Card className="mx-auto py-7 px-10 md:px-20 dark:text-white text-black ">
          {categories?.map(e => (
            <div key={e._id.toString()} className="flex w-full items-center justify-between gap-5 ">
              <p>{e.name}</p>

              <div className="flex justify-center  items-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2
                      className="cursor-pointer dark:hover:text-gray-400 hover:text-gray-400"
                      size={16}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Está completamente seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Vas a eliminar la categoría <span className="font-bold">{e.name}</span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCategory(e._id.toString())}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </Card>
      </div>
      {deleteCategory && (
        <Alert
          className={`mt-4 border ${
            deleteCategory.success ? 'border-green-500' : 'border-red-500'
          }`}
        >
          {/* <RocketIcon className="h-4 w-4" /> */}
          <AlertTitle className={deleteCategory.success ? 'text-green-500' : 'text-red-500'}>
            {deleteCategory.success ? 'Eliminada' : 'Algo falló'}
          </AlertTitle>
          <AlertDescription>{deleteCategory.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
