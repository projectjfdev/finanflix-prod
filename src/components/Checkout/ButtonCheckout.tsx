'use client';

import { createCourseProgress } from '@/utils/Endpoints/coursesEndpoint';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';

export const ButtonCheckout = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const comprarCurso = async () => {
    const res = await createCourseProgress({
      courseId: id,
      userId: session?.user._id.toString(),
    });
    // console.log(res);
  };
  return (
    <div>
      <Button onClick={comprarCurso}>Comprar curso</Button>
    </div>
  );
};
