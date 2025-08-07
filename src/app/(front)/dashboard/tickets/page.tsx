"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BigTitle from "@/components/BigTitle/BigTitle";

// Define the Ticket interface
interface Ticket {
  id: number;
  title: string;
  status: "Abierto" | "En Progreso" | "Cerrado";
  priority: "Alta" | "Media" | "Baja";
  createdAt: string;
}

// Mock data for tickets
const tickets: Ticket[] = [
  {
    id: 1,
    title: "Problema de Login",
    status: "Abierto",
    priority: "Alta",
    createdAt: "2023-04-01",
  },
  {
    id: 2,
    title: "Pago Fallido",
    status: "En Progreso",
    priority: "Media",
    createdAt: "2023-04-02",
  },
  {
    id: 3,
    title: "Solicitud de Idea",
    status: "Cerrado",
    priority: "Baja",
    createdAt: "2023-04-03",
  },
  {
    id: 4,
    title: "Borrado de Cuenta",
    status: "Abierto",
    priority: "Alta",
    createdAt: "2023-04-04",
  },
  {
    id: 5,
    title: "Password reset",
    status: "En Progreso",
    priority: "Media",
    createdAt: "2023-04-05",
  },
];

export default function TicketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets: Ticket[] = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "Abierto":
        return "bg-green-500";
      case "En Progreso":
        return "bg-yellow-500";
      case "Cerrado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full mx-auto md:ml-7 overflow-x-scroll md:overflow-hidden">
      {/* <h1 className="px-5 md:px-0 text-2xl font-bold mb-5">Admin Ticket</h1> */}
      <BigTitle
        className="px-5 md:px-0 text-2xl font-bold mb-5 pt-[21px] pb-3"
        title="Admin Ticket"
      />

      <div className="px-5 md:px-0 mb-14 md:mb-4 ">
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm dark:bg-card bg-white shadow-xl "
        />
      </div>

      {/* TABLA DE TICKETS DESK */}
      <div className="hidden lg:flex md:flex-col dark:bg-background bg-white rounded-2xl shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.createdAt}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        Ver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Ticket Details</DialogTitle>
                        <DialogDescription>
                          Ver y administrar ticket.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTicket && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">ID:</span>
                            <span className="col-span-3">
                              {selectedTicket.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Título:</span>
                            <span className="col-span-3">
                              {selectedTicket.title}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Status:</span>
                            <span className="col-span-3">
                              <Badge
                                className={getStatusColor(
                                  selectedTicket.status
                                )}
                              >
                                {selectedTicket.status}
                              </Badge>
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Prioridad:</span>
                            <span className="col-span-3">
                              {selectedTicket.priority}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Created At:</span>
                            <span className="col-span-3">
                              {selectedTicket.createdAt}
                            </span>
                          </div>
                        </div>
                      )}
                      <Button className="mt-4">Update Ticket</Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ACORDION TICKETS MOBILES */}

      <div className="px-5 flex flex-col lg:hidden">
        <Accordion type="single" collapsible className="w-full">
          {filteredTickets.map((ticket) => (
            <AccordionItem key={ticket.id} value={ticket.id.toString()}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium">{ticket.title}</span>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {ticket.id}
                  </p>
                  <p>
                    <strong>Prioridad:</strong> {ticket.priority}
                  </p>
                  <p>
                    <strong>Fecha de Creación:</strong> {ticket.createdAt}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTicket(ticket)}
                        className="w-full mt-2"
                      >
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Ticket Details</DialogTitle>
                        <DialogDescription>
                          Ver y administrar ticket.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTicket && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">ID:</span>
                            <span className="col-span-3">
                              {selectedTicket.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Título:</span>
                            <span className="col-span-3">
                              {selectedTicket.title}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Status:</span>
                            <span className="col-span-3">
                              <Badge
                                className={getStatusColor(
                                  selectedTicket.status
                                )}
                              >
                                {selectedTicket.status}
                              </Badge>
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Prioridad:</span>
                            <span className="col-span-3">
                              {selectedTicket.priority}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Created At:</span>
                            <span className="col-span-3">
                              {selectedTicket.createdAt}
                            </span>
                          </div>
                        </div>
                      )}
                      <Button className="mt-4 w-full">Update Ticket</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
