import { Activity, CheckCircle2, XCircle, Loader2, Clock, Cpu, GitBranch } from "lucide-react";
import type { ProjectType, RunStatus } from "@/types/runner";
import { projectTypeMeta } from "@/lib/runnerEngine";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  status: RunStatus;
  projectType: ProjectType | null;
  repoName: string | null;
  elapsedMs: number;
}

const statusMeta: Record<RunStatus, { label: string; color: string; icon: any }> = {
  idle: { label: "Idle", color: "text-muted-foreground", icon: Activity },
  cloning: { label: "Cloning", color: "text-info", icon: Loader2 },
  detecting: { label: "Detecting", color: "text-info", icon: Loader2 },
  installing: { label: "Installing", color: "text-warning", icon: Loader2 },
  running: { label: "Running", color: "text-primary", icon: Loader2 },
  success: { label: "Live", color: "text-success", icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-destructive", icon: XCircle },
};

export const StatusBar = ({ status, projectType, repoName, elapsedMs }: StatusBarProps) => {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  const isAnimated = ["cloning", "detecting", "installing", "running"].includes(status);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-t border-border/60 glass-subtle text-xs font-mono">
      <div className="flex items-center gap-4 flex-wrap">
        <div className={cn("flex items-center gap-2 font-semibold", meta.color)}>
          <span className="relative flex h-2 w-2">
            {status !== "idle" && status !== "failed" && (
              <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
                status === "success" ? "bg-success" : "bg-current")} />
            )}
            <span className={cn("relative inline-flex h-2 w-2 rounded-full",
              status === "idle" ? "bg-muted-foreground/40" : "bg-current")} />
          </span>
          <Icon className={cn("h-3.5 w-3.5", isAnimated && "animate-spin")} />
          <span className="uppercase tracking-wider">{meta.label}</span>
        </div>

        {repoName && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GitBranch className="h-3.5 w-3.5" />
            <span className="text-foreground">{repoName}</span>
          </div>
        )}

        {projectType && projectType !== "unsupported" && (
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={projectTypeMeta[projectType].color}>
              {projectTypeMeta[projectType].label}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">port {projectTypeMeta[projectType].port}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {elapsedMs > 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="tabular-nums">{(elapsedMs / 1000).toFixed(1)}s</span>
          </div>
        )}
        <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
          <span>region:</span>
          <span className="text-foreground">us-east-1</span>
        </div>
      </div>
    </div>
  );
};
