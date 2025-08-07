// C:\Users\jeroa\Desktop\JeroAlderete\1 - Finanflix\finanflix-prod-dev\src\app\api\discord\rol-schema-course\route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import Rol from '@/models/rolesModel';
import { getDiscordIdForUser } from '@/utils/Endpoints/userService';

// ✅ CREAR ROL document
export async function POST(request: Request) {
  try {
    await connectDB();
    const { userId, courses, subs } = await request.json();
    const title = courses?.[0]?.title;

    //console.log(title);

    // Validaciones de id del usuario
    if (!userId) {
      return NextResponse.json(
        {
          message: 'No se encontró el ID del usuario',
        },
        { status: 400 }
      );
    }

    // Verificar si ya existe el rolId de discord con ese userId
    const existingRol = await Rol.findOne({ userId });
    if (existingRol) {
      return NextResponse.json(
        { message: 'Ya existe un Discord Rol Id para este usuario' },
        { status: 409 }
      );
    }

    // Obtener el discordId del usuario específico al que se le está asignando el curso
    const userDiscordId = await getDiscordIdForUser(userId);
    // console.log(userDiscordId, 'userDiscordId para el usuario:', userId);

    // 🔧 Procesamos los cursos para normalizar el formato: - sanitizacion - nos aseguramos que siempre existan los datos y lleguen bien desde el front
    const formattedCourses = (courses || []).map((c: any) => ({
      rolId: c.rolId,
      rolIdExpired: c.rolIdExpired || null,
      title: c.title || 'Sin título',
      status: c.status || 'notClaimed',
      orderDate: c.orderDate ? new Date(c.orderDate) : new Date(),
      source: c.source || 'manual',
      subscriptionType: c.subscriptionType || null,
      rolNumber: typeof c.rolNumber === 'number' ? c.rolNumber : 0,
    }));

    // creamos el discord rolId para el usuario si no existe
    const newRol = new Rol({
      userId: userId,
      discordId: userDiscordId,
      title,
      courses: formattedCourses,
      subs,
    });

    if (userDiscordId && userDiscordId.trim() !== '') {
      newRol.discordId = userDiscordId;
    }

    // console.log('newRol', newRol);

    const res = await newRol.save();
    //console.log('res backend', res);

    return NextResponse.json(
      {
        message: 'Rol creado correctamente',
        success: true,
        courseId: newRol,
        discordRoleAssigned: userDiscordId ? true : false,
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error('Error completo:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error en la creación de la clase en vivo',
      },
      { status: 500 }
    );
  }
}
// actualizamos el Curso discord Rol id del usuario si ya existe

// ✅ ACTUALIZAR ROL EXISTENTE

export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Panel admin desestructuracion
    // const { userId, rolId, title, status, orderDate, rolNumber, sub } = await request.json();
    // Desestructuración principal
    const {
      userId,
      rolId,
      title,
      status,
      orderDate,
      rolNumber,
      sub,
      courses,
      source,
      subscriptionType,
    } = body;

    // console.log('title', title);

    // Mercado pago webhook desestructuracion
    const fallbackCourse = courses?.[0] || {};

    const MpWebhookRolId = rolId ?? fallbackCourse.rolId;
    const MpWebhookTitle = title ?? fallbackCourse.title;
    const MpWebhookStatus = status ?? fallbackCourse.status;
    const MpWebhookOrderDate = orderDate ?? fallbackCourse.orderDate;
    const MpWebhookRolNumber = rolNumber ?? fallbackCourse.rolNumber;

    // console.log('finalRolId', MpWebhookRolId);
    // console.log('finalTitle', MpWebhookTitle);
    // console.log('finalStatus', MpWebhookStatus);
    // console.log('finalOrderDate', MpWebhookOrderDate);
    // console.log('finalRolNumber', MpWebhookRolNumber);

    if (!userId) {
      return NextResponse.json({ message: 'Falta el userId en la solicitud' }, { status: 400 });
    }

    const userRol = await Rol.findOne({ userId });

    if (!userRol) {
      return NextResponse.json(
        { message: 'No se encontró un modelo existente para este usuario' },
        { status: 404 }
      );
    }

    // Log de cursos actuales
    // console.log(
    //   'Cursos actuales:',
    //   userRol.courses.map((c: any) => c.rolId)
    // );
    // console.log('Nuevo rolId recibido:', rolId);

    //* Roles de Trading Pro
    const tradingProRolIds = [
      process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO,
      process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL,
    ];

    // console.log('tradingProRolIds',tradingProRolIds);

    // Verificamos si ya existe el curso con ese rolId (comparando como string)
    const existingRolIdsAdmin = new Set(userRol.courses.map((c: any) => String(c.rolId)));
    const existingRolIdsWebhook = new Set(userRol.courses.map((c: any) => String(c.rolId)));
    // const cursoYaExisteDesdeAdmin = rolId && existingRolIdsAdmin.has(String(rolId));
    const cursoYaExisteDesdeAdmin =
      rolId &&
      (existingRolIdsAdmin.has(String(rolId)) ||
        (tradingProRolIds.includes(String(rolId)) &&
          userRol.courses.some((course: any) => tradingProRolIds.includes(course.rolId))));

    // const cursoYaExisteDesdeWebhook = MpWebhookRolId && existingRolIdsWebhook.has(String(MpWebhookRolId));

    const cursoYaExisteDesdeWebhook =
      MpWebhookRolId &&
      (existingRolIdsWebhook.has(String(MpWebhookRolId)) ||
        (tradingProRolIds.includes(String(MpWebhookRolId)) &&
          userRol.courses.some((course: any) => tradingProRolIds.includes(course.rolId))));

    const segundRolTradingPro = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;
    const tieneSegundoRol = userRol.courses.some(
      (course: any) => course.rolId === segundRolTradingPro
    );
    //* Creacion de curso desde panel admin si no existe
    if (rolId && !cursoYaExisteDesdeAdmin) {
      // console.log('entro');
      const newCourse = {
        rolId: String(rolId),
        title: title || 'Sin título',
        status: status || 'notClaimed',
        orderDate: orderDate ? new Date(orderDate) : undefined,
        source: source || 'manual',
        subscriptionType: null,
        rolNumber: typeof rolNumber === 'number' ? rolNumber : 0,
      };

      // console.log('✅ Agregando nuevo curso:', newCourse);
      userRol.courses.push(newCourse);
    } else if (MpWebhookRolId && !cursoYaExisteDesdeWebhook && !tieneSegundoRol) {
      // console.log('MpWebhookRolId', MpWebhookRolId);
      // console.log('cursoYaExisteDesdeWebhook', cursoYaExisteDesdeWebhook);
      //* Creacion de curso desde mercadopago si no existe
      // console.log('curso creandose desde mercadopago webhook');
      const newCourse = {
        rolId: String(MpWebhookRolId),
        title: MpWebhookTitle || 'Sin título',
        status: MpWebhookStatus || 'notClaimed',
        orderDate: MpWebhookOrderDate ? new Date(MpWebhookOrderDate) : undefined,
        source: source || 'manual',
        subscriptionType: null,
        rolNumber: typeof MpWebhookRolNumber === 'number' ? MpWebhookRolNumber : 0,
      };
      userRol.courses.push(newCourse);
    } else {
      // * SI EXISTE 2 ROL DE TRADING PRO SE ACTUALIZA EN LA BD EL STATUS A CLAIMED Y EL ORDER DATE - SE MANTIENE EL 2 ROL ID NO SE ASIGNA EL 1
      const userRolId = userRol._id.toString();
      // console.log('userRolId', userRolId);
      const segundRolTradingPro = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;
      const tieneSegundoRol = userRol.courses.some(
        (course: any) => course.rolId === segundRolTradingPro
      );
      // console.log('tradingProCourse', tieneSegundoRol);
      if (MpWebhookTitle === 'Trading Pro' && tieneSegundoRol) {
        // console.log('entro');

        const result = await Rol.updateOne(
          { _id: userRolId, 'courses.rolId': segundRolTradingPro },
          {
            $set: {
              'courses.$.status': 'claimed',
              'courses.$.orderDate': new Date(),
              'courses.$.source': 'manual',
              'courses.$.subscriptionType': null,
            },
          }
        );
        // console.log(result);
      } else {
        // console.log('actualizando cursos existentes');
        // * ACTUALIZACION DE STATUS A CLAIMED - SOURCE A MANUAL Y ORDER DATE PARA LOS DEMAS CURSOS SI YA EXISTEN
        const result = await Rol.updateOne(
          { _id: userRolId, 'courses.rolId': MpWebhookRolId },
          {
            $set: {
              'courses.$.status': 'claimed',
              'courses.$.orderDate': new Date(),
              'courses.$.source': 'manual',
              'courses.$.subscriptionType': null,
            },
          }
        );
        //console.log(result);
      }
    }

    // ✅ Actualizamos la sub si viene
    if (sub && typeof sub === 'object') {
      // console.log('Actualizando sub:', sub);
      userRol.sub = sub;
    }

    // Guardamos el documento
    try {
      const res = await userRol.save();
      // console.log('✅ Rol actualizado exitosamente:\n', JSON.stringify(res, null, 2));
    } catch (saveError) {
      // console.error('❌ Error al guardar el documento:', saveError);
      return NextResponse.json({ message: 'Error al guardar los datos' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Curso agregado correctamente (si no estaba duplicado)', success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error actualizando el rol del usuario',
      },
      { status: 500 }
    );
  }
}

// ✅ OBTENER ROL POR ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'No se encontró el ID del usuario' }, { status: 400 });
    }

    // Buscar el documento existente
    const userRol = await Rol.findOne({ userId: id });
    if (!userRol) {
      return NextResponse.json(
        { message: 'No se encontró un modelo existente para este usuario' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Rol encontrado', success: true, rol: userRol },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error recuperando los roles del usuario',
      },
      { status: 500 }
    );
  }
}
