import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
interface Props {
  messageRes: {
    message: string;
    success: null | boolean;
  };
}

// Detecta si en el json que se envia desde el backend tiene alguna url, y la envuelve dentro de una etiqueta <a>
const makeLinksClickable = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-500 underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export const AlertMessage = ({ messageRes }: Props) => {
  return (
    <>
      {messageRes.message && (
        <Alert
          className={` border ${
            messageRes.success === true ? "border-green-500" : "border-red-500"
          }`}
        >
          {/* <RocketIcon className="h-4 w-4" /> */}
          <AlertTitle
            className={messageRes.success ? "text-green-500" : "text-red-500"}
          >
            {messageRes.success === true ? "Actualizado" : "Algo falló"}
          </AlertTitle>
          <AlertDescription>
            {makeLinksClickable(messageRes.message)}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
