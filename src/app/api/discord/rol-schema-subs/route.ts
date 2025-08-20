// C:\Users\jeroa\Desktop\JeroAlderete\1 - Finanflix\finanflix-prod-dev\src\app\api\discord\rol-schema-subs\route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import Rol from '@/models/rolesModel';
import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';

// Crear modelo con solo suscripción (si no existe aún)
export async function POST(request: Request) {
  try {
    await connectDB();
    const { userId, sub } = await request.json();

    if (!userId || !sub) {
      return NextResponse.json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Verificamos si ya existe un modelo para este usuario
    const existingRol = await Rol.findOne({ userId });
    if (existingRol) {
      return NextResponse.json(
        { message: 'Ya existe un modelo para este usuario' },
        { status: 409 }
      );
    }

    // Obtener el discordId del usuario específico al que se le está asignando el curso
    const userDiscordId = await getDiscordIdForUser(userId);
    // console.log('userDiscordId', userDiscordId);

    // Creamos el nuevo documento solo con la sub
    // console.log('sub', sub);

    if (sub && !sub.type.toLowerCase().includes('diamond')) {
      const newRol = new Rol({
        userId,
        discordId: userDiscordId,
        courses: [],
        sub,
      });

      await newRol.save();

      return NextResponse.json(
        {
          message: 'Modelo creado con suscripción',
          success: true,
          rol: newRol,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error en la creación del modelo' },
      { status: 500 }
    );
  }
}

// Actualizar solo la suscripción (campo `sub`)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { userId, sub, subStatus } = await request.json();
    const { type } = sub;

    // console.log('type', type);

    const userRol = await Rol.findOne({ userId });

    // console.log('userRol', userRol);

    if (!userRol) {
      // console.log('entrio');

      return NextResponse.json(
        { message: 'No se encontró un modelo para este usuario' },
        { status: 404 }
      );
    }

    if (!userId || !sub) {
      return NextResponse.json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Obtener el discordId del usuario específico al que se le está asignando el curso
    const userDiscordId = await getDiscordIdForUser(userId);
    // console.log('userDiscordId', userDiscordId);

    const completedCourses = await getCompletedCoursesCount(userId);
    // console.log('completedCourses', completedCourses);

    const threeCompletedCoursesRole =
      process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES;

    if (sub.type === 'Suscripcion basic - mensual' && completedCourses >= 3) {
      // console.log('✅ Usuario tiene 3 cursos completados o más');
      // console.log('Asignando rol:', threeCompletedCoursesRole);
      userRol.sub.rol.id = threeCompletedCoursesRole!;
      userRol.sub.rol.rolNumber = 2;
      userRol.sub.type = type;
      userRol.sub.rol.status = subStatus === 'active' || sub.rol.status === 'claimed' ? 'claimed' : 'expired'; // doble condicion para admin y mercadopago webhook
      userRol.sub.rol.orderDate = sub.rol?.orderDate || new Date();
      userRol.markModified('sub.rol');
    } else {
      userRol.sub = sub;

      console.log('substatus', subStatus);
      //* Logica para admin sus
      // 👇 Sobreescribí el rol.status si la suscripción NO está activa
      if (subStatus !== 'active') {
        userRol.sub.rol.status = 'expired';
      } else {
        userRol.sub.rol.status = 'claimed';
      }

      //* Logica para mercadoPagoWebhook
      if (sub.rol.status === 'claimed') {
        userRol.sub.rol.status = 'claimed';
      }
    }
    // ✅ guardamos el discordId tambien
    userRol.discordId = userDiscordId;
    await userRol.save();

    return NextResponse.json(
      { message: 'Suscripción actualizada correctamente', success: true },
      { status: 200 }
    );
  } catch (error) {
    // console.log('error entrando aca');

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error actualizando la suscripción',
      },
      { status: 500 }
    );
  }
}
