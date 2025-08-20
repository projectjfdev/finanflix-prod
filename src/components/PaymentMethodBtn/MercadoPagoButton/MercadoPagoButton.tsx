'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../../ui/button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ICourse } from '@/interfaces/course';
import { useRate } from '@/hooks/useRate';
import { useBillingDetails } from '@/hooks/useBillingDetails';

interface Props {
  course: ICourse | undefined;
  hasBasicDetails: boolean;
  hasCompleteDetails: boolean;
}

const MercadoPagoButton = ({ course, hasBasicDetails, hasCompleteDetails }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { rate } = useRate();
  const { billingDetails } = useBillingDetails();

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/mercadopago/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          courseId: course?._id.toString(),
          // price: course?.price,
          price: course?.price! * Number(rate),
          title: course?.title,
          userEmail: billingDetails?.email,
          userId: session?.user?._id.toString(),
          username: session?.user?.username,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { url } = await response.json();
      router.push(url); // Redirect to Mercado Pago payment page
    } catch (error) {
      console.error('Error creating payment:', error);
      // Handle error (e.g., show error message to user)
    }
  };
  const enabledToBuy =
    !hasBasicDetails || (course?.price! * Number(rate) >= 100000 && !hasCompleteDetails);
  return (
    <Button
      className="bg-[#009EE3] py-5 w-full shadow-none dark:text-white rounded cursor-pointer hover:bg-blue-700 hover:text-white flex gap-2 justify-center items-center text-white whitespace-normal break-words"
      onClick={handleSubmit}
      disabled={enabledToBuy}
    >
      <Image
        width={25}
        height={25}
        alt="logo mercado pago"
        src={'https://res.cloudinary.com/drlottfhm/image/upload/v1750704006/mplogo_ur4h2v.png'}
      />
      <span className="text-center">Mercado Pago (Pagos exclusivos en Pesos Argentinos)</span>
    </Button>
  );
};
export default MercadoPagoButton;
