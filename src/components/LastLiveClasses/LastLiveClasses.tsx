import Link from 'next/link';
import MediumTitle from '../MediumTitle/MediumTitle';
import liveLessonModel from '@/models/liveLessonModel';
import { ILiveLesson } from '@/interfaces/liveLesson';
import 'moment/locale/es';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import LiveClassesGrid from './LiveClassesGrid';
import MobileLiveClasses from './MobileLiveClasses';
import { hasSubscription } from '@/utils/HasSubscription';

export default async function LastLiveClasses() {
  const rawClasses = await liveLessonModel.find().sort({ lessonDate: -1 }).limit(4).lean();
  const session = await getServerSession(authOptions);
  const classes: ILiveLesson[] = JSON.parse(JSON.stringify(rawClasses));
  return (
    <div className="md:container mx-auto pb-9">
      <div className="flex flex-row justify-between items-center mb-3 md:mb-4">
        <MediumTitle
          title="Ultimas Clases en Vivo"
          className="relative text-lg md:text-[26px]"
        />

        {hasSubscription(session) && (
          <Link
            href="/clases-en-vivo"
            className="pr-4 dark:text-white text-black hover:text-primary/90 flex items-center gap-2 relative  font-groteskBook20 leading-tight max-sm:text-xs md:text-base dark:hover:text-[#A7A7A7]"
          >
            Ver mas
            <svg
              className="h-4 w-4 hidden sm:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <MobileLiveClasses classes={classes} hasSubscription={hasSubscription(session)} />
      <LiveClassesGrid classes={classes} hasSubscription={hasSubscription(session)} />
    </div>
  );
}
