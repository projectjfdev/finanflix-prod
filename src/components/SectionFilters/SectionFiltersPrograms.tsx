import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import courseService from '@/utils/Services/courseService';
import MediumTitle from '../MediumTitle/MediumTitle';
import BigTitle from '../BigTitle/BigTitle';

interface Props {
  getFilterUrl: any;
  category: string;
}

export default async function SectionFiltersPrograms({ getFilterUrl, category }: Props) {
  const categories = await courseService.getCategories();

  return (
    <div className="flex gap-5 overflow-auto w-full mt-6 md:mt-0">
      {/* <p className="text-xl">Para ti</p> */}
      <p className="hidden md:flex flex-shrink-0 text-sm md:text-xl rounded-full px-0 mx-0 font-groteskMedium20 transition-colors  dark:text-white  dark:bg-background border-none text-black  ">
        Para ti
      </p>
      {/* el h-14 marca los paddings del scroollbar */}
      <ScrollArea className="whitespace-nowrap rounded-md h-fit">
        {categories.map((c: string) => (
          <Link key={c} href={getFilterUrl({ c })}>
            <Button
              id="ultima"
              variant="outline"
              size="sm"
              className={cn(
                'py-[18px] mr-3 rounded-full px-4 bg-white h-8 text-[10.48px] font-poppins transition-colors dark:bg-card  dark:text-[#A7A7A7] text-black dark:hover:text-white dark:hover:bg-primary',
                c === category
                  ? 'text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary  dark:text-white text-xs sm:text-sm'
                  : ' hover:bg-muted hover:text-foreground dark:hover:text-white  hover:bg-primary hover:text-white text-[#A7A7A7] text-xs sm:text-sm'
              )}
            >
              {c}
            </Button>
          </Link>
        ))}
        <div className="pt-4 flex md:hidden">
          <ScrollBar id="filtros" orientation="horizontal" />
        </div>
      </ScrollArea>
    </div>
  );
}
