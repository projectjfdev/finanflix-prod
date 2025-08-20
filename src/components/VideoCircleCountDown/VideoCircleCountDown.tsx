'use client';

import React, { useState, useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Play } from 'lucide-react';

const DURATION = 5000; // 5 seconds in milliseconds

export default function VideoCircleCountDown() {
  const [isRunning, setIsRunning] = useState(true);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();
  const [progress, setProgress] = useState(0);

  const animate = () => {
    const now = Date.now();
    const timePassed = now - startTimeRef.current;
    const newProgress = Math.min(1, timePassed / DURATION);
    setProgress(newProgress);

    if (newProgress < 1 && isRunning) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - progress * DURATION;
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  // const goToTheNextLesson = () => {
  //   // Add your navigation logic here
  //   console.log('Going to the next lesson');
  // };

  // const resetTimer = () => {
  //   setIsRunning(false);
  //   setProgress(0);
  //   startTimeRef.current = Date.now();
  //   setIsRunning(true);
  // };

  const timeLeft = Math.ceil((DURATION / 1000) * (1 - progress));
  const dashOffset = 439.8 * (1 - progress);

  return (
    <div className="my-10 flex flex-col items-center justify-center p-8 space-y-6  rounded-xl shadow-2xl max-w-md mx-auto text-white">
      <h2 className="text-3xl font-bold dark:text-white text-white">Próxima lección en</h2>
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="70"
            cx="96"
            cy="96"
          />
          <circle
            className="text-blue-500"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="70"
            cx="96"
            cy="96"
            strokeDasharray="439.8"
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-bold">
          {timeLeft}
        </div>
      </div>
      <p className="text-sm text-gray-300 text-center">
        El próximo video se reproducirá automáticamente
      </p>
      <div className="flex space-x-4">
        {/* <Button
          className="bg-primary text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={goToTheNextLesson}
        >
          <Play className="w-5 h-5 mr-2" />
          Reproducir ahora
        </Button> */}
        {/* <Button
          variant="outline"
          className="border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out"
          onClick={resetTimer}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Ir a inicio
        </Button> */}
      </div>
    </div>
  );
}
