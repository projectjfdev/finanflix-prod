import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const paths = body.paths || [];

  if (paths.length === 0) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No has seleccionado ninguna ruta para revalidar",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  paths.forEach((path: string) => {
    if (path) {
      revalidatePath(path);
    }
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: `Rutas revalidadas: ${paths.join(", ")}`,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
