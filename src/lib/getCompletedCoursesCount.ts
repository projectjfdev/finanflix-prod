// C:\Users\Ecotech\Desktop\Jeronimo Alderete\finanflix-prod-main\src\lib\getCompletedCoursesCount.ts


import mongoose from 'mongoose';
import UserCourse from '@/models/userCourseModel';

export const getCompletedCoursesCount = async (userId: string) => {
  const result = await UserCourse.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        courseId: 1,
        allViewed: {
          $allElementsTrue: {
            $map: {
              input: {
                $reduce: {
                  input: "$progress",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this.lessons"] },
                },
              },
              as: "lesson",
              in: "$$lesson.isViewed.status",
            },
          },
        },
      },
    },
    {
      $match: {
        allViewed: true,
      },
    },
    {
      $count: "completedCourses",
    },
  ]);

  return result[0]?.completedCourses || 0;
};
