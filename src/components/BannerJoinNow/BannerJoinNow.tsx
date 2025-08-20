import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export const BannerJoinNow = () => {
  return (
    <div className="rounded-xl text-white text-center grid my-10">
      <div className="col-start-1 row-start-1 mx-auto my-auto border  w-full h-64  rounded-xl relative">
        {/* Overlay for darkening the background image */}
        <div className="absolute inset-0 bg-[url('/images/grd2.jpg')] bg-cover  bg-center filter brightness-200 rounded-xl"></div>
        {/* Overlay negro con opacidad */}
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>

        <div className="relative z-10  py-10 flex justify-between items-center gap-4 md:gap-8 rounded-xl bg-opacity-100">
          <div className="ml-4 md:ml-10">
            <h2 className="text-start text-lg md:text-[28px] font-extrabold pb-5 md:pb-7">
              Únete a la Membresía Finanflix
            </h2>

            <p className="text-start">
              Tell us about your personal development
            </p>
            <p className="text-start">
              Cuéntanos sobre tus intereses de desarrollo{" "}
            </p>
            <p className="text-start">
              personal y te recomendaremos el mejor contenido
            </p>

            <div className="pt-5 text-start">
              <Link href="/home">
                <Button className="rounded-full px-8 py-4 md:py-6 text-base text-white hover:bg-[#702DFF]">
                  Únete ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
