'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Repeat, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CourseCompletionModalProps {
  onClose: () => void;
  courseId: string;
}

export default function CourseCompletionModal({ onClose, courseId }: CourseCompletionModalProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    router.push(`/curso/${courseId}`);
    onClose();
  };

  const handleBtnHome = () => {
    router.push(`/`);
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  const trophyVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 300,
        delay: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8,
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute"
      style={{
        left: `${20 + i * 12}%`,
        top: `${15 + (i % 2) * 70}%`,
      }}
      animate={{
        y: [-10, 10, -10],
        rotate: [0, 360],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 3 + i * 0.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
        delay: i * 0.2,
      }}
    >
      {i % 2 === 0 ? (
        <Star className="w-4 h-4 text-yellow-300" />
      ) : (
        <Sparkles className="w-3 h-3 text-purple-300" />
      )}
    </motion.div>
  ));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ perspective: 1000 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-indigo-800 p-8 shadow-2xl">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-indigo-500/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

            {/* Floating elements */}
            {floatingElements}

            {/* Confetti effect */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100, 100],
                      x: [0, Math.random() * 100 - 50],
                      rotate: [0, 360],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      ease: 'easeOut',
                      delay: Math.random() * 0.5,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Trophy */}
              <motion.div
                variants={trophyVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <div className="relative inline-block">
                  <Trophy className="w-20 h-20 text-yellow-300 mx-auto drop-shadow-lg" />
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-yellow-300/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent"
              >
                ¡Curso Completado!
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-xl text-purple-100 mb-2 font-medium"
              >
                ¡Felicitaciones!
              </motion.p>

              <motion.p
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-lg text-purple-200 mb-8 opacity-90"
              >
                Vuelve a empezar y refuerza tu aprendizaje 🚀
              </motion.p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={handleRestart}
                    size="lg"
                    className="text-lg font-semibold bg-primary from-orange-500 to-red-500 hover:bg-primary  text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl"
                  >
                    <Repeat className="w-5 h-5 mr-2" />
                    Volver a empezar
                  </Button>
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  //   style={{ delay: 0.1 }}
                >
                  <Button
                    onClick={handleBtnHome}
                    variant="outline"
                    size="lg"
                    className="text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 px-8 py-3 rounded-xl"
                  >
                    Inicio
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Decorative sparkles */}
            <motion.div
              variants={sparkleVariants}
              animate="animate"
              className="absolute top-4 right-4"
            >
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </motion.div>
            <motion.div
              variants={sparkleVariants}
              animate="animate"
              className="absolute bottom-4 left-4"
              style={{ animationDelay: '1s' }}
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
