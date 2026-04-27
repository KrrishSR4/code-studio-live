import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="relative h-9 w-16 rounded-full glass-subtle border hover:border-primary/40 transition-colors overflow-hidden group"
    >
      {/* Track icons */}
      <span className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className={cn("h-3.5 w-3.5 transition-colors", !isDark ? "text-warning" : "text-muted-foreground/40")} />
        <Moon className={cn("h-3.5 w-3.5 transition-colors", isDark ? "text-primary" : "text-muted-foreground/40")} />
      </span>
      {/* Sliding thumb */}
      <span
        className={cn(
          "absolute top-1 h-7 w-7 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center transition-transform duration-300 ease-out",
          isDark ? "translate-x-8" : "translate-x-1"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
        ) : (
          <Sun className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
};
