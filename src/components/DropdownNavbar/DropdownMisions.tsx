import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellOff, Check, Coins, CoinsIcon, Gem, MedalIcon, Star, TrophyIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export function DropdownMisions() {
  const { data: session } = useSession();

  const totalMisions = 3;
  //   const totalUnreadNotifications =
  //   (dataMessage?.proposalsOfBuyer?.length || 0) +
  //   (dataServiceValuation?.valuationsNotRead?.length || 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {totalMisions > 0 ? (
          <div className="relative">
            <Gem className="lg:flex h-4 w-4 lg:w-6 lg:h-6 cursor-pointer hover:text-[#E7E3E3] text-[#BCBCBC]" />
            <span className="absolute rounded-full bg-primary w-2 h-2 top-0 left-4"></span>
          </div>
        ) : (
          <Gem className="lg:flex h-4 w-4 lg:w-6 lg:h-6 cursor-pointer hover:text-[#E7E3E3] text-[#BCBCBC]" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[350px] relative pb-0 left-[23px] top-[20px]  overflow-y-scroll custom-scrollbar rounded-lg ">
        <DropdownMenuLabel className="w-full flex justify-between">
          <TrophyIcon className="text-[#A7A7A7] w-[19px]" />
          <span className="font-poppins">Misiones ({totalMisions})</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {totalMisions > 0 ? (
          <div className=" ">
            <div className="flex justify-between items-center  rounded-lg dark:hover:bg-gray-800 hover:bg-gray-100 ">
              <div className="py-2 cursor-pointer">
                <h2 className="dark:text-[#A7A7A7] text-black text-sm flex gap-2 font-poppins italic ml-2 ">
                  <CoinsIcon fill="yellow" color="yellow" size={18} /> Comprar un
                  curso
                </h2>
                <p className="text-gray-400 relative top-1 ml-2 ">50 XP</p>
              </div>
              <Check color="green" size={18} className="mr-2" />
            </div>
            <DropdownMenuSeparator />
            <div className="flex justify-between items-center py-2 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg ">
              <div className="dark:hover:opacity-80 cursor-pointer">
                <h2 className="dark:text-[#A7A7A7] text-black text-sm flex gap-2 font-poppins italic ml-2 ">
                  <CoinsIcon fill="yellow" color="yellow" size={18} /> Consigue el
                  top 3 semanal
                </h2>
                <p className="text-[#A7A7A7] relative top-1 ml-2 ">300 XP</p>
              </div>
              <Check color="gray" size={18} className="mr-2" />
            </div>
            <DropdownMenuSeparator />
            <div className="flex justify-between py-2 items-center dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg">
              <div className="hover:opacity-80 cursor-pointer ">
                <h2 className="dark:text-[#A7A7A7] text-black text-sm flex gap-2 font-poppins italic ml-2 ">
                  <CoinsIcon fill="yellow" color="yellow" size={18} /> Completa el
                  curso Starzero
                </h2>
                <p className="text-[#A7A7A7] font-poppins relative top-1 ml-2 ">150 XP</p>
              </div>
              <Check color="gray" size={18} className="mr-2 " />
            </div>
            <DropdownMenuSeparator />
          </div>
        ) : (
          <div>
            <div className="flex flex-col justify-center items-center h-[330px] ">
              <div className="bg-gray-200 rounded-full p-3 mb-4">
                <BellOff className="h-10 w-10 text-black" />
              </div>
              <p className="text-lg text-[#A7A7A7] font-poppins">No tienes notificaciones</p>
              <p className="text-center w-4/5 text-sm text-[#A7A7A7] font-poppins">
                Navega por nuestro increíble catálogo de cursos
              </p>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
