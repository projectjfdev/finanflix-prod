import Link from 'next/link';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ArrowRight, Book, CheckCircle, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  title: string;
  text: string;
  textRedirectBtn: string;
  redirectNew: string;
  redirectSeeAll: string;
}

export const CardSuccessfulCreation = ({
  title,
  text,
  textRedirectBtn,
  redirectNew,
  redirectSeeAll,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-auto p-4 bg-white  dark:bg-background rounded-2xl border md:mt-10">
      <Card className="w-full max-w-2xl dark:bg-background dark:shadow-gray-950 shadow-gray-200  dark:text-white text-black md:my-10">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <CheckCircle className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{text}</p>
          <div className="grid gap-4 w-full max-w-md">
            <Link href={redirectSeeAll}>
              <div className="w-full text-white bg-primary rounded-md flex items-center  justify-center text-md py-3">
                <Book className="mr-2 h-4 w-4" />
                {textRedirectBtn}
              </div>
            </Link>
            <Link href={'/'}>
              <div className="w-full dark:text-white text-black dark:bg-background border rounded-md flex items-center  justify-center text-md py-3">
                <Home className="mr-2 h-4 w-4" />
                Home
              </div>
            </Link>

            {/* <Link href={redirectNew}> */}
            <Button
              onClick={() => (window.location.href = redirectNew)}
              className="w-full"
              variant="link"
              size="lg"
            >
              Nueva creación
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {/* </Link> */}
          </div>

          <p className="md:mt-8 text-sm text-muted-foreground">
            ¿Necesitas ayuda?{' '}
            <Link
              href={'https://chat.whatsapp.com/Dns0OopSO5HKzQUxP6iBg1'}
              className="text-primary hover:underline"
            >
              Contactar soporte
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
