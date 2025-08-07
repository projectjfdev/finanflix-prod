import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import Preferences from '@/models/preferencesModel';
import { validateAdminSession } from '@/lib/security';

export async function POST(request: Request) {
  try {
    await connectDB();
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }
    const userPreferences = await Preferences.find().populate('userId');

    const headers = [
      'userId',
      'userEmail',
      'specializationArea',
      'weeklyAvailability',
      'cryptoStartDate',
      'futureGoalInTwoYears',
      'goalInFiveYears',
      'availableCapital',
      'howDidYouDo',
      'principalObjective',
      'studyTime',
      'experienceInOtherMarkets',
      'connectedToDiscord',
      'createdAt',
      'updatedAt',
    ];

    const separator = ';';

    const rows = userPreferences.map(pref => {
      return [
        pref.userId?._id?.toString() || '',
        pref.userId?.email || '',
        pref.specializationArea?.join(', ') || '',
        pref.weeklyAvailability || '',
        pref.cryptoStartDate || '',
        pref.futureGoalInTwoYears || '',
        pref.goalInFiveYears || '',
        pref.availableCapital || '',
        pref.howDidYouDo || '',
        pref.principalObjective || '',
        pref.studyTime || '',
        pref.experienceInOtherMarkets || '',
        pref.connectedToDiscord ? 'Sí' : 'No',
        pref.createdAt.toISOString(),
        pref.updatedAt.toISOString(),
      ]
        .map(cell => `"${String(cell).replace(/"/g, '""')}"`)
        .join(separator);
    });

    const csv = [headers.join(separator), ...rows].join('\n');
    const bom = '\uFEFF'; // Byte Order Mark para compatibilidad con Excel
    const csvWithBom = bom + csv;

    return new Response(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=preferences.csv',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la descarga.',
      },
      { status: 500 }
    );
  }
}
