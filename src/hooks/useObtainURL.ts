import { useEffect, useState } from "react";

export const useObtainURL = () => {
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  return {
    currentUrl,
  };
};
