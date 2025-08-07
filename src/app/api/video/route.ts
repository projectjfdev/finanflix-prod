import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  // Finanflix AccessToken
  // const accessToken = "9c36a7d9f1ea53f57a0c350b01134f96";

  const accessToken = process.env.VIMEO_ACCESS_TOKEN;

  if (!videoId) {
    return NextResponse.json(
      { error: "Falta el ID del video" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el video");
    }

    const data = await response.json();
    return NextResponse.json({ data: data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
