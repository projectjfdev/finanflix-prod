import Image from 'next/image';
import './LoadingFinanflix.css';

interface LoadingFinanflixProps {
  containerWidth?: string; // Clase opcional para personalizar el ancho del contenedor
}

export const LoadingFinanflix: React.FC<LoadingFinanflixProps> = () => {
  return (
    <div
      className={`flex flex-col gap-4 items-center justify-center bg-none shadow-none rounded-2xl p-5`}
    >
      <div className="relative">
        <Image
          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703990/icon-finanflix_yzaxur.png"
          alt="Finanflix logo"
          width={80}
          height={80}
          className="animate-pulse"
        />
      </div>
      <div className="flex items-baseline">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};
