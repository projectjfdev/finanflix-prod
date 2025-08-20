import { IPreferences } from '@/interfaces/preferences';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/dbConfig';
import Preferences from '@/models/preferencesModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB(); // Asegúrate de que la conexión a la base de datos esté optimizada

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const preferencesUser = (await Preferences.findOne(
      { userId: session.user._id },
      'specializationArea weeklyAvailability cryptoStartDate futureGoalInTwoYears goalInFiveYears availableCapital howDidYouDo principalObjective studyTime experienceInOtherMarkets connectedToDiscord'
    ).lean()) as IPreferences | null;

    const perfilCompleted = !!(
      session.user.tel &&
      session.user.firstName &&
      session.user.lastName &&
      session.user.profileImage
    );

    const preferences = !!(
      preferencesUser &&
      preferencesUser.specializationArea.length > 0 &&
      preferencesUser.weeklyAvailability?.trim() &&
      preferencesUser.cryptoStartDate?.trim() &&
      preferencesUser.futureGoalInTwoYears?.trim() &&
      preferencesUser.goalInFiveYears?.trim() &&
      preferencesUser.availableCapital?.trim() &&
      preferencesUser.howDidYouDo?.trim() &&
      preferencesUser.principalObjective?.trim() &&
      preferencesUser.studyTime?.trim() &&
      preferencesUser.experienceInOtherMarkets?.trim()
    );

    // const connectedToDiscord = Boolean(preferencesUser?.connectedToDiscord);
    const connectedToDiscord = !!preferencesUser?.connectedToDiscord;

    const onboardingInfo = { preferences, connectedToDiscord, perfilCompleted };

    return NextResponse.json({
      message: 'Preferencias del usuario',
      data: onboardingInfo,
      success: true,
    });
  } catch (error) {
    console.error('Error in /api/users/preferences/onboarding-info:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
