"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Theme Mode
      </p>

      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={() => setTheme("light")}
          className={`${
            theme === "light" ? "text-blue-600 font-semibold" : "opacity-70"
          } flex items-center gap-1`}
        >
          <Sun className="h-4 w-4" /> Light
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`${
            theme === "dark" ? "text-blue-600 font-semibold" : "opacity-70"
          } flex items-center gap-1`}
        >
          <Moon className="h-4 w-4" /> Dark
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`${
            theme === "system" ? "text-blue-600 font-semibold" : "opacity-70"
          } flex items-center gap-1`}
        >
          <Laptop className="h-4 w-4" /> System
        </button>
      </div>
    </div>
  );
}
