import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export const UserCounter = () => {
  const [count, setCount] = useState(4000);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="text-center p-5 md:py-5 ">
      <h2 className="font-bold mb-5  text-xl md:text-3xl font-poppins ">
        Únete a nuestra comunidad en crecimiento
      </h2>

      <div className="flex items-center justify-center text-5xl font-bold dark:text-white text-black ">
        <Users className="mr-4 h-6 w-6 md:h-12 md:w-12" />
        <p className="text-xl md:text-base">{count.toLocaleString()}+ usuarios</p>
      </div>

      <h2 className="text-xl md:text-3xl font-bold   pt-5 md:pt-0 text-center font-poppins">
        Lo que dicen nuestros estudiantes
      </h2>
    </div>
  );
};
