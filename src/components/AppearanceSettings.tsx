"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "light",
      label: "Light",
      icon: Sun,
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
    },
    {
      id: "system",
      label: "System",
      icon: Laptop,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "relative flex flex-col items-center gap-3 p-4 border rounded-xl transition-all hover:bg-muted/50",
                isActive
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "bg-card hover:border-primary/50"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-full transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">{t.label}</span>

              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
        <p>
          Select your preferred theme. "System" will automatically switch between
          light and dark modes based on your operating system settings.
        </p>
      </div>
    </div>
  );
}
