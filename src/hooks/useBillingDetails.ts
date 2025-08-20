import { IBillingDetails } from '@/interfaces/billingDetails';
import { useEffect, useState } from 'react';

export const useBillingDetails = () => {
  const [billingDetails, setBillingDetails] = useState<IBillingDetails | null>();

  // funcion que trae el billing details dentro del hook
  const getDetails = async () => {
    const res = await fetch('/api/users/billing-details', { method: 'GET' });
    const result = await res.json();
    setBillingDetails(result?.data);
  };

  // funcion creada para ser utilizada con el hook en el OnApprove de Paypal
  const getBillingDetails = async (): Promise<IBillingDetails | null> => {
    try {
      const res = await fetch('/api/users/billing-details', {
        method: 'GET',
      });
      const result = await res.json();
      // setBillingDetails(result?.data);
      return result?.data || null;
    } catch (error) {
      // console.error("Error fetching billing details:", error);
      return null;
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return {
    billingDetails,
    getBillingDetails, // paso la funcion para utilizarla en el onApprove
  };
};
