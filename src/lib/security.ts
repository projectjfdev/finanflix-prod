import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { authOptions } from './authOptions';

export const validateAdminSession = async () => {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  // const sessionTokenCookie = cookieStore.get(process.env.NODE_ENV === 'production' ? '_Secure-next-auth.session-token' : 'next-auth.session-token');
  const sessionTokenCookie =
    cookieStore.get('__Secure-next-auth.session-token') ||
    cookieStore.get('next-auth.session-token');

  // // Validación de sesión
  if (!sessionTokenCookie) {
    return NextResponse.json({
      message: 'No estás logueado como administrador',
      status: 403,
      success: false,
    });
  }

  // Validación de admin
  if (process.env.FINANFLIX_SECRET_ID !== session?.user._id.toString()) {
    return NextResponse.json({
      message: 'Conflicto en cuenta de administrador',
      status: 403,
      success: false,
    });
  }

  return null;
};
