'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';
import { getBannersTop, deleteBannerTopById } from '@/utils/Endpoints/bannersEndpoints';
import { IBannerTop } from '@/interfaces/bannerTop';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import MediumTitle from '@/components/MediumTitle/MediumTitle';
import moment from 'moment';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';

interface Props {
  message: string;
  success: null | boolean;
}

export default function PageBanners() {
  const [banners, setBanners] = useState<IBannerTop[]>([]);
  const [isApproved, setIsApproved] = useState<Props>();
  const [loading, setLoading] = useState(true);

  const getAllBanners = async () => {
    try {
      const res = await getBannersTop();
      setBanners(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBanners();
  }, []);

  const handleDeleteBanner = async (id: string) => {
    try {
      const resp = await deleteBannerTopById(id);
      setIsApproved(resp);
      if (resp.success) {
        setBanners(banners.filter(banner => banner._id.toString() !== id));
      }
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <LoadingFinanflix />
      </div>
    );
  }

  return (
    <div className="ml-4 md:ml-8 w-full">
      <div className="text-2xl mb-3 font-poppins">
        <MediumTitle className="dark:text-white text-black" title="Administración de Banners" />
      </div>
      <Card className="container mx-auto dark:bg-background bg:white  p-4">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fecha de entrada</TableHead>
                <TableHead>Fecha de salida</TableHead>
                <TableHead>Accion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners?.map((banner, index) => (
                <TableRow key={index} className="dark:text-white text-black">
                  <TableCell>
                    <Image
                      src={banner?.image?.url || ''}
                      alt={banner?.title || 'Imagen del Banner Top Finanflix'}
                      width={100}
                      height={50}
                      className="object-cover rounded w-[100px] h-[50px] "
                    />
                  </TableCell>
                  <TableCell>{banner?._id.toString()}</TableCell>
                  <TableCell className="font-medium ">
                    {banner?.title?.substring(0, 25)}...
                  </TableCell>
                  <TableCell>{banner?.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>{moment(banner.startDate).format('MMMM DD, YYYY')}</TableCell>
                  <TableCell>{moment(banner.endDate).format('MMMM DD, YYYY')}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner?._id.toString())}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden">
          <Accordion
            type="multiple"
            className="dark:bg-background bg-white p-0 m-0 rounded-lg mt-6"
          >
            {banners?.map((banner, index) => (
              <AccordionItem key={index} value={banner?._id.toString()}>
                <AccordionTrigger className="px-4">
                  <div className="flex items-center">
                    <Image
                      src={banner?.image?.url || ''}
                      alt={banner?.title || 'Imagen del banner Top Finanflix'}
                      width={50}
                      height={25}
                      className="object-cover rounded mr-2"
                    />
                    {/* <p> {banner?._id.toString()}</p> */}
                    <span className="font-medium text-[13px] mx-3 text-start truncate">
                      {banner?.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-4">
                    <Image
                      src={banner?.image?.url || ''}
                      alt={banner?.title || 'Imagen del banner Top Finanflix'}
                      width={200}
                      height={100}
                      className="object-cover rounded"
                    />
                    <div className="space-y-0 divide-y dark:divide-gray-800 divide-gray-200">
                      <p className="py-2 px-4 dark:hover:bg-gray-800 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <strong>ID:</strong> {banner._id.toString()}
                      </p>
                      <p className="py-2 px-4 dark:hover:bg-gray-800 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <strong>Título:</strong> {banner.title}
                      </p>
                      <p className="py-2 px-4 dark:hover:bg-gray-800 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <strong>Descripcion:</strong> {banner.description}
                      </p>
                      <p className="py-2 px-4 dark:hover:bg-gray-800 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <strong>Status:</strong> {banner?.isActive ? 'Active' : 'Inactive'}
                      </p>
                      <p className="py-2 px-4 dark:hover:bg-gray-800 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <strong>Fecha de Entrada:</strong>{' '}
                        {formatDate(banner?.createdAt.toString())}
                      </p>
                      <p className="py-2 px-4 dark:hover:bg-gray-800 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <strong>Fecha de Salida:</strong> {formatDate(banner?.createdAt.toString())}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner._id.toString())}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {isApproved && (
          <Alert
            className={`mt-4 border ${isApproved.success ? 'border-green-500' : 'border-red-500'}`}
          >
            {/* <RocketIcon className="h-4 w-4" /> */}
            <AlertTitle className={isApproved.success ? 'text-green-500' : 'text-red-500'}>
              {isApproved.success ? 'Eliminado' : 'Algo falló'}
            </AlertTitle>
            <AlertDescription>{isApproved.message}</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
}
