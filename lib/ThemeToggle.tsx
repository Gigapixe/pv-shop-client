"use client";

import { useThemeStore } from "@/zustand/store";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex items-center p-2 rounded-full">
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 bg-gray-900 dark:bg-gray-700 rounded-full transition-colors focus:outline-none cursor-pointer"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
            theme === "dark" ? "-translate-x-5" : "translate-x-1"
          }`}
        />
        {theme === "dark" ? (
          <svg
            className="w-4 h-4 absolute top-1 left-1 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 absolute top-1 right-1 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
