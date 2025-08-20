"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";
import { useState } from "react";
import MediumTitle from "@/components/MediumTitle/MediumTitle";

export default function ConfiguracionMision() {
  const [fechaInicio, setFechaInicio] = useState<Date>();
  const [fechaFin, setFechaFin] = useState<Date>();

  return (
    <div className="w-full ml-4 md:ml-8">
      <div className="text-2xl font-poppins mb-3">
        <MediumTitle
          className="dark:text-white text-black"
          title="Configuración de Misión FF"
        />
      </div>

      <Card className="mx-auto dark:bg-background pl-5 bg-white py-7  rounded-2xl shadow-xl">
        <CardContent>
          <form className="space-y-4 w-5/6 ">
            <div className="space-y-2">
              <Label className="dark:text-white text-black" htmlFor="nombre">
                Nombre de la Misión
              </Label>
              <Input
                className="dark:bg-card bg-background"
                id="nombre"
                placeholder="Introduce el nombre de la misión"
              />
            </div>

            <div className="space-y-2">
              <Label
                className="dark:text-white text-black"
                htmlFor="descripcion"
              >
                Descripción de la Misión
              </Label>
              <Textarea
                className="dark:bg-card bg-background"
                id="descripcion"
                placeholder="Describe la misión"
              />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-white text-black" htmlFor="objetivo">
                Objetivo de la Misión
              </Label>
              <Input
                className="dark:bg-card bg-background"
                id="objetivo"
                placeholder="Ej: Comentar 30 veces en Discord"
              />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-white text-black" htmlFor="premio">
                Premio por Completar
              </Label>
              <Input
                className="dark:bg-card bg-background"
                id="premio"
                placeholder="Ej: 50 puntos, medalla de oro, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-white text-black">
                  Fecha de Inicio
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal dark:bg-card ${
                        !fechaInicio && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? (
                        moment(fechaInicio).format("PPP")
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={setFechaInicio}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-white text-black">
                  Fecha de Fin
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal dark:bg-card ${
                        !fechaFin && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? (
                        moment(fechaFin).format("PPP")
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={setFechaFin}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-start gap-5 pt-5">
              <Button
                type="submit"
                className="text-white px-10 hover:bg-secondary"
              >
                Ver Misión
              </Button>
              <Button
                type="submit"
                className="text-white px-10 hover:bg-secondary"
              >
                Guardar Misión
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
