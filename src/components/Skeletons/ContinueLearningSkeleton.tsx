import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ContinueLearningSkeleton = () => {
  return (
    <div className="sm:py-9">
      <section className="mb-4 sm:mb-8">
        <div className="grid md:grid-cols-1 mmd:grid-cols-2 xl:grid-cols-3 gap-9">
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              className="flex flex-col dark:bg-card bg-white overflow-hidden border-none rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl py-3 sm:py-5 lg:py-0"
            >
              <CardContent className="flex flex-col h-full p-0">
                {/* Header Section */}
                <div className="p-2 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <Skeleton className="w-14 sm:w-16 md:w-[68px] h-8 md:h-9 rounded-md sm:rounded-lg dark:bg-gray-700 bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 dark:bg-gray-700 bg-gray-200" />
                    <Skeleton className="h-3 w-1/2 dark:bg-gray-700 bg-gray-200" />
                    <Skeleton className="h-1 w-full dark:bg-gray-700 bg-gray-200" />
                  </div>
                </div>

                {/* Feature Image */}
                <Skeleton className="w-full h-40 sm:h-48 md:h-56 lg:h-48 xl:h-52 2xl:h-[225px] dark:bg-gray-700 bg-gray-200" />

                {/* Footer Section */}
                <div className="p-2 sm:p-4 flex flex-col flex-grow ml-1 sm:ml-2">
                  <div className="space-y-2 sm:mb-2">
                    <Skeleton className="h-3 w-1/4 dark:bg-gray-700 bg-gray-200" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-3/4 dark:bg-gray-700 bg-gray-200" />
                      <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full dark:bg-gray-700 bg-gray-200" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Skeleton className="w-4 h-4 rounded-full dark:bg-gray-700 bg-gray-200" />
                      <Skeleton className="h-3 w-2/3 dark:bg-gray-700 bg-gray-200" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full my-3 dark:bg-gray-700 bg-gray-200" />
                  <div className="flex items-start gap-1 sm:gap-2 mt-1 sm:mt-2 pb-1 sm:pb-2">
                    <Skeleton className="h-8 w-24 rounded-lg dark:bg-gray-700 bg-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContinueLearningSkeleton;
