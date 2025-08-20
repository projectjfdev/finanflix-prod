import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getNotifications } from '@/utils/Endpoints/notificationsEndpoints';
import { Bell, BellOff, School, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tipos de notificaciones
interface Notification {
  _id: any;
  title: string;
  date: string;
  type: string; // Cambiado a string para poder manejar tipos dinámicos
}

const notificationIcons = {
  course: <School className="text-primary" size={18} />,
  pendingTicket: <Ticket className="text-yellow-300" size={18} />,
  resolvedTicket: <Ticket className="text-green-400" size={18} />,
  // Puedes agregar más iconos para otros tipos
};

export function DropdownNoti() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const totalUnreadNotifications = notifications?.length || 0;

  // Función que devuelve el contenido dinámico según el tipo de notificación
  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'course':
        return (
          <Link href={`/checkout/${notification.title}`} className="space-y-1">
            <h2 className="italic text-sm flex gap-2 font-poppins">
              {notificationIcons.course} ¡Nuevo curso!
            </h2>
            <div className="text-[#A7A7A7] font-poppins text-xs truncate">
              {notification?.title && notification.title.length > 35
                ? `${notification.title.substring(0, 35)}...`
                : notification?.title}
            </div>
          </Link>
        );
      case 'pendingTicket':
      case 'resolvedTicket':
        return (
          <Link
            target="_blank"
            href={`https://soporte-finanflix.vercel.app/dashboard/ticket/${notification._id}`}
            className="space-y-1"
          >
            <h2 className="italic text-sm flex gap-2 font-poppins">
              {notificationIcons[notification.type]}{' '}
              {notification.type === 'pendingTicket' ? (
                <span className="text-yellow-300">Tu ticket está en revisión</span>
              ) : (
                <span className="text-green-400">Tu ticket fue solucionado</span>
              )}
            </h2>
            <div className="text-[#A7A7A7] font-poppins text-xs">{notification.title}</div>
          </Link>
        );
      default:
        return (
          <div className="text-[#A7A7A7] font-poppins text-xs">Notificación no reconocida.</div>
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {totalUnreadNotifications > 0 ? (
          <div className="relative">
            <Bell className=":w-6 h-6 cursor-pointer hover:text-gray-500 text-white lg:flex" />
            <span className="lg:flex absolute rounded-full bg-primary w-2 h-2 top-0 left-4"></span>
          </div>
        ) : (
          <Bell className="w-6 h-6  cursor-pointer hover:text-gray-500 text-white lg:flex" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`w-[350px] relative left-[23px] top-[20px] ${
          totalUnreadNotifications > 0 ? 'overflow-y-scroll custom-scrollbar' : 'overflow-hidden'
        } rounded-lg pb-2`}
      >
        <DropdownMenuLabel className="w-full flex justify-between">
          <Bell className="text-[#A7A7A7] w-[18px]" />
          <span className="font-poppins">Notificaciones ({totalUnreadNotifications})</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mb-2" />

        {totalUnreadNotifications > 0 ? (
          <div>
            {notifications.map((notification, index) => (
              <div
                key={`${notification.type}-${index}`}
                className="dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg px-2 flex justify-between items-center"
              >
                <div className="hover:opacity-80 py-2 cursor-pointer">
                  {renderNotificationContent(notification)}
                </div>
                <DropdownMenuSeparator className="my-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-[330px] dark:hover:bg-gray-800 hover:bg-gray-100 px-2 ">
            <div className="bg-gray-200 rounded-full p-3 mb-4">
              <BellOff className="h-10 w-10 text-black " />
            </div>
            <p className="text-lg text-gray-400 font-poppins">No tienes notificaciones</p>
            <p className="text-center w-4/5 text-sm text-gray-500 font-poppins">
              Navega por nuestro increíble catálogo de cursos
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
