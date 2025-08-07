import { Session } from 'next-auth';

export function hasSubscription(session: Session | null): boolean {
  if (!session?.user?.suscription) return false;

  const { status, endDate } = session.user.suscription;
  return status === 'active' && new Date(endDate) > new Date();
}

/*Ejemplo de cómo usar esto (es lo mismo en un "use client" o en un "use server"):*/

//   if (!hasSubscription(session)) {
//     return new Response("No autorizado", { status: 403 });
//   }
