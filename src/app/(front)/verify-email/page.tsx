'use client';

import { Confirm } from '@/components/Welcome/Confirm';
import { ExpiredToken } from '@/components/Welcome/ExpiredToken';
import { InvalidToken } from '@/components/Welcome/InvalidToken';
import { newVerification } from '@/utils/Endpoints/authEndpoints';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const VerifyEmail = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return;
    }
    if (!token) {
      setError('No token provided');
      return;
    }
    const res = await newVerification({ token });
    setSuccess(res.message);
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, []);

  //TODO: Cambiar UI de los tres componentes
  if (success === 'Token inválido') return <InvalidToken />;
  if (success === 'El token ha expirado') return <ExpiredToken />;
  if (success === 'Email verificado') return <Confirm />;
};

export default VerifyEmail;
