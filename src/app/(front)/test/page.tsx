'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { CreditCard, GraduationCap, Upload, ArrowRightLeft, UploadIcon, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import BigTitle from '@/components/BigTitle/BigTitle';
import { getSuscriptionById } from '@/utils/Endpoints/suscriptionsPlanEndpoint';
import { ISubscriptionPlan } from '@/interfaces/subscriptionPlan';
import MercadoPagoSuscription from '@/components/PaymentMethodBtn/MercadoPagoSuscription/MercadoPagoSuscription';
import { LoadingFinanflix } from '@/utils/Loading/LoadingFinanflix';
import { PayPalButtonSubscription } from '@/components/PaymentMethodBtn/PayPalButtonSuscription/PayPalButtonSuscription';
import { useRate } from '@/hooks/useRate';
import { createSuscriptionOrder } from '@/utils/Endpoints/orderEndpoints';
import { Toaster, toast } from 'sonner';
import {
  sendOfflineSuscriptionAdmin,
  sendOfflineSuscriptionConfirmation,
} from '@/utils/Endpoints/emailEndpoints';
import { FormBillingDetails } from '@/components/FormBillingDetails/FormBillingDetails';
import { useBillingDetails } from '@/hooks/useBillingDetails';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FastPaginationAuth } from '@/components/Auth/FastPaginationAuth';
import FooterVisibilitySetter from '@/components/Footer/FooterVisibilitySetter';
import VimeoTrailerControls from '@/utils/VimeoPlayer/VimeoTrailerControls';
import { FaqSuscriptionStyle } from '@/components/Faqs/FaqSuscription';

interface ApprovedProps {
  message: string;
  success: null | boolean;
}
type SuscriptionTypeKey = 'basic' | 'icon' | 'diamond';
type Step = 'billing' | 'payment' | null;

export default function TestPage() {
  return (
    <div className="w-full -z-10 sm:px-3 md:px-10 lg:px-20 xl:px-40 md:w-screen md:ml-[calc(-50vw+50%)] pb-40">
      <div className="bg-[#5D3FD3] px-3 md:px-0  text-white rounded-lg pt-10 pb-20 lg:pb-40 text-center absolute top-[0px] left-0 right-0 md:w-screen md:ml-[calc(-50vw+50%)]">
        <Image
          src="https://res.cloudinary.com/drlottfhm/image/upload/v1750702623/logo2_jehphr.png"
          alt="Finanflix Logo"
          width={300}
          height={300}
          className="mx-auto pb-8 w-[250px] h-auto sm:w-[300px] sm:h-auto"
        />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl sm:font-[400] lg:mt-3 mb-1 md:mb-3 font-groteskSharpBold10">
            ESTÁS A TAN SOLO UN PASO DE CAMBIAR TU FUTURO.
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl sm:font-[400] font-groteskSharpBold10">
            ES HORA DE CRYPTO.
          </h2>
    
      </div>
      <div className="md:py-40"></div>
      <Toaster />
      <FooterVisibilitySetter hidden={true} />
    </div>
  );
}
