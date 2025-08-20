'use client';

import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { getBannersTop } from '@/utils/Endpoints/bannersEndpoints';
import { IBannerTop } from '@/interfaces/bannerTop';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';
import Link from 'next/link';

const CarouselBannerTop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const plugin = React.useRef(
    Autoplay({
      delay: 8000,
      stopOnInteraction: false,
      // stopOnLastSnap: true,
      stopOnFocusIn: true,
      // jump: true,
    })
  );
  const [banners, setBanners] = useState<IBannerTop[]>([]);

  // TODO: CAMBIOS TEST
  const getAllBanners = async () => {
    try {
      setIsLoading(true);
      const res = await getBannersTop();
      if (res.success) {
        setBanners(res.data);
      } else {
        console.error('No banners found');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBanner = (e: string) => {
    router.push(e);
  };

  useEffect(() => {
    getAllBanners();
  }, []);

  if (!banners) {
    return <div></div>;
  }

  if (isLoading) {
    return (
      <Card className="w-full dark:bg-background bg-white rounded-xl ">
        <div className="relative mx-auto h-[240px] md:h-[450px] flex dark:bg-background bg-white rounded-xl">
          <Skeleton className="w-full h-full rounded-lg dark:bg-background bg-white " />
          <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-12 md:w-1/2 dark:bg-background bg-white">
            <div className="space-y-4 md:space-y-6 w-full dark:bg-transparent">
              <Skeleton className="h-8 w-3/4 dark:bg-card" />
              <Skeleton className="h-4 w-full  dark:bg-card" />
              <Skeleton className="h-4 w-2/3  dark:bg-card" />
              <Skeleton className="h-10 w-1/3  dark:bg-card" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    // Esto hace que el carrousel de la home sea full Screen saliendo de la limitacion del contenedor Layout `${banner.clickeable ? "/programas" :"#"}`}
    <div className="md:w-screen md:ml-[calc(-50vw+50%)]">
      <Carousel
        plugins={[plugin.current]}
        onMouseLeave={plugin.current.reset}
        opts={{ align: 'center' }}
        orientation="horizontal"
      >
        <CarouselContent className="overflow-visible gap-0 px-0 md:gap-4 md:px-4">
          {banners?.map((banner, index) => (
            <CarouselItem
              key={banner._id.toString()}
              className="basis-[85%] sm:basis-[70%] md:basis-1/2 shrink-0" //  className="md:basis-1/2"
            >
              <Link
                href={`${banner.clickeable ? banner.redirect : '#'}`}
                className={
                  banner.clickeable ? 'cursor-pointer w-full' : 'cursor-default pointer-events-none'
                }
              >
                <div className="relative aspect-[4/2.5] md:aspect-[16/10] w-full">
                  <Image
                    src={banner.image.url!}
                    alt={banner.title || 'Carousel image'}
                    fill
                    className="sm:rounded-lg rounded-sm"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  <div className="relative z-20 text-black flex flex-col items-start justify-center p-8 md:p-12 ">
                    {/* Fondo negro con opacidad */}
                    <div className="relative z-20 space-y-4 dark:font-groteskBold10  font-groteskBold10  p-4 ">
                      {banner.title && (
                        <>
                          <div className="absolute inset-0 rounded-2xl  -z-10"></div>
                          <h2 className="font-groteskBold25 text-xl md:text-3xl lg:text-5xl font-bold leading-tight text-white">
                            {banner.title}
                          </h2>
                        </>
                      )}

                      <article className="text-sm md:text-lg text-white font-groteskLight leading-5 font-bold w-full md:w-4/6">
                        {banner.description}
                      </article>

                      {banner?.redirect && (
                        <div>
                          <Button
                            onClick={() => redirectBanner(banner?.redirect!)}
                            className="bg-transparent border border-white border-solid text-white font-groteskLight leading-5  px-4 py-2 md:px-6 md:py-5 rounded-full font-bold hover:bg-primary  transition-colors  text-xs md:text-sm"
                          >
                            {banner?.cta || 'Empezar curso'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Chevron next y previous Desk */}
        {banners?.length > 1 && (
          <div className="w-full hidden md:block">
            {/* <div className="hidden md:flex">
              <CarouselPrevious className="w-8 h-8 md:h-12 md:w-12 -translate-x-[-30px] md:-translate-x-[-23px] transform -translate-y-1/2 z-30 dark:hover:bg-[#D1D1D1] hover:bg-[#D1D1D1] dark:bg-[#D1D1D1] bg-black dark:text-black text-white" />
              <CarouselNext className="w-8 h-8 md:h-12 md:w-12 -translate-x-[30px] md:-translate-x-[23px] transform -translate-y-1/2 z-30 dark:hover:bg-[#D1D1D1] hover:bg-[#D1D1D1] dark:bg-[#D1D1D1] bg-black dark:text-black text-white" />
            </div> */}
            {/* Chevron next y previous Mob */}
            <div className="flex md:hidden">
              <CarouselPrevious className="w-8 h-8 md:h-12 md:w-12  -translate-x-[-30px]  md:-translate-x-[-23px]  transform -translate-y-1/2 z-30 dark:hover:bg-gray-500  hover:bg-[#A7A7A7] dark:bg-gray-800 bg-black dark:text-white text-white " />
              <CarouselNext className="w-8 h-8 md:h-12 md:w-12  -translate-x-[30px]  md:-translate-x-[23px]  transform -translate-y-1/2 z-30 dark:hover:bg-gray-500  hover:bg-[#A7A7A7] dark:bg-gray-800 bg-black dark:text-white text-white" />
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselBannerTop;
