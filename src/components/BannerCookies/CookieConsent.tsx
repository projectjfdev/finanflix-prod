'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">
          This website uses cookies to ensure you get the best experience on our website.
        </p>
        <Button onClick={acceptCookies}>Accept</Button>
      </div>
    </div>
  );
}
