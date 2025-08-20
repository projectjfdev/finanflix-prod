"use client";

import { Sun, Moon, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  // useEffect(() => {
  //   return setTheme("dark");
  // }, []);

  if (!mounted) return <Loader />;

  if (resolvedTheme === "dark") {
    return <Sun onClick={() => setTheme("light")} />;
  }

  if (resolvedTheme === "light") {
    return <Moon color="#BCBCBC" onClick={() => setTheme("dark")} />;
  }
}
