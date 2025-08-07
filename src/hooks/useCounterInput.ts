import React, { useState } from "react";
// Agregar subtitle
export const useCounterInput = () => {
  const [TitleVal, setTitleVal] = useState("");
  const [DescVal, setDescVal] = useState("");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
        if (value.length <= 30) {
          setTitleVal(value);
        }
        break;
      case "description":
        if (value.length <= 1000) {
          setDescVal(value);
        }
        break;
      default:
        break;
    }
  };

  return {
    handleInputChange,
    TitleVal,
    DescVal,
    setTitleVal,
    setDescVal,
  };
};
