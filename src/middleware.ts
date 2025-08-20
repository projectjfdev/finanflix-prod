import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

interface CustomToken {
  _id?: string;
  user?: {
    email: string;
  };
}

const finanflixSecretId = process.env.AUTH_EMAIL;

export default withAuth(
  async function middleware(req) {
    const token = (await getToken({ req })) as CustomToken;
    // console.log("token", token);

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Restricción adicional para la ruta /admin segun id

    if (req.nextUrl.pathname.startsWith('/dashboard') && token?.user?.email !== finanflixSecretId) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/sdashboard', '/sdashboard/:path*'],
};
