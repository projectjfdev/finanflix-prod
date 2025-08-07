/** @format */

"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
    target?: "_blank" | "_self"; // Propiedad opcional para target
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathName = usePathname();
  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2   "
      >
        <nav className="grid gap-1 pr-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2   ">
          {links.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    target={link.target}
                    href={link.href}
                    className={cn(
                      buttonVariants({
                        variant: link.href === pathName ? "default" : "ghost",
                        size: "icon",
                      }),
                      "h-9 w-9text-white",
                      link.variant === "ghost" &&
                      " hover:text-white dark:text-white p-0 m-0"
                    )}
                  >
                    <link.icon className="h-4 w-4 p-0 m-0" />
                    <span className="sr-only text-white">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4 text-white"
                >
                  {link.title}
                  {link.label && (
                    <span className="ml-auto ">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              // ICONOS DASHBOARD 
              <Link
              target={link.target}
                key={index}
                href={link.href}
                className={cn(
                  buttonVariants({
                    variant: link.href === pathName ? "default" : "ghost",
                    size: "sm",
                  }),
                  " hover:text-white  py-0 pl-3",
                  "justify-start py-0 pl-3  relative focus:text-white focus:bg-primary  "
                )}
              >


                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.variant === "default" &&
                      "text-background dark:text-white"
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            )
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}
