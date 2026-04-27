import { useState, type FormEvent } from "react";
import { Github, Play, Loader2, Square, RotateCw, AlertCircle } from "lucide-react";
import { isValidGithubUrl } from "@/lib/runnerEngine";
import type { RunStatus } from "@/types/runner";
import { cn } from "@/lib/utils";

interface RepoInputBarProps {
  onRun: (url: string) => void;
  onStop: () => void;
  onRetry: () => void;
  status: RunStatus;
  currentUrl: string;
}

const examples = [
  "https://github.com/vercel/next.js",
  "https://github.com/pallets/flask",
  "https://github.com/expressjs/express",
];

export const RepoInputBar = ({ onRun, onStop, onRetry, status, currentUrl }: RepoInputBarProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isRunning = status !== "idle" && status !== "success" && status !== "failed";
  const isDone = status === "success" || status === "failed";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return setError("Please enter a GitHub repository URL");
    if (!isValidGithubUrl(url)) return setError("Invalid GitHub URL. Format: https://github.com/owner/repo");
    setError(null);
    onRun(url.trim());
  };

  return (
    <div className="border-b border-border/60 bg-background-elevated/40 backdrop-blur-xl">
      <div className="container py-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className={cn(
              "absolute inset-0 rounded-xl bg-gradient-primary opacity-0 blur-md transition-opacity duration-500",
              "group-focus-within:opacity-40"
            )} />
            <div className="relative flex items-center h-12 rounded-xl glass-subtle group-focus-within:border-primary/60 transition-colors">
              <div className="flex items-center justify-center w-12 h-full text-muted-foreground group-focus-within:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                placeholder="https://github.com/owner/repository"
                disabled={isRunning}
                className="flex-1 h-full bg-transparent border-0 outline-none text-sm font-mono placeholder:text-muted-foreground/60 disabled:opacity-50"
                aria-label="GitHub repository URL"
              />
              {url && !isRunning && (
                <button
                  type="button"
                  onClick={() => { setUrl(""); setError(null); }}
                  className="px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  clear
                </button>
              )}
            </div>
            {error && (
              <div className="absolute left-0 top-full mt-1.5 flex items-center gap-1.5 text-xs text-destructive animate-fade-in-fast">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isRunning && !isDone && (
              <button
                type="submit"
                className="group relative h-12 px-6 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:shadow-glow-violet transition-all duration-300 flex items-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Play className="h-4 w-4 fill-current relative" />
                <span className="relative">Run Project</span>
              </button>
            )}
            {isRunning && (
              <>
                <button
                  type="button"
                  disabled
                  className="h-12 px-6 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm flex items-center gap-2 opacity-90"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running...
                </button>
                <button
                  type="button"
                  onClick={onStop}
                  className="h-12 px-4 rounded-xl glass-subtle hover:border-destructive/60 hover:text-destructive transition-colors flex items-center gap-2 text-sm"
                >
                  <Square className="h-4 w-4 fill-current" />
                  Stop
                </button>
              </>
            )}
            {isDone && (
              <>
                <button
                  type="button"
                  onClick={onRetry}
                  className="h-12 px-5 rounded-xl glass-subtle hover:border-primary/60 hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold"
                >
                  <RotateCw className="h-4 w-4" />
                  Retry
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow flex items-center gap-2"
                >
                  <Play className="h-4 w-4 fill-current" />
                  New Run
                </button>
              </>
            )}
          </div>
        </form>

        {!currentUrl && !isRunning && (
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-muted-foreground font-mono">try:</span>
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setUrl(ex)}
                className="px-2.5 py-1 rounded-md font-mono text-[11px] glass-subtle hover:border-primary/40 hover:text-primary transition-colors"
              >
                {ex.replace("https://github.com/", "")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
