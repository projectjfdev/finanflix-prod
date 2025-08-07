"use server";

import Users from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/dbConfig";
import cloudinary from "@/lib/cloudinary";

export async function PUT(
  request: Request,
  { params }: { params: { [key: string]: string } }
) {
  await connectDB();
  const body = await request.json();

  try {
    const currentUser = await Users.findById(params.id);

    if (!currentUser)
      return NextResponse.json(
        {
          message: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );

    let updateUser = { ...body };

    if (updateUser.profileImage) {
      if (currentUser.profileImage && currentUser.profileImage.public_id) {
        const previousImgId = currentUser.profileImage.public_id;
        await cloudinary.uploader.destroy(previousImgId);
      }

      const newImage = await cloudinary.uploader.upload(
        updateUser.profileImage,
        {
          folder: "images",
          transformation: [
            {
              crop: "fill",
              quality: 60,
              format: "auto",
              strip_metadata: true,
              delivery: "auto",
              bytes_limit: 200000,
            },
          ],
        }
      );

      updateUser.profileImage = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    const userUpdated = await Users.findByIdAndUpdate(params.id, updateUser, {
      new: true,
    });

    if (!userUpdated)
      return NextResponse.json(
        {
          message: "Usuario no encontrado al momento de actualizar",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Usuario actualizado correctamente",
        updateUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(error.message, {
      status: 400,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  // Eliminar cookies cuando elimina la cuenta
  try {
    const userDeleted = await Users.findById(params.id);

    const session = await getServerSession(authOptions);

    const cookieStore = cookies();

    const sessionTokenCookie =
      cookieStore.get("__Secure-next-auth.session-token") ||
      cookieStore.get("next-auth.session-token");

    // verificamos si hay token en las cookies
    if (!sessionTokenCookie) {
      return NextResponse.json({
        message: "No estás logueado",
        status: 403,
        success: false,
      });
    }

    if (userDeleted._id.toString() !== session?.user._id.toString()) {
      return NextResponse.json({
        message:
          "El usuario que se intenta eliminar no coincide con el usuario logueado",
        status: 403,
        success: false,
      });
    }

    if (!userDeleted)
      return NextResponse.json(
        {
          message: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );

    // No se si la img se esta borrando de cloudinary, hay q testear
    if (userDeleted.profileImage.public_id) {
      // let imgsToDelete = userDeleted.profileImage;
      await cloudinary.uploader.destroy(userDeleted.profileImage?.public_id);
    }

    await Users.findByIdAndDelete(params.id);

    cookieStore.delete("__Secure-next-auth.session-token");
    cookieStore.delete("next-auth.session-token");

    return NextResponse.json({
      message: "Usuario eliminado satisfactoriamente",
      status: 200,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(error.message, {
      status: 400,
    });
  }
}
