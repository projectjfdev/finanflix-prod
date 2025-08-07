'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';

export function OnboardingSkeletonLoader() {
  return (
    <div className="w-full mx-auto ">
      <Skeleton className="h-4 w-48 mb-4 shadow-xl dark:bg-gray-700 bg-gray-200" />

      <Tabs defaultValue="onboarding" className="space-y-3  ">
        <div className="flex flex-col justify-start items-start gap-3 ">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:inline-flex gap-4">
            <Skeleton className="h-7 w-24 shadow-xl dark:bg-gray-700 bg-gray-200 " />
            <Skeleton className="h-7 w-40 shadow-xl dark:bg-gray-700 bg-gray-200" />
          </TabsList>
        </div>

        <Skeleton className="h-12 w-full md:hidden mb-4 shadow-xl bg-gray-200" />

        <TabsContent value="onboarding" className="p-0 m-0 h-full w-full relative bottom-3 md:flex">
          <div className="flex md:grid h-full w-full sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7 pb-5 pt-5">
            {[...Array(4)].map((_, index) => (
              <Card
                key={index}
                className="min-w-[300px] h-[185px] md:min-w-full w-full p-5 shadow-xl space-y-2"
              >
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-3/4 mb-2 dark:bg-gray-700 bg-gray-200 " />
                  <Skeleton className="h-4 w-full dark:bg-gray-700 bg-gray-200" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-1/4 dark:bg-gray-700 bg-gray-200" />
                  <Skeleton className="h-3 w-full dark:bg-gray-700 bg-gray-200" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-full dark:bg-gray-700 bg-gray-200" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
