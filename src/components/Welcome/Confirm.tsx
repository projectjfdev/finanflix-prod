import { Check } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const Confirm = () => {
  return (
    <Card className="shadow-lg flex flex-col items-center  justify-center py-10 md:py-10  h-full border ">
      <div className="flex flex-col md:flex-row items-center justify-center px-5   h-full">
        <Card className="max-w-xl px-5 text-center  shadow-xl flex flex-col items-center justify-center gap-3 h-96 md:h-80 dark:text-white text-black border ">
          <div>
            <h2 className="mb-2 text-5xl font-bold ">¡Felicitaciones!</h2>
            <p className="mb-2 text-xl ">
              ¡Bienvenido a Finanflix! <br></br>Tu correo electrónico ya ha sido
              confirmado.
            </p>
            <div className="flex justify-center py-5">
              <div className="bg-[green] rounded-full p-3">
                <Check color="white" size={30} />
              </div>
            </div>
          </div>

          <div>
            <Link href="/login" className="bg-primary text-white py-3 px-10 rounded-full hover:bg-secondary ">Inicia sesión</Link>
          </div>
        </Card>
      </div>
    </Card>
  );
};
