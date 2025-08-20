import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const path = body.path;

  if (path) {
    revalidatePath(path);
    return new Response(
      JSON.stringify({ revalidated: true, now: Date.now() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      revalidated: false,
      now: Date.now(),
      message: "Missing path to revalidate",
    }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}
