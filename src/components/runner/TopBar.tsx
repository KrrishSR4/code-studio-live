import { Cloud, Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const TopBar = () => {
  return (
    <header className="relative z-20 border-b border-border/60 glass-subtle">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-60" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Cloud className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">
              CodeRunner <span className="text-gradient">Cloud</span>
            </h1>
            <p className="text-[11px] font-mono text-muted-foreground tracking-wider mt-0.5">
              EXECUTE · ANY REPO · ANYWHERE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-muted-foreground">All systems</span>
            <span className="text-success font-semibold">operational</span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg glass-subtle text-sm hover:border-primary/40 hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
