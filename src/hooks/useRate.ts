import { IExchangeRate } from "@/interfaces/exchangeRate";
import { getExchangeRate } from "@/utils/Endpoints/adminEndpoints";
import React, { useEffect, useState } from "react";
// Agregar subtitle
export const useRate = () => {
  const [rate, setRate] = useState<IExchangeRate>();

  const getRate = async () => {
    const res = await getExchangeRate();
    setRate(res?.data?.rate); // TODO: CAMBIOS TEST
  };

  useEffect(() => {
    getRate();
  }, []);

  return {
    rate,
  };
};
