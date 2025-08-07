'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import { CheckCircle, Info, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SubscriptionStatus from '@/components/PaypalSuscriptionStatus/PaypalSuscriptionStatus';
import { getPayPalToken } from '@/utils/PaypalToken/PaypalToken';

interface PlanData {
  billing_cycles: any;
  ternure_type: string;
  id: string;
  product_id: string;
  name: string;
  status: string;
  create_time: string;
}

interface Subscription {
  create_time: string;
  id: string;
  name: string;
  description: string;
}

interface ProductFormData {
  name: string;
  description: string;
}

interface PlanFormData {
  name: string;
  price: string;
}

interface SubscriptionFormData {
  subscriber_name: string;
  subscriber_email: string;
}

export default function SubscriptionsPaypal() {
  const [productId, setProductId] = useState('');
  const [planId, setPlanId] = useState('');
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [isPlanCreated, setIsPlanCreated] = useState(false);
  const [suscriptions, setSuscriptions] = useState<Subscription[]>([]);
  const [planData, setPlanData] = useState<PlanData[]>([]);
  const [inactivePlanData, setInactivePlanData] = useState<PlanData[]>([]);
  const [planPrices, setPlanPrices] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('activas');
  const [allPlans, setAllPlans] = useState<PlanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typePlan, setTypePlan] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await getPayPalToken();
      setToken(accessToken);
    };

    fetchToken();
  }, []);

  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    formState: { errors: productErrors },
  } = useForm<ProductFormData>();

  const {
    register: registerPlan,
    handleSubmit: handleSubmitPlan,
    formState: { errors: planErrors },
  } = useForm<PlanFormData>();

  const {
    register: registerSubscription,
    handleSubmit: handleSubmitSubscription,
    formState: { errors: subscriptionErrors },
  } = useForm<SubscriptionFormData>();

  const fetchPayPalBillingPlans = async (page = 1, pageSize = 20) => {
    // const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_PRODUCTION;
    // const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_SECRET_ID_PRODUCTION;
    // const authUrl = 'https://api-m.paypal.com/v1/oauth2/token';
    const plansUrl = `https://api-m.paypal.com/v1/billing/plans?page_size=${pageSize}&page=${page}`;

    try {
      // Obtener el token de acceso
      // const authResponse = await fetch(authUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      //   },
      //   body: 'grant_type=client_credentials',
      // });

      // if (!authResponse.ok) {
      //   throw new Error(`Error al obtener el token: ${authResponse.statusText}`);
      // }

      // const authData = await authResponse.json();
      // const accessToken = authData.access_token;

      // Usar el token para obtener los planes de facturación
      const plansResponse = await fetch(plansUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          // Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!plansResponse.ok) {
        throw new Error(`Error al obtener los planes de facturación: ${plansResponse.statusText}`);
      }

      const plansData = await plansResponse.json();
      return plansData;
    } catch (error) {
      console.error('Error al obtener los planes de facturación:', error);
      throw error;
    }
  };

  const fetchInactivePayPalBillingPlans = async () => {
    const plansUrl = 'https://api-m.paypal.com/v1/billing/plans?page_size=20';

    try {
      // Usar el token para obtener los planes de facturación
      const plansResponse = await fetch(plansUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // El token de acceso obtenido
        },
      });

      if (!plansResponse.ok) {
        throw new Error(`Error al obtener los planes de facturación: ${plansResponse.statusText}`);
      }

      const plansData = await plansResponse.json();
      const activePlans =
        plansData.plans?.filter((plan: { status: string }) => plan.status === 'INACTIVE') || [];
      // Filtrar los planes cuyo estado sea "ACTIVE"

      // console.log("Planes activos", activePlans)

      setInactivePlanData(activePlans || []);
      // Aquí puedes hacer algo con los datos, como establecerlos en el estado si es necesario
      return activePlans;
    } catch (error) {
      console.error('Error al obtener los planes de facturación:', error);
      throw error; // Opcionalmente puedes volver a lanzar el error
    }
  };

  const fetchPayPalSuscriptions = async () => {
    const suscriptionUrl = 'https://api-m.paypal.com/v1/catalogs/products?page_size=20';

    try {
      // Usar el token para obtener los productos
      const suscriptionResponse = await fetch(suscriptionUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!suscriptionResponse.ok) {
        throw new Error(`Error al obtener productos:  ${suscriptionResponse.statusText}`);
      }

      // const productsData = await productsResponse.json();

      const suscriptionData = await suscriptionResponse.json();
      setSuscriptions(suscriptionData.products || []);

      // console.log("Productos:", suscriptionData);

      return suscriptionData;
    } catch {
      console.log('Error');
      throw new Error();
    }
  };

  const fetchPlanPrice = async (id: string) => {
    const suscriptionUrl = `https://api-m.paypal.com/v1/billing/plans/${id}`;

    try {
      // Usar el token para obtener los productos
      const suscriptionResponse = await fetch(suscriptionUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!suscriptionResponse.ok) {
        throw new Error(`Error al obtener productos: ${suscriptionResponse.statusText}`);
      }

      const suscriptionData = await suscriptionResponse.json();
      // const price = suscriptionData?.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value
      const price = suscriptionData?.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value || '0';

      return price;
    } catch {
      console.log('Error');
      throw new Error();
    }
  };

  const fetchTrialPlan = async (id: string) => {
    const suscriptionUrl = `https://api-m.paypal.com/v1/billing/plans/${id}`;

    try {
      // Usar el token para obtener los productos
      const suscriptionResponse = await fetch(suscriptionUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!suscriptionResponse.ok) {
        throw new Error(`Error al obtener productos: ${suscriptionResponse.statusText}`);
      }

      const suscriptionData = await suscriptionResponse.json();
      // const price = suscriptionData?.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value
      const typePlan = suscriptionData?.billing_cycles?.[0]?.tenure_type;

      setTypePlan(typePlan);

      return typePlan;
      // return regularPrice
    } catch {
      console.log('Error');
      throw new Error();
    }
  };

  useEffect(() => {
    const fetchPlansAndPrices = async () => {
      const plansData = await fetchPayPalBillingPlans();
      if (plansData?.plans) {
        setPlanData(plansData.plans);
        // Fetch prices for all plans
        const pricePromises = plansData.plans.map((plan: { id: string }) =>
          fetchPlanPrice(plan.id)
        );
        const prices = await Promise.all(pricePromises);
        const newPlanPrices = plansData.plans.reduce(
          (acc: Record<string, string>, plan: { id: string }, index: number) => {
            acc[plan.id] = prices[index] || '0';
            return acc;
          },
          {}
        );
        setPlanPrices(newPlanPrices);
      }
    };
    fetchPlansAndPrices();
  }, []);

  const fetchAllPlans = async () => {
    setIsLoading(true);
    let page = 1;
    let hasMorePlans = true;
    let allFetchedPlans: PlanData[] = [];

    while (hasMorePlans) {
      const plansData = await fetchPayPalBillingPlans(page);
      if (plansData.plans && plansData.plans.length > 0) {
        allFetchedPlans = [...allFetchedPlans, ...plansData.plans];
        page++;
      } else {
        hasMorePlans = false;
      }
    }

    setAllPlans(allFetchedPlans);
    setPlanData(allFetchedPlans.filter(plan => plan.status === 'ACTIVE'));
    setInactivePlanData(allFetchedPlans.filter(plan => plan.status === 'INACTIVE'));
    setIsLoading(false);
    return allFetchedPlans;
  };

  useEffect(() => {
    fetchAllPlans();
  }, []);

  useEffect(() => {
    const fetchPlansAndTrial = async () => {
      try {
        const plansData = await fetchPayPalBillingPlans(); // Obtener todos los planes
        if (plansData?.plans) {
          setPlanData(plansData.plans);

          // Obtener el tipo de plan para todos los planes
          const trialPromises = plansData.plans.map((plan: { id: string }) =>
            fetchTrialPlan(plan.id)
          ); // Asumimos que fetchTrialPlan es una función que toma el id del plan y devuelve el tipo de plan
          const trialTypes = await Promise.all(trialPromises);

          // Crear un objeto que relacione cada id de plan con su tipo de plan
          const newTrialTypes = plansData.plans.reduce(
            (acc: Record<string, string>, plan: { id: string }, index: number) => {
              acc[plan.id] = trialTypes[index] || 'NO_TRIAL'; // Asignamos "NO_TRIAL" si no se obtiene el tipo
              return acc;
            },
            {}
          );

          setTypePlan(newTrialTypes); // Establecer los tipos de plan en el estado
        }
      } catch (error) {
        console.error('Error al obtener planes o tipos de plan:', error);
      }
    };

    fetchPlansAndTrial();
  }, []);

  useEffect(() => {
    fetchInactivePayPalBillingPlans();
  }, []);

  useEffect(() => {
    fetchPayPalSuscriptions();
  }, []);

  const handleCreateProduct: SubmitHandler<ProductFormData> = async data => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);

    try {
      const response = await fetch('/api/create-product', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast('Producto creado exitosamente!', {
          description: 'Se ha creado el producto de manera exitosa.',
          icon: <CheckCircle className="text-green-500" />,
          duration: 10000,
        });
      } else {
        toast('Error al crear el producto', {
          description: 'Error al crear el producto en Paypal.',
          icon: <X className="text-red-500" />,
          duration: 10000,
        });
        throw new Error('Failed to create product');
      }
      const responseData = await response.json();
      // Verificamos si la respuesta de la API indica éxito ACAA
      setProductId(responseData.data.id); // Aquí guardas el ID del producto
      setIsProductCreated(true); // Marcas como creado el producto
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleCreatePlan: SubmitHandler<PlanFormData> = async data => {
    if (!productId) {
      // console.error('Product ID is not available');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('product_id', productId);

    try {
      const response = await fetch('/api/create-plan', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast('Suscripción creada exitosamente!', {
          description: 'Se ha creado la suscripción de manera exitosa.',
          icon: <CheckCircle className="text-green-500" />,
          duration: 10000,
        });
      } else {
        toast('Error al crear la suscripción', {
          description: 'Error al crear la suscripción en PayPal.',
          icon: <X className="text-red-500" />,
          duration: 10000,
        });
        throw new Error('Failed to create plan');
      }

      const responseData = await response.json();
      setPlanId(responseData.data.id);
      setIsPlanCreated(true);
      // console.log("Plan creado con ID:", responseData.data.id)
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const handleCreateTrialPlan: SubmitHandler<PlanFormData> = async data => {
    if (!productId) {
      // console.error('Product ID is not available');
      toast.error('Product ID is missing. Please create a product first.');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('product_id', productId);

    try {
      const response = await fetch('/api/create-plan-trial', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create plan');
      }

      const responseData = await response.json();
      setPlanId(responseData.data.id);
      setIsPlanCreated(true);
      // console.log("Plan created with ID:", responseData.data.id)

      toast.success('Trial plan created successfully!', {
        description: `Plan ID: ${responseData.data.id}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Failed to create trial plan', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: 5000,
      });
    }
  };

  const updateBillingPlan = async (planId: string, status: string) => {
    const plansDeactiveUrl = `https://api-m.paypal.com/v1/billing/plans/${planId}/deactivate`;
    const plansActiveUrl = `https://api-m.paypal.com/v1/billing/plans/${planId}/activate`;

    try {
      if (status === 'ACTIVE') {
        // 2. Desactiva el plan
        const deactivePlan = await fetch(plansDeactiveUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
        });

        if (deactivePlan.ok) {
          toast('Suscripción Desactivada!!', {
            description: 'Se ha inactivado la suscripción de manera exitosa.',
            icon: <CheckCircle className="text-green-500" />,
            duration: 10000,
          });

          // Retrasar el reload de 3 segundos
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          toast('Error al crear la suscripción', {
            description: 'Error al inactivar la suscripción en PayPal.',
            icon: <X className="text-red-500" />,
            duration: 10000,
          });

          throw new Error(`Error al actualizar el plan: ${deactivePlan.statusText}`);
        }

        // console.log("Plan desactivado:", deactivePlan);
        return deactivePlan;
      } else {
        // 2. Activa el plan
        const activePlan = await fetch(plansActiveUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
        });

        if (activePlan.ok) {
          toast('Suscripción Activada!!', {
            description: 'Se ha activado la suscripción de manera exitosa.',
            icon: <CheckCircle className="text-green-500" />,
            duration: 10000,
          });

          // Retrasar el reload de 3 segundos
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          toast('Error al Activar la suscripción', {
            description: 'Error al activar la suscripción en PayPal.',
            icon: <X className="text-red-500" />,
            duration: 10000,
          });
          throw new Error(`Error al actualizar el plan: ${activePlan.statusText}`);
        }
        //console.log("Plan activado:", activePlan);
        return activePlan;
      }
    } catch (error) {
      console.error('Error al actualizar el plan:', error);
      throw error; // Opcionalmente puedes volver a lanzar el error
    }
  };

  const handlePlanClick = async (id: string) => {
    setPlanId(id); // Guarda el ID del plan seleccionado
    const price = await fetchPlanPrice(id);
    setPlanPrices(prevPrices => ({
      ...prevPrices,
      [id]: price,
    }));
  };

  const subscriptionId = 'I-LAJEB5AVGUDW';

  return (
    <div className="flex flex-col w-full ml-4 md:ml-8">
      <div className="dark:bg-background  rounded-2xl shadow-xl mb-16 w-full">
        <h2 className="text-2xl font-bold pb-3">Suscripciones Paypal</h2>

        {/* Tabs */}
        <div className="rounded-md border hidden md:flex flex-col p-3">
          {/* Tabs */}
          <section className="px-2 md:px-4 dark:bg-card bg-card pb-20 rounded-2xl dark:shadow-2xl shadow-2xl h-full border-none bg-white">
            <Tabs defaultValue="activas" className="border-none">
              <TabsList className="flex gap-4 justify-start bg-transparent my-[14px]">
                <TabsTrigger
                  className="dark:text-white text-black dark:bg-background bg-background  py-1   text-[12px]  rounded-none"
                  value="activas"
                >
                  ACTIVAS
                </TabsTrigger>

                <TabsTrigger
                  className=" dark:text-white text-black dark:bg-background bg-background py-1 text-[12px]  rounded-none"
                  value="inactivas"
                >
                  INACTIVAS
                </TabsTrigger>

                <TabsTrigger
                  className=" dark:text-white text-black dark:bg-background bg-background py-1 text-[12px]  rounded-none"
                  value="free"
                >
                  FREE PLAN
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activas" className="w-full block xl:block p-0 m-0">
                <Table>
                  <TableHeader>
                    <p>Total de Suscripciones: {allPlans.length}</p>
                    <TableRow>
                      <TableHead>ID del Plan</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Creado</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acciones</TableHead>

                      {/* <TableHead>Fecha de Creación</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  {/* SUSCRIPCIONES INACTIVAS  */}
                  <TableBody>
                    {allPlans?.map((plan, index) => {
                      // Accede al tipo del plan usando el ID del plan
                      const planType = typePlan[plan.id as any]; // typePlan es el objeto que contiene la relación plan.id -> "REGULAR" o "TRIAL"

                      // Filtra para solo mostrar los planes de tipo "TRIAL"
                      if (planType === 'REGULAR') {
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-xs">{plan?.id}</TableCell>
                            <TableCell className="text-sm">{plan?.name}</TableCell>
                            <TableCell
                              className={cn(
                                plan?.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                              )}
                            >
                              {plan?.status}
                            </TableCell>
                            <TableCell>
                              <p className="rounded-none text-xs">
                                {new Date(plan?.create_time).toLocaleDateString('es-ES')}
                              </p>
                            </TableCell>

                            {/* PRECIO DEL PLAN */}
                            <TableCell className="text-right">
                              <span>
                                {planPrices[plan.id]
                                  ? `$${planPrices[plan.id]}`
                                  : 'Precio no Disponible'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => updateBillingPlan(plan.id, plan.status)}
                                variant={'outline'}
                                className="rounded-none text-xs"
                              >
                                {plan.status === 'INACTIVE' ? 'ACTIVAR' : 'INACTIVAR'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }
                      // Si no es un plan "TRIAL", no se renderiza nada
                      return null;
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
              {/* SUSCRIPCIONES INACTIVAS  */}
              <TabsContent value="inactivas" className="w-full block xl:block p-0 m-0">
                <Table>
                  <TableHeader>
                    <p>Total de Suscripciones: {allPlans.length}</p>
                    <TableRow>
                      <TableHead>ID del Plan</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Creado</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acciones</TableHead>
                      {/* <TableHead>Fecha de Creación</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPlans
                      .filter(plan => plan.status === 'INACTIVE')
                      .map((plan, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-xs">{plan?.id}</TableCell>
                            <TableCell className="text-sm">{plan?.name}</TableCell>
                            <TableCell
                              className={cn(
                                plan?.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                              )}
                            >
                              {plan?.status}
                            </TableCell>
                            <TableCell>
                              <p className="rounded-none text-xs">
                                {new Date(plan?.create_time).toLocaleDateString('es-ES')}
                              </p>
                            </TableCell>

                            {/* PRECIO DEL PLAN */}

                            <TableCell className="text-right">
                              <span>
                                {planPrices[plan.id]
                                  ? `$${planPrices[plan.id]}`
                                  : 'Precio no Disponible'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => updateBillingPlan(plan.id, plan.status)}
                                variant={'outline'}
                                className="rounded-none text-xs"
                              >
                                {plan.status === 'INACTIVE' ? 'ACTIVAR' : 'INACTIVAR'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="free" className="w-full block xl:block p-0 m-0">
                <Table>
                  <TableHeader>
                    <p>Total de Suscripciones: {allPlans.length}</p>
                    <TableRow>
                      <TableHead>ID del Plan</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Creado</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acciones</TableHead>

                      {/* <TableHead>Fecha de Creación</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  {/* SUSCRIPCIONES FREE  */}

                  <TableBody>
                    {allPlans?.map((plan, index) => {
                      // Accede al tipo del plan usando el ID del plan
                      const planType = typePlan[plan.id as any]; // typePlan es el objeto que contiene la relación plan.id -> "REGULAR" o "TRIAL"

                      // Filtra para solo mostrar los planes de tipo "TRIAL"
                      if (planType === 'TRIAL') {
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-xs">{plan?.id}</TableCell>
                            <TableCell className="text-sm">{plan?.name}</TableCell>
                            <TableCell
                              className={cn(
                                plan?.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                              )}
                            >
                              {plan?.status}
                            </TableCell>
                            <TableCell>
                              <p className="rounded-none text-xs">
                                {new Date(plan?.create_time).toLocaleDateString('es-ES')}
                              </p>
                            </TableCell>

                            {/* PRECIO DEL PLAN */}
                            <TableCell className="text-right">
                              <span>
                                {planPrices[plan.id]
                                  ? `$${planPrices[plan.id]}`
                                  : 'Precio no Disponible'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => updateBillingPlan(plan.id, plan.status)}
                                variant={'outline'}
                                className="rounded-none text-xs"
                              >
                                {plan.status === 'INACTIVE' ? 'ACTIVAR' : 'INACTIVAR'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }
                      // Si no es un plan "TRIAL", no se renderiza nada
                      return null;
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        <div className="flex md:hidden p-4 w-full">
          {/* ACAAAAA  */}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading subscriptions...</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
              {allPlans?.map((plan, index) => (
                <AccordionItem
                  key={index}
                  value={plan.id}
                  className="w-full border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="text-left w-full p-4 dark:hover:bg-card hover:bg-background">
                    {plan?.name}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 dark:bg-background dark:hover:bg-transparent bg-white shadow-none dark:text-white text-black">
                    <section className="overflow-x-auto">
                      <Table className="w-full divide-y dark:divide-gray-900">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="py-3 text-left text-sm font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                              INFO
                            </TableHead>
                            <TableHead className="py-3 text-right text-sm font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                              Detalle
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900 ">
                              Id del Plan de Suscripcion
                            </TableCell>
                            <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="truncate cursor-help text-xs">{plan.id}</p>
                                  </TooltipTrigger>
                                  <TooltipContent>asdasdasdasd</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                              Plan
                            </TableCell>
                            <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="truncate cursor-help">{plan?.name}</p>
                                  </TooltipTrigger>
                                  <TooltipContent>asdasdasdasd</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                              Fecha de creación
                            </TableCell>
                            <TableCell className="py-4 text-right text-sm dark:text-white text-gray-500">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="truncate cursor-help">
                                      {new Date(plan?.create_time).toLocaleDateString('es-ES')}
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent>asdasdasdasdasdasd</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                              Estado de la suscripción
                            </TableCell>
                            <TableCell className="py-4 text-right w-full flex justify-end ">
                              <Link href={'#'} role="button" tabIndex={0}>
                                <p>{plan?.status}</p>
                              </Link>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="py-4 text-sm font-medium dark:text-white text-gray-900">
                              Precio
                            </TableCell>
                            <TableCell className="text-end flex ">
                              <span className="text-end w-full">
                                {planPrices[plan.id] ? (
                                  `$${planPrices[plan.id]}`
                                ) : (
                                  <Button
                                    onClick={() => handlePlanClick(plan.id)}
                                    variant={'outline'}
                                    className="rounded-none text-xs"
                                  >
                                    Consultar precio
                                  </Button>
                                )}{' '}
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </section>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>

      {/* PASO A PASO INFO CREAR PRODUCTO  */}

      <Card className="mb-6 p-4 bg- dark:bg-card bg-background text-blue-900 dark:text-blue-50 bg-white">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2 dark:text-white text-black">
              Pasos para crear una suscripción en PayPal:
            </h3>
            <ol className="list-decimal list-inside space-y-1">
              <li className="dark:text-white text-black">
                Crear un producto en PayPal para linkear un plan de suscripción.
              </li>
              <li className="dark:text-white text-black">
                Crear un plan de suscripción que se asocia a ese producto (devuelve un plan ID).
              </li>
              <li className="dark:text-white text-black">
                Se genera una suscripción utilizando el ID del plan asociado.
              </li>
            </ol>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md">
              <p className="text-gray-800 dark:text-gray-100 italica">
                Importante: Las suscripciones en Paypal no se pueden borrar por políticas de la
                empresa, de querer remover la suscripción se puede inactivar.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/*  CREAR PRODUCTO  */}

      <Tabs defaultValue="planregular" className="border-none">
        <TabsList className="flex gap-4 justify-start bg-transparent my-[14px]">
          <TabsTrigger
            className={`${
              activeTab === 'inactivas'
                ? 'dark:text-white text-black dark:bg-card bg-background py-1 text-[12px] rounded-none' // Estilo cuando está activo
                : 'text-gray-500 py-1 text-[12px] rounded-none' // Estilo cuando no está activo
            }`}
            value="planregular"
          >
            SUSCRIPCIONES SIN MES GRATUITO
          </TabsTrigger>
          <TabsTrigger
            className={`${
              activeTab === 'inactivas'
                ? 'dark:text-white text-black dark:bg-secondary bg-background py-1 text-[12px] rounded-none' // Estilo cuando está activo
                : 'text-gray-500 py-1 text-[12px] rounded-none ' // Estilo cuando no está activo
            }`}
            value="plantrial"
          >
            SUSCRIPCIONES CON MES GRATUITO
          </TabsTrigger>
        </TabsList>
        <TabsContent value="planregular" className="w-full block xl:block p-0 m-0">
          <Card className="py-5 px-3 mb-5">
            <form onSubmit={handleSubmitProduct(handleCreateProduct)} className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-white text-black">
                Crear Producto Producto Sin Mes de Prueba
              </h2>
              <div className="space-y-3">
                <Label htmlFor="product-name" className="dark:text-white text-black">
                  Nombre del Producto en Paypal
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="product-name"
                  {...registerProduct('name', {
                    required: 'This field is required',
                  })}
                />
                {productErrors.name && (
                  <span className="text-red-500">{productErrors.name.message}</span>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="product-description" className="dark:text-white text-black">
                  Descripcion
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="product-description"
                  {...registerProduct('description')}
                />
              </div>
              <Button type="submit">Crear Producto</Button>
            </form>
          </Card>

          <div className="mb-3">
            {isProductCreated && (
              <div className="mt-4 p-4 dark:bg-card bg-green-100 rounded-md mb-3">
                <p className=" dark:text-white text-black ">Producto creado exitosamente!</p>
                <p className="font-semibold  dark:text-white text-black">
                  Producto ID: {productId}
                </p>
              </div>
            )}
          </div>

          {/*  CREAR PLAN SIN MES DE PRUEBA */}

          <Card className="py-6 px-3 ">
            <form onSubmit={handleSubmitPlan(handleCreatePlan)} className="space-y-4 ">
              <h2 className="text-2xl font-bold dark:text-white text-black">
                Crear Plan de Suscripción Sin Mes de Prueba
              </h2>
              <div className="space-y-3">
                <Label htmlFor="plan-name" className="dark:text-white text-black">
                  Nombre del Plan de Suscripcion
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="plan-name"
                  {...registerPlan('name', { required: 'This field is required' })}
                />
                {planErrors.name && <span className="text-red-500">{planErrors.name.message}</span>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="plan-price" className="dark:text-white text-black">
                  Precio (USD)
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="plan-price"
                  type="number"
                  step="0.01"
                  {...registerPlan('price', {
                    required: 'This field is required',
                    min: { value: 0, message: 'Price must be a positive number' },
                  })}
                />
                {planErrors.price && (
                  <span className="text-red-500">{planErrors.price.message}</span>
                )}
              </div>
              <Button type="submit" disabled={!isProductCreated}>
                Crear Plan
              </Button>
            </form>
          </Card>

          <div className="mb-3">
            {isPlanCreated && (
              <div className="mt-4 p-4 dark:bg-card bg-green-100 rounded-md mb-3">
                <p className="dark:text-white text-black">Plan creado exitosamente!</p>
                <p className="font-semibold dark:text-white text-black">Plan ID: {planId}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* SUSCRIPCIONES INACTIVAS  */}
        <TabsContent value="plantrial" className="w-full block xl:block p-0 m-0">
          <Card className="py-5 px-3 mb-5">
            <form onSubmit={handleSubmitProduct(handleCreateProduct)} className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-white text-black">
                Crear Producto Con Mes de Prueba
              </h2>
              <div className="space-y-3">
                <Label htmlFor="product-name" className="dark:text-white text-black">
                  Nombre del Producto en Paypal
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="product-name"
                  {...registerProduct('name', {
                    required: 'This field is required',
                  })}
                />
                {productErrors.name && (
                  <span className="text-red-500">{productErrors.name.message}</span>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="product-description" className="dark:text-white text-black">
                  Descripcion
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="product-description"
                  {...registerProduct('description')}
                />
              </div>
              <Button type="submit">Crear Producto</Button>
            </form>
          </Card>

          <div className="mb-3">
            {isProductCreated && (
              <div className="mt-4 p-4 dark:bg-card bg-green-100 rounded-md mb-3">
                <p className="dark:text-white text-black">Producto creado exitosamente!</p>
                <p className="font-semibold dark:text-white text-black">Producto ID: {productId}</p>
              </div>
            )}
          </div>

          {/*  CREAR PLAN CON MES DE PRUEBA  */}

          <Card className="py-6 px-3 ">
            <form onSubmit={handleSubmitPlan(handleCreateTrialPlan)} className="space-y-4 ">
              <h2 className="text-2xl font-bold  dark:text-white text-black">
                Crear Plan de Suscripción Con Mes de Prueba
              </h2>
              <div className="space-y-3">
                <Label htmlFor="plan-name " className=" dark:text-white text-black">
                  Nombre del Plan de Suscripcion
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="plan-name"
                  {...registerPlan('name', { required: 'This field is required' })}
                />
                {planErrors.name && <span className="text-red-500">{planErrors.name.message}</span>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="plan-price" className=" dark:text-white text-black">
                  Precio (USD){' '}
                  <span className="italic font-light ">
                    (Este será el precio que se cobrará una vez que finalice el mes gratuito de
                    prueba.)
                  </span>{' '}
                </Label>
                <Input
                  className="dark:bg-background bg-background"
                  id="plan-price"
                  type="number"
                  step="0.01"
                  {...registerPlan('price', {
                    required: 'This field is required',
                    min: { value: 0, message: 'Price must be a positive number' },
                  })}
                />
                {planErrors.price && (
                  <span className="text-red-500">{planErrors.price.message}</span>
                )}
              </div>
              <Button type="submit" disabled={!isProductCreated}>
                Crear Plan
              </Button>
            </form>
          </Card>

          <div className="mb-3">
            {isPlanCreated && (
              <div className="mt-4 p-4 dark:bg-card bg-green-100 rounded-md mb-3">
                <p className="dark:text-white text-black">Plan creado exitosamente!</p>
                <p className="font-semibold dark:text-white text-black">Plan ID: {planId}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Toaster />

      <SubscriptionStatus subscriptionId={subscriptionId} />
    </div>
  );
}
