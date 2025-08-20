"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import moment from "moment";
import { getOrdersToExport } from "@/utils/Endpoints/adminEndpoints";
import { IOrder } from "@/interfaces/order";
import { Card } from "../ui/card";

const ExportOrdersToExcel = () => {
  const { control } = useForm();
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();
  const [orders, setOrders] = useState<IOrder[]>();

  const getOrders = async () => {
    if (selectedStartDate && selectedEndDate) {
      const formattedStartDate = encodeURIComponent(
        moment(selectedStartDate).format("YYYY-MM-DD")
      );
      const formattedEndDate = encodeURIComponent(
        moment(selectedEndDate).format("YYYY-MM-DD")
      );

      const query = `start=${formattedStartDate}&end=${formattedEndDate}`;
      const res = await getOrdersToExport(query);
      setOrders(res.data);
    }
  };

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      getOrders();
    }
  }, [selectedStartDate, selectedEndDate]);

  const handleExport = (): void => {
    const convertToCSV = (data: Record<string, any>[]): string => {
      if (data.length === 0) return "";

      const keys = Object.keys(data[0]);
      const csvRows = [
        keys.join(";"),
        ...data.map((row) =>
          keys.map((key) => JSON.stringify(row[key] || "")).join(";")
        ),
      ];

      return csvRows.join("\n");
    };

    const csvData = convertToCSV(orders || []);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 rounded-lg shadow-lg space-y-6 max-w-xl mx-auto">
      <div className="text-center text-gray-800 dark:text-gray-100">
        Selecciona el rango de fechas y exporta las órdenes de suscripciones
        correspondientes a ese período.
      </div>
      {orders && (
        <div className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
          {orders.length === 0
            ? "No se registraron ordenes de compra en este rango de fechas"
            : `Exportar ${orders.length} órdenes de compra en .cvs`}
        </div>
      )}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Fecha de inicio:
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[240px] flex justify-between items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Calendar className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              {selectedStartDate
                ? moment(selectedStartDate).format("YYYY-MM-DD")
                : "Desde X día"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <CalendarComponent
                  className="dark:text-white text-black"
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setSelectedStartDate(date);
                  }}
                  initialFocus
                />
              )}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Fecha de fin:
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[240px] flex justify-between items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Calendar className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              {selectedEndDate
                ? moment(selectedEndDate).format("YYYY-MM-DD")
                : "Hasta X día"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <CalendarComponent
                  className="dark:text-white text-black"
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setSelectedEndDate(date);
                  }}
                  initialFocus
                />
              )}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button
        variant="secondary"
        onClick={handleExport}
        className="w-full md:w-auto py-2 px-4 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition"
        disabled={!orders || orders.length === 0}
      >
        Exportar a Excel
      </Button>
    </Card>
  );
};

export default ExportOrdersToExcel;
