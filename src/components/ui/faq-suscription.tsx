"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string | React.ReactNode;
}


interface FaqAccordionProps {
  data: FAQItem[];
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export function FaqAccordion({
  data,
  className,
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn("px-3 md:px-0 md:w-[80%]", className)}>


      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
      >
        {data.map((item) => (
          <Accordion.Item
            value={item?.id.toString()}
            key={item.id}
            className="mb-2  "
          >
            <Accordion.Header  >
              <Accordion.Trigger className="flex w-full items-center justify-between gap-x-4 bg-background rounded-xl px-1">
                <div
                  className={cn(
                    "relative flex items-center space-x-2 rounded-xl p-2  bg-background ",
                    openItem === item.id.toString()
                      ? " text-[#a4a4a4] bg-background  "
                      : " hover:bg-primary/10 bg-background ",
                    questionClassName
                  )}
                >

                  <span className="text-sm sm:text-base font-medium">{item.question}</span>
                </div>

                <span
                  className={cn(
                    "text-muted-foreground ",
                    openItem === item.id.toString() && "text-primary"
                  )}
                >
                  {openItem === item.id.toString() ? (
                    <Minus className="w-4 h-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Plus className="w-4 h-4 sm:h-5 sm:w-5" />
                  )}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount className="w-full ">
              <motion.div
                initial="collapsed"
                animate={openItem === item.id.toString() ? "open" : "collapsed"}
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="mt-1">
                  <div
                    className={cn(
                      "text-xs sm:text-base relative rounded-2xl bg-primary px-4 py-2 text-primary-foreground",
                      answerClassName
                    )}
                  >
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
