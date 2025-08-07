'use client';

import { useFooter } from '@/context/footer-context';
import { useEffect } from 'react';

export default function FooterColorSetter({ color }: { color: string }) {
  const { setFooterBgColor } = useFooter();

  useEffect(() => {
    setFooterBgColor(color);

    // Reset to default when component unmounts
    return () => {
      setFooterBgColor('bg-white');
    };
  }, [color, setFooterBgColor]);

  // This component doesn't render anything
  return null;
}
