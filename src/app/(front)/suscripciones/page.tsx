'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import { getSuscriptionsPlans } from '@/utils/Endpoints/suscriptionsPlanEndpoint';
import { ISubscriptionPlan } from '@/interfaces/subscriptionPlan';
import BigTitle from '@/components/BigTitle/BigTitle';
import { useRouter } from 'next/navigation';
import { IExchangeRate } from '@/interfaces/exchangeRate';
import { getExchangeRate } from '@/utils/Endpoints/adminEndpoints';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';

type CicloPago = 'mensual' | 'trimestral' | 'semestral' | 'anual';

export default function PaginaPrecios() {
  const [cicloPago, setCicloPago] = useState<CicloPago>('mensual');
  const [plans, setPlans] = useState<ISubscriptionPlan[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = (open: boolean) => setIsModalOpen(open);
  const [rate, setRate] = useState<IExchangeRate>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getRate = async () => {
    try {
      const res = await getExchangeRate();
      if (res?.data?.rate) {
        setRate(res.data.rate);
      }
    } catch (error) {
      console.error('Error al obtener tasa de cambio:', error);
    }
  };

  const getPlans = async () => {
    setLoading(true);
    try {
      const res = await getSuscriptionsPlans();
      if (res?.data) {
        setPlans(res?.data);
      } else {
        console.error('No se pudieron obtener los planes de suscripción');
      }
    } catch (error) {
      console.error('Error al obtener planes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRate();
  }, []);

  useEffect(() => {
    getPlans();
  }, []);

  const getPeriodoTexto = (ciclo: CicloPago) => {
    switch (ciclo) {
      case 'mensual':
        return '/mes';
      case 'trimestral':
        return '/trim';
      case 'semestral':
        return '/sem';
      case 'anual':
        return '/año';
      default:
        return '/mes';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingFinanflix />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-card bg-background pb-5 pt-5 md:pt-10">
      <div className="container md:px-4 mx-auto">
        <div className="text-center mb-7 sm:px-4 md:px-0">
          <BigTitle
            className="text-[20px] sm:text-2xl lg:text-3xl xl:text-4xl  dark:text-white text-black px-0 md:px-14"
            title="Desbloquea acceso instantáneo al conocimiento. Estás a un solo paso
            de cambiar tu futuro."
          />
        </div>
        <Tabs
          value={cicloPago}
          onValueChange={value => setCicloPago(value as CicloPago)}
          className="max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-3 mb-7 gap-3 text-center justify-center px-4 md:px-0">
            {plans?.map(plan => (
              <TabsTrigger
                key={plan.name.toLowerCase()}
                value={plan.name.toLowerCase()}
                className={`${cicloPago === plan.name.toLowerCase()
                  ? 'dark:bg-secondary bg-primary text-white' // Estilo para el tab seleccionado
                  : 'dark:bg-background dark:hover:bg-primary bg-white dark:text-gray-300 text-gray-800 dark:hover:text-[#858585] '
                  } text-xs py-3 sm:text-base dark:hover:text-gray-300 hover:text-gray-800`}
              >
                {plan.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1  sm:my-10 justify-center mx-auto w-full ">
            {plans?.map(plan => (
              <TabsContent key={plan.name.toLowerCase()} value={plan.name.toLowerCase()}>
                <Card className="flex flex-col dark:bg-background bg-white dark:text-white text-black overflow-y-hidden transition-all duration-300  h-full max-w-xl mx-auto">
                  <CardHeader className="py-6 px-6 md:px-14 flex-shrink-0">
                    <div className="space-y-2">
                      <CardTitle className="text-[22px] md:text-3xl font-bold dark:text-white text-black">
                        {plan.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6 px-6 md:px-14 pt-0 flex-grow flex flex-col">
                    <div className="text-2xl lg:text-4xl font-bold mb-8">
                      <span className="md:text-3xl lg:text-4xl xl:text-[44px]  font-bold">
                        {plan.name.toLowerCase() === 'mensual' ? (
                          <span>
                            AR$0{' '}
                            <span className="text-sm">
                              {' '}
                              luego
                              {' ' +
                                Intl.NumberFormat('es-AR').format(
                                  plan?.price?.basic * Number(rate)
                                )}
                              {getPeriodoTexto(plan.name.toLowerCase() as CicloPago)}
                            </span>
                          </span>
                        ) : (
                          'AR$' +
                          new Intl.NumberFormat('es-AR').format(plan?.price?.basic * Number(rate))
                        )}
                      </span>
                      <div className="md:text-xl font-medium text-gray-500 mt-2">
                        <span className="text-sm">USD</span>{' '}
                        {plan.name.toLowerCase() === 'mensual' ? (
                          <span className='text-lg md:text-2xl'>
                            $0{' '}
                            <span className="text-sm">luego ${plan?.price?.basic.toFixed(2)}</span>
                          </span>
                        ) : (
                          `$${plan?.price?.basic.toFixed(2)}`
                        )}
                      </div>
                    </div>
                    <ul className="space-y-4 flex-grow">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-sm dark:text-white text-black">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6 mt-auto flex-shrink-0">
                    <Button
                      onClick={() =>
                        router.push(`/suscripcion/${plan._id.toString()}?type=basic&step=billing`)
                      }
                      className={`w-full py-6 text-xs sm:text-sm md:text-base font-semibold dark:hover:bg-secondary`}
                    >
                      COMENZAR
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
