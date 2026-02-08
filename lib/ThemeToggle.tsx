"use client";

import DesktopIcon from "@/public/icons/DesktopIcon";
import MoonIcon from "@/public/icons/MoonIcon";
import SunIcon from "@/public/icons/SunIcon";
import { useThemeStore } from "@/zustand/store";
import { useEffect, useMemo } from "react";

type ThemeMode = "light" | "dark" | "system";




export default function ThemeToggle() {
  const store = useThemeStore() as any;

  // supports both: store.setTheme OR only store.toggleTheme
  const theme: ThemeMode = (store.theme ?? "system") as ThemeMode;

  const setTheme = (mode: ThemeMode) => {
    if (typeof store.setTheme === "function") {
      store.setTheme(mode);
      return;
    }
    // fallback: if you only have toggleTheme, just toggle between light/dark
    if (typeof store.toggleTheme === "function") store.toggleTheme();
  };

  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (theme === "system") {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  // slider position (0, 1, 2)
  const activeIndex = theme === "system" ? 0 : theme === "dark" ? 1 : 2;

  return (
    <div
      className="
        inline-flex items-center
        rounded-full
        bg-[#F2F2F2] dark:bg-white/10
        p-1
        border border-black/5 dark:border-white/10
        shadow-sm
      "
      role="tablist"
      aria-label="Theme toggle"
    >
      {/* Sliding active pill */}
      <div
        className={[
          "pointer-events-none absolute",
          "h-9 w-12 rounded-full bg-[#DADADA] dark:bg-white/20",
          "transition-transform duration-200 ease-out",
        ].join(" ")}
        style={{
          position: "absolute",
          transform: `translateX(${activeIndex * 48}px)`,
          // container padding and sizing alignment:
          // w-12 (48px)
        }}
      />

      {/* We need relative wrapper so the slider sits behind buttons */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setTheme("system")}
          className="h-9 w-12 grid place-items-center rounded-full relative z-10"
          aria-label="System theme"
          aria-selected={theme === "system"}
          role="tab"
        >
         <DesktopIcon fill="none" className="w-5 h-5 text-black dark:text-background"/>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className="h-9 w-12 grid place-items-center rounded-full relative z-10"
          aria-label="Dark mode"
          aria-selected={theme === "dark"}
          role="tab"
        >
          <MoonIcon fill="none" className="w-5 h-5 text-black dark:text-background"/>
        </button>

        <button
          type="button"
          onClick={() => setTheme("light")}
          className="h-9 w-12 grid place-items-center rounded-full relative z-10"
          aria-label="Light mode"
          aria-selected={theme === "light"}
          role="tab"
        >
          <SunIcon className="w-5 h-5 text-black dark:text-background"/>
        </button>
      </div>
    </div>
  );
}
