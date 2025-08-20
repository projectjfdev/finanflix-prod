import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import userCourseModel from '@/models/userCourseModel';
import courseModel from '@/models/courseModel';
import { Types } from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions)

    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userCourseId = session?.user._id.toString()
        const courseId = searchParams.get('courseId');

        // console.log(userCourseId, "userCourseId");
        // console.log(courseId, "courseId");

        if (!userCourseId || !courseId) {
            return NextResponse.json(
                { error: 'userCourseId and courseId are required' },
                { status: 400 }
            );
        }

        // Obtener el progreso del usuario
        const userCourse = await userCourseModel.findOne({
            userId: userCourseId,
            courseId: courseId,
        });

        if (!userCourse) {
            return NextResponse.json(
                { error: 'User course not found' },
                { status: 404 }
            );
        }

        // Obtener la estructura completa del curso
        const course = await courseModel.findById(courseId);

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        // Contar el total de lecciones en el curso
        let totalLessons = 0;
        course.sections.forEach((section: any) => {
            totalLessons += section.lessons.length;
        });

        // Contar las lecciones vistas
        let viewedLessons = 0;
        userCourse.progress.forEach((section: any) => {
            section.lessons.forEach((lesson: any) => {
                if (lesson.isViewed.status === true) {
                    viewedLessons++;
                }
            });
        });

        // Verificar si todas las lecciones han sido vistas
        const isCompleted = viewedLessons === totalLessons && totalLessons > 0;

        return NextResponse.json({
            isCompleted,
            totalLessons,
            viewedLessons,
            completionPercentage: totalLessons > 0 ? (viewedLessons / totalLessons) * 100 : 0,
        });

    } catch (error) {
        console.error('Error checking course completion:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
