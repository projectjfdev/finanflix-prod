import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/dbConfig";
import courseModel from "@/models/courseModel";
import Ticket from "@/models/ticketModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "No estás autenticado" },
        { status: 401 }
      );
    }

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Consultas paralelas
    const [lastCourses, lastPendingTickets, lastResolvedTickets] =
      await Promise.all([
        courseModel
          .find({ createdAt: { $gte: tenDaysAgo } }, { title: 1, createdAt: 1 })
          .sort({ createdAt: -1 })
          .limit(2),
        Ticket.find(
          {
            updatedAt: { $gte: tenDaysAgo },
            status: "Pendiente",
            userId: session.user._id,
          },
          { title: 1, updatedAt: 1 }
        )
          .sort({ updatedAt: -1 }) // Orden descendente por `updatedAt`
          .limit(4),
        // Últimos tickets solucionados del usuario en los últimos 10 días
        Ticket.find(
          {
            updatedAt: { $gte: tenDaysAgo },
            status: "Solucionado",
            userId: session.user._id,
          },
          { title: 1, updatedAt: 1 }
        )
          .sort({ updatedAt: -1 }) // Orden descendente por `updatedAt`
          .limit(2),
      ]);

    // Normalizar las notificaciones y asignar un tipo
    const notifications = [
      ...lastCourses.map((course) => ({
        _id: course._id,
        title: course.title,
        date: course.createdAt.toISOString(), // Convertir a ISO string
        type: "course",
      })),
      ...lastPendingTickets.map((ticket) => ({
        _id: ticket._id,
        title: ticket.title,
        date: ticket.updatedAt.toISOString(), // Convertir a ISO string
        type: "pendingTicket",
      })),
      ...lastResolvedTickets.map((ticket) => ({
        _id: ticket._id,
        title: ticket.title,
        date: ticket.updatedAt.toISOString(), // Convertir a ISO string
        type: "resolvedTicket",
      })),
    ];

    // Ordenar todas las notificaciones por fecha descendente
    notifications.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(
      {
        message: "Notificaciones obtenidas correctamente",
        success: true,
        data: notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
