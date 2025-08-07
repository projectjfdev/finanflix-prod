'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type FooterContextType = {
  footerBgColor: string;
  setFooterBgColor: (color: string) => void;
  footerHidden: boolean;
  setFooterHidden: (hidden: boolean) => void;
};

// Make sure the context has a default value
const FooterContext = createContext<FooterContextType>({
  footerBgColor: 'bg-white',
  setFooterBgColor: () => {},
  footerHidden: false,
  setFooterHidden: (hidden: boolean) => {},
});

export function FooterProvider({ children }: { children: ReactNode }) {
  const [footerBgColor, setFooterBgColor] = useState('bg-white'); // Default color
  const [footerHidden, setFooterHidden] = useState(false);

  return (
    <FooterContext.Provider
      value={{
        footerBgColor,
        setFooterBgColor,
        footerHidden,
        setFooterHidden,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
}

// Export the hook directly
export const useFooter = () => useContext(FooterContext);
