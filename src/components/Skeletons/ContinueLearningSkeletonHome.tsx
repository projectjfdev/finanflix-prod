import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ContinueLearningSkeletonHome = () => {
  return (
    <div className="mt-9">
    {/* Title skeleton */}
    <div className="relative bottom-2 mb-4">
      <Skeleton className="h-7 w-64 dark:bg-gray-700 bg-gray-200" />
    </div>

    {/* Main card */}
    <div className="w-full dark:bg-card bg-white p-6 rounded-2xl">
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
        {/* Course info section - Will appear at the top on mobile */}
        <div className="w-full xl:w-3/5 order-1 md:order-2">
          <div className="rounded-lg p-0 h-full flex flex-col gap-5">
            {/* Course title and small thumbnail */}
            <div className="sm:flex sm:items-start sm:gap-5">
              <div className="w-2/6 md:w-1/6 h-full rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 relative">
                <Skeleton className="w-full h-20 xs:hidden sm:flex dark:bg-gray-700 bg-gray-200" />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Skeleton className="h-6 w-full md:w-3/4 dark:bg-gray-700 bg-gray-200" />
                <Skeleton className="h-4 w-4/6 mt-1 dark:bg-gray-700 bg-gray-200" />
                <Skeleton className="h-2 w-4/6 md:w-2/6 mt-2 dark:bg-gray-700 bg-gray-200" />
              </div>
            </div>

            {/* Main course image - Mobile only */}
            <div className="w-full xl:hidden mt-4 mb-4">
              <Card className="border-none overflow-hidden rounded-lg w-full">
                <Skeleton className="w-full aspect-[16/9] dark:bg-gray-700 bg-gray-200" />
              </Card>
            </div>

            {/* Divider */}
            <Skeleton className="h-px w-full dark:bg-gray-700 bg-gray-200" />

            {/* Lesson info section */}
            <div className="pt-4">
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <Skeleton className="h-4 w-1/4 dark:bg-gray-700 bg-gray-200" />
                  <Skeleton className="h-6 w-5/6 mt-2 dark:bg-gray-700 bg-gray-200" />
                  <div className="flex items-center gap-1 mt-2">
                    <Skeleton className="h-4 w-4 rounded-full dark:bg-gray-700 bg-gray-200" />
                    <Skeleton className="h-4 w-16 dark:bg-gray-700 bg-gray-200" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded-full dark:bg-gray-700 bg-gray-200" />
              </div>

              {/* Bottom section */}
              <Skeleton className="h-px w-full mt-6 dark:bg-gray-700 bg-gray-200" />
              <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full dark:bg-gray-700 bg-gray-200" />
                <Skeleton className="h-4 w-3/4 dark:bg-gray-700 bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Course image - Desktop only */}
        <div className="w-full md:w-2/5 hidden xl:block order-2 md:order-1">
          <Card className="border-none overflow-hidden rounded-lg">
            <Skeleton className="w-full aspect-[16/9] dark:bg-gray-700 bg-gray-200" />
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ContinueLearningSkeletonHome;
