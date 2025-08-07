'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../../ui/button';
import Image from 'next/image';
import { ISubscriptionPlan } from '@/interfaces/subscriptionPlan';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRate } from '@/hooks/useRate';
import moment from 'moment';
import { useBillingDetails } from '@/hooks/useBillingDetails';

interface Props {
  suscription: ISubscriptionPlan | undefined;
  buttonText?: string;
  suscriptionPrice: number | null | undefined;
  hasBasicDetails: boolean;
  hasCompleteDetails: boolean;
  type: string;
}

const MercadoPagoSuscription = ({
  suscription,
  buttonText,
  suscriptionPrice,
  hasBasicDetails,
  hasCompleteDetails,
  type,
}: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // pusheo el input del email a este estado y luego lo envio por body
  const [payerEmail, setPayerEmail] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const { rate } = useRate();
  // const { billingDetails } = useBillingDetails();

  const validateEmail = (payerEmail: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(payerEmail);
  };

  const nextMonth = moment().add(1, 'month').toISOString();

  const handleSubmit = async () => {
    setError('');
    if (!validateEmail(payerEmail)) {
      setError('Por favor, ingrese un email válido.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/mercadopago/create-suscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // TODO: AJUSTE EN USER EMAIL
        body: JSON.stringify({
          payerEmail,
          userEmail: session?.user?.email,
          // userEmail: billingDetails?.email,
          frequencyMonths: suscription?.frequency,
          name: `Suscripcion ${type} - ${suscription?.frequencyType}`,
          price: suscriptionPrice! * Number(rate),
          currency: 'AR',
          userId: session?.user?._id.toString(),
          nextMonth: suscription?.frequency === 1 ? nextMonth : null,
          username: session?.user?.username,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }
      // const resultJson = await response.json();
      // const { url } = await response.json();

      const { url } = await response.json();
      router.push(url);
      toggleModal();
    } catch (error) {
      // console.error('Error creating subscription:', error);
      setError('Hubo un error al crear la suscripción. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  //console.log(suscription, "suscripcion");
  // const enabledToBuy =
  //   !hasBasicDetails || (suscriptionPrice! * Number(rate) >= 100000 && !hasCompleteDetails);
  return (
    <>
      <Button
        onClick={toggleModal}
        className="bg-[#009EE3] py-5 w-full my-2 shadow-none border-none text-white rounded cursor-pointer hover:bg-blue-700 hover:text-white "
        // disabled={enabledToBuy}
      >
        <Image
          width={25}
          height={25}
          alt="logo mercado pago"
          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750704006/mplogo_ur4h2v.png"
        />
        <span>{buttonText || 'Mercado Pago (Pagos exclusivos en Pesos Argentinos)'}</span>
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full ">
            <div className="flex justify-between items-center dark:bg-transparent">
              <div className="space-y-1">
                <h3 className="text-xl font-bold dark:text-white pb-3 ">Mercado Pago </h3>
              </div>
              <Button
                onClick={toggleModal}
                className=" hover:text-gray-700 dark:text-gray-300 text-white dark:hover:text-white rounded-full"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </Button>
            </div>
            <Card className="space-y-3 flex flex-col justify-start shadow-md dark:bg-transparent border-none">
              <Label className="w-full text-start">Email *</Label>
              <span className="text-[11px]  text-red-400 italic text-start dark:bg-transparent">
                Ingrese un Email Valido de MercadoPago Para Poder suscribirte!
              </span>
              <Input
                type="email"
                id="mp-email"
                placeholder="su-email@ejemplo.com"
                value={payerEmail}
                onChange={e => setPayerEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              {error && <p className="text-red-500 text-sm text-start">{error}</p>}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#009EE3] py-3 w-full shadow-none text-white rounded cursor-pointer hover:bg-blue-700 hover:text-white flex gap-2 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  width={25}
                  height={25}
                  alt="logo mercado pago"
                  src="https://res.cloudinary.com/drlottfhm/image/upload/v1750704006/mplogo_ur4h2v.png"
                />
                <span>{isLoading ? 'Procesando...' : 'Confirmar Suscripción'}</span>
              </Button>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
export default MercadoPagoSuscription;
