import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

interface QuickFactsHoverProps {
  listItems: any[];
}

export function QuickFactsHover({ listItems }: QuickFactsHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className="text-secondary transition-colors duration-500  font-poppins"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-alert"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[330px] italic h-full">
        <div className=" flex gap-4 flex-col font-poppins">
          <h2 className="text-xl font-medium px-3">Datos de Ayuda</h2>
          <div>
            <ul className="flex flex-col gap-4 text-base">
              {listItems?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="font-medium mt-4 w-fit">
              <Link
                target="_blank"
                href={"/terminos-condiciones"}
                className="text-secondary"
              >
                {" "}
                Haz clic aquí
              </Link>{" "}
              para ver nuestros términos y condiciones completos{" "}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
