import type { IUser } from '@/interfaces/user';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import UserCourse from '@/models/userCourseModel';
import userModel from '@/models/userModel';
import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';
import type { ObjectId } from 'mongoose';
import { ISection } from '@/interfaces/course';

interface IUserWithCourses extends IUser {
  enrolledCourses: ObjectId[];
}

export async function GET(req: NextRequest) {
  try {
    // 1. Check authentication first before connecting to DB
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: 'El usuario no está logueado',
          status: 403,
          success: false,
        },
        { status: 403 }
      );
    }

    await connectDB();

    // 2. Connect to database

    // 3. Find user with a lean query to reduce memory usage
    const user: any = await userModel
      .findOne({ email: session.user.email })
      .select('_id enrolledCourses')
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          message: 'Usuario no encontrado',
          status: 404,
          success: false,
        },
        { status: 404 }
      );
    }

    // 4. Get enrolled course IDs
    const courseIds = user?.enrolledCourses || [];

    if (courseIds.length === 0) {
      return NextResponse.json({
        message: 'No hay cursos inscritos',
        data: [],
        success: true,
      });
    }

    // 5. Get courses and progress in parallel to reduce execution time
    const [courses, userCoursesProgress] = await Promise.all([
      courseModel
        .find({ _id: { $in: courseIds } }, 'thumbnail title subtitle sections')
        .limit(3)
        .lean(),

      UserCourse.find({
        userId: user._id,
        courseId: { $in: courseIds },
      }).lean(),
    ]);

    // 6. Process courses with progress data
    const coursesWithProgress = await Promise.all(
      courses.map(async course => {
        const userCourse = userCoursesProgress.find(
          uc => String(uc.courseId) === String(course._id)
        );

        if (!userCourse) {
          return {
            courseId: course._id,
            title: course.title,
            thumbnail: course.thumbnail,
            totalLessons: 0,
            lessonsCompleted: 0,
            nextLesson: null,
          };
        }

        // Calculate lesson stats
        const totalLessons = userCourse.progress.reduce(
          (total: number, section: ISection) => total + (section.lessons?.length || 0),
          0
        );

        const lessonsCompleted = userCourse.progress.reduce(
          (completed: number, section: any) =>
            completed +
            (section.lessons?.filter((lesson: any) => lesson?.isViewed?.status)?.length || 0),
          0
        );

        // Find next lesson
        let nextLesson = null;

        // Find first unviewed lesson
        for (const section of userCourse.progress) {
          if (!section.lessons) continue;

          const unviewedLesson = section.lessons.find((lesson: any) => !lesson.isViewed?.status);
          if (unviewedLesson) {
            // Find section and lesson data from course
            const sectionData = course.sections?.find(
              (sec: any) => String(sec._id) === String(section.sectionId)
            );

            if (sectionData) {
              const lessonData = sectionData.lessons?.find(
                (les: any) => String(les._id) === String(unviewedLesson.lessonId)
              );

              if (lessonData) {
                nextLesson = {
                  sectionId: section.sectionId,
                  ...lessonData,
                };
                break;
              }
            }
          }
        }

        return {
          courseId: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          totalLessons,
          lessonsCompleted,
          nextLesson,
        };
      })
    );

    return NextResponse.json(
      {
        message: 'Cursos y progreso recuperados con éxito',
        data: coursesWithProgress.filter(Boolean),
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error('Error in user-courses API:', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error desconocido',
        success: false,
      },
      { status: 500 }
    );
  }
}
