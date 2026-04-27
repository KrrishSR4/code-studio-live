import { Cloud, Github, Activity, Sparkles } from "lucide-react";

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

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <a className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" href="#">Dashboard</a>
          <a className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" href="#">Templates</a>
          <a className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" href="#">Docs</a>
          <a className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" href="#">Pricing</a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-muted-foreground">All systems</span>
            <span className="text-success">operational</span>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg glass-subtle text-sm hover:border-border-bright transition-colors">
            <Activity className="h-4 w-4 text-primary" />
            <span>Status</span>
          </button>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow hover:opacity-95 transition-opacity">
            <Sparkles className="h-4 w-4" />
            Upgrade Pro
          </button>
        </div>
      </div>
    </header>
  );
};
