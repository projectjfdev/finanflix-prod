import { connectDB } from '@/lib/dbConfig';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import subscriptionPlanModel from '@/models/subscriptionPlanModel';

export async function GET(request: Request, { params }: { params: { [key: string]: string } }) {
  await connectDB();
  try {
    // Trim any whitespace from the ID
    const id = params.id.trim();

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: 'Invalid subscription ID format',
        },
        {
          status: 400,
        }
      );
    }

    const subscription = await subscriptionPlanModel.findById(id);

    if (!subscription) {
      return NextResponse.json(
        {
          message: 'Subscription not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(subscription);
  } catch (error: any) {
    // console.error('Error', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the subscription' },
      {
        status: 500,
      }
    );
  }
}
