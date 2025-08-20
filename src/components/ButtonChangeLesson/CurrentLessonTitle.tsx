// CurrentLessonTitle.tsx
'use client';
import { useEffect, useState } from 'react';

export default function CurrentLessonTitle({ courseId }: { courseId: string }) {
    const [title, setTitle] = useState<string | null>(null);

    useEffect(() => {
        const storedTitle = localStorage.getItem(`course-${courseId}-last-lesson-title`);
        if (storedTitle) {
            setTitle(storedTitle);
        }
    }, [courseId]);

    return (
        <h3 className="text-base sm:text-lg font-medium">
            Estás viendo: {title || 'Lección actual'}
        </h3>
    );
}
