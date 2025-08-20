import { connectDB } from "@/lib/dbConfig";
import liveLessonModel from "@/models/liveLessonModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { [key: string]: string } }
) {
  await connectDB();
  try {
    const course = await liveLessonModel.findById(params.id);

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json(
          { message: "Invalid course ID" },
          { status: 400 }
        );
      }

    if (!course)
      return NextResponse.json(
        {
          message: "course not found",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json(error.message, {
      status: 400,
    });
  }
}

