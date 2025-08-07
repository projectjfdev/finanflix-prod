import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import './MainPagination.css';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';

interface Props {
  page: string;
  pages: number;
  getFilterUrl: (pg: any) => string;
}

/* ALTURA PAGINADOR */

export const MainPagination = ({ page, pages, getFilterUrl }: Props) => {
  return (
    <Pagination className="mt-9">
      <PaginationContent>
        {/* Previous Atras old*/}
        <PaginationItem>
          {Number(page) > 1 && (
            <Card className="rounded-full dark:text-white text-black hover:text-white ">
              <PaginationPrevious
                className="h-[36px] md:h-[44px]"
                href={getFilterUrl({ pg: `${Number(page) - 1}` })}
              />
            </Card>
          )}
        </PaginationItem>

        {/* Previous Atras */}
        {/* <PaginationItem className="p-0 m-0">
          {Number(page) > 1 && (
            <Card className="rounded-full dark:text-white text-black hover:bg-primary hover:text-white px-[13px] h-full dark:hover:bg-primary dark:hover:text-white flex items-center justify-center">
              <ChevronLeftIcon className="h-4 w-4" />
              <Link
                className="h-[42px] inline-flex px-4 border-none border-input bg-transparent shadow-sm dark:hover:bg-none hover:text-none outline-none hover:bg-none  items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 "
                href={getFilterUrl({ pg: `${Number(page) - 1}` })}
              >
                <span>Atrás</span>
              </Link>
            </Card>
          )}
        </PaginationItem> */}
        {/* Elipsis  Previous */}
        {Number(page) > 2 && (
          <PaginationItem className="flex gap-1 ">
            <Card className="rounded-full dark:text-white hover:text-white text-black md:w-11 md:h-11  ">
              <PaginationLink className="md:w-11 md:h-11 " href={getFilterUrl({ pg: 1 })}>
                1
              </PaginationLink>
            </Card>
            <div className="rounded-full dark:text-white text-black hover:text-black  p-0 m-0  md:w-11 md:h-11">
              <PaginationEllipsis />
            </div>
          </PaginationItem>
        )}
        {/* Pagination 1 Cuando aparece Boton atras */}
        {Number(page) > 1 && (
          <PaginationItem className="flex">
            <Card className="rounded-full dark:text-white text-black hover:text-white  md:w-11 md:h-11  ">
              <PaginationLink
                className="md:w-11 md:h-11 "
                href={getFilterUrl({ pg: `${Number(page) - 1}` })}
              >
                {Number(page) - 1}
              </PaginationLink>
            </Card>
          </PaginationItem>
        )}
        {/* Pagination Number 1 */}
        <PaginationItem className="flex rounded-md text-white no-back">
          <Card className="rounded-full bg-primary text-white border-none md:w-11 md:h-11 flex items-center justify-center">
            <PaginationLink className="md:w-11 md:h-11" href={getFilterUrl({ pg: page })}>
              {page}
            </PaginationLink>
          </Card>
        </PaginationItem>

        {/* Pagination Number  2 */}
        {Number(page) < pages && (
          <PaginationItem className="flex  rounded-md text-white no-back md:w-11 md:h-11">
            <Card className="rounded-full dark:text-white text-black hover:text-white ">
              <PaginationLink
                className="md:w-11 md:h-11"
                href={getFilterUrl({ pg: `${Number(page) + 1}` })}
              >
                {Number(page) + 1}
              </PaginationLink>
            </Card>
          </PaginationItem>
        )}
        {/* Pagination number 4*/}
        {Number(page) < pages - 1 && (
          <PaginationItem className="flex gap-1   rounded-md dark:text-white no-back text-black  ">
            <div className="rounded-full dark:text-white text-black hover:text-black  p-0 m-0  md:w-11 md:h-11">
              <PaginationEllipsis className="p-0 m-0 md:w-11 md:h-11" />
            </div>
            <Card className="rounded-full dark:text-white text-black hover:text-white  md:w-11 md:h-11">
              <PaginationLink className="md:w-11 md:h-11" href={getFilterUrl({ pg: pages as any })}>
                {pages}
              </PaginationLink>
            </Card>
          </PaginationItem>
        )}
        {/* Next Page */}
        {Number(page) < pages && (
          <PaginationItem>
            <Card className="rounded-full dark:text-white text-black hover:text-white  md:h-11">
              <PaginationNext
                className="md:h-11"
                href={getFilterUrl({ pg: `${Number(page) + 1}` })}
              />
            </Card>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
