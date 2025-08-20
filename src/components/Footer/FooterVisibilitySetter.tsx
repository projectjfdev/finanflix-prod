'use client';

import { useFooter } from '@/context/footer-context';
import { useEffect } from 'react';

export default function FooterVisibilitySetter({ hidden = false }: { hidden: boolean }) {
  const { setFooterHidden } = useFooter();
// ok
  useEffect(() => {
    setFooterHidden(hidden);

    return () => {
      // Restauramos el footer visible cuando se desmonta
      setFooterHidden(false);
    };
  }, [hidden, setFooterHidden]);

  return null;
}
