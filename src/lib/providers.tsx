'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export function Providers({ children }: { children: React.ReactNode; session: Session | null }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_PRODUCTION ?? '',
          // intent: "capture"
          vault: 'true', // seteo vault en true para que me agarre el boton de Suscripción de Paypal
        }}
        // options={{
        //   clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
        //   intent: "subscription",
        //   vault: true,
        //   components: "buttons",
        //   currency: "USD",
        // }}
      >
        <SessionProvider>{children}</SessionProvider>
      </PayPalScriptProvider>
    </ThemeProvider>
  );
}
