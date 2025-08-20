import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import Preferences from '@/models/preferencesModel';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    let {
      userId,
      specializationArea,
      weeklyAvailability,
      cryptoStartDate,
      experienceInOtherMarkets,
      futureGoalInTwoYears,
      goalInFiveYears,
      availableCapital,
      howDidYouDo,
      principalObjective,
      studyTime,
    } = await request.json();

    // Validaciones
    if (!userId) {
      return NextResponse.json(
        {
          message: 'No existe el usuario a actualizar',
        },
        { status: 400 }
      );
    }

    if (!specializationArea || !weeklyAvailability) {
      return NextResponse.json(
        {
          message:
            'Antes de guardar, especifica el "Area de especialización" y tu "Disponibilidad horaria semanal" en los primeros dos pasos',
        },
        { status: 400 }
      );
    }

    const newPreferences = new Preferences({
      userId,
      specializationArea,
      weeklyAvailability,
      cryptoStartDate,
      experienceInOtherMarkets,
      futureGoalInTwoYears,
      goalInFiveYears,
      availableCapital,
      howDidYouDo,
      principalObjective,
      studyTime,
    });

    await newPreferences.save();

    return NextResponse.json(
      {
        message: 'Preferencias creadas correctamente',
        success: true,
        data: newPreferences,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error en la creación de las preferencias',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const session = await getServerSession(authOptions);
    const currentPreference = await Preferences.findOne({
      userId: session?.user._id,
    });

    if (!currentPreference)
      return NextResponse.json(
        {
          message: 'Preferencia no encontrada',
        },
        {
          status: 404,
        }
      );

    let updatePreference = { ...body };

    const courseUpdated = await Preferences.findByIdAndUpdate(
      currentPreference._id,
      updatePreference,
      {
        new: true,
      }
    );

    if (!courseUpdated)
      return NextResponse.json(
        {
          message: 'Preferencia no encontrada al momento de actualizar',
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: 'Preferencias actualizadas correctamente',
        data: courseUpdated,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la actualización del curso',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  try {
    const preferencesUser = await Preferences.findOne({
      userId: session?.user._id,
    });

    return NextResponse.json({
      message: 'Preferencias del usuario',
      data: preferencesUser,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error en la consulta' }, { status: 500 });
  }
}
