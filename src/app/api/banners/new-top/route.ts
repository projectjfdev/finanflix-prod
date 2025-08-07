import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import cloudinary from '@/lib/cloudinary';
import bannerTopModel from '@/models/bannerTopModel';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    await connectDB();
    let { startDate, endDate, image, description, title, redirect, isActive, clickeable, cta } =
      await request.json();

    // Validaciones
    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          message: 'El banner debe tener la fecha en la que inicia y la fecha en la que sale',
        },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json(
        {
          message: 'La fecha de inicio no puede ser posterior a la fecha de fin',
        },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { message: 'Por favor, ingresa la imagen del banner' },
        { status: 400 }
      );
    }

    const newImage = await cloudinary.uploader.upload(image, {
      folder: 'images',
      transformation: [
        {
          crop: 'fill',
          quality: 60,
          format: 'auto',
          strip_metadata: true,
          delivery: 'auto',
          bytes_limit: 200000,
        },
      ],
    });
    image = {
      public_id: newImage.public_id,
      url: newImage.secure_url,
    };

    const newBannerTop = new bannerTopModel({
      startDate,
      endDate,
      image,
      description,
      title,
      redirect,
      isActive,
      clickeable,
      cta,
    });

    await newBannerTop.save();

    // revalidateTag("bannersTop");
    revalidatePath(`/api/banners/get-banners`);
    // const resultRevalidate = await fetch(
    //   `https://finanflix-project-7sry.vercel.app/api/revalidate?path=/dashboard/banner-top`
    // );
    // console.log("resultRevalidate", resultRevalidate);

    return NextResponse.json(
      {
        message: 'Banner creado correctamente',
        success: true,
        banner: newBannerTop,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la creación del nuevo banner',
      },
      { status: 500 }
    );
  }
}
