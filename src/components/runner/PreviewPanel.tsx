import { useEffect, useState } from "react";
import { Globe, RefreshCw, ExternalLink, Loader2, Lock, Server } from "lucide-react";
import type { RunStatus, ProjectType } from "@/types/runner";
import { projectTypeMeta } from "@/lib/runnerEngine";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  status: RunStatus;
  projectType: ProjectType | null;
  repoName: string | null;
}

export const PreviewPanel = ({ status, projectType, repoName }: PreviewPanelProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const port = projectType ? projectTypeMeta[projectType].port : null;
  const previewUrl = repoName && port ? `https://${repoName}-${port}.sandbox.coderunner.cloud` : "";

  const isLive = status === "success";
  const isBuilding = status === "cloning" || status === "detecting" || status === "installing" || status === "running";

  return (
    <div className="flex flex-col h-full glass rounded-xl overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 h-11 border-b border-border/60 bg-background-elevated/60 flex-shrink-0">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-warning/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
        </div>

        <button
          onClick={() => setRefreshKey(k => k + 1)}
          disabled={!isLive}
          className="ml-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
          title="Reload"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isBuilding && "animate-spin")} />
        </button>

        <div className="flex-1 flex items-center gap-2 h-7 px-3 rounded-md bg-background border border-border/60 text-xs font-mono">
          <Lock className={cn("h-3 w-3", isLive ? "text-success" : "text-muted-foreground")} />
          <span className={cn("truncate", isLive ? "text-foreground" : "text-muted-foreground/60")}>
            {previewUrl || "—"}
          </span>
          {port && (
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-bold">
              :{port}
            </span>
          )}
        </div>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className={cn(
            "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            !isLive && "opacity-30 pointer-events-none"
          )}
          title="Open in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Preview body */}
      <div className="flex-1 relative bg-[hsl(var(--terminal-bg))] overflow-hidden">
        {status === "idle" && <IdleState />}
        {isBuilding && <BuildingState status={status} />}
        {status === "failed" && <FailedState />}
        {isLive && projectType && repoName && (
          <LivePreview key={refreshKey} projectType={projectType} repoName={repoName} port={port!} />
        )}
      </div>
    </div>
  );
};

const IdleState = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="absolute inset-0 grid-bg opacity-40" />
    <div className="relative text-center max-w-sm p-8">
      <div className="relative mx-auto w-20 h-20 mb-5">
        <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-50 animate-glow-pulse" />
        <div className="relative w-full h-full rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Globe className="h-9 w-9 text-primary-foreground" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg font-bold mb-1">Live Preview</h3>
      <p className="text-sm text-muted-foreground">
        Your running application will appear here once the container is up.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] font-mono">
        {[":3000", ":5000", ":8000"].map((p) => (
          <div key={p} className="px-2 py-1.5 rounded-md glass-subtle text-muted-foreground">
            {p}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BuildingState = ({ status }: { status: RunStatus }) => {
  const messages: Partial<Record<RunStatus, string>> = {
    cloning: "Cloning repository from GitHub...",
    detecting: "Analyzing project structure...",
    installing: "Installing dependencies in sandbox...",
    running: "Spinning up your application...",
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial" />
      <div className="relative text-center">
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-secondary/20" />
          <div className="absolute inset-2 rounded-full border-b-2 border-secondary animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Server className="h-8 w-8 text-primary" />
          </div>
        </div>
        <p className="text-sm font-semibold mb-1 animate-fade-in" key={status}>
          {messages[status] || "Working..."}
        </p>
        <p className="text-xs font-mono text-muted-foreground">
          This may take a few moments
        </p>
        <div className="mt-6 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-8 rounded-full bg-primary/30 overflow-hidden relative"
            >
              <span
                className="absolute inset-0 bg-primary animate-shimmer"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const FailedState = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center max-w-sm p-8">
      <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
        <span className="text-3xl">⚠</span>
      </div>
      <h3 className="text-lg font-bold mb-1 text-destructive">Execution Failed</h3>
      <p className="text-sm text-muted-foreground">
        The container exited unexpectedly. Check the logs panel for details.
      </p>
    </div>
  </div>
);

const LivePreview = ({ projectType, repoName, port }: { projectType: ProjectType; repoName: string; port: number }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <div className="absolute inset-0 animate-fade-in">
        <MockPreview projectType={projectType} repoName={repoName} port={port} />
      </div>
    </>
  );
};

const MockPreview = ({ projectType, repoName, port }: { projectType: ProjectType; repoName: string; port: number }) => {
  if (projectType === "node") {
    return (
      <div className="h-full w-full overflow-auto bg-white text-slate-900">
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 p-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-xs font-mono text-slate-500 mb-2">localhost:{port}</div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Welcome to <span className="text-blue-600">{repoName}</span>
            </h1>
            <p className="text-slate-600 mb-8">A Vite + React application running inside a sandboxed container.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: "Framework", v: "React 18" }, { l: "Bundler", v: "Vite 5" },
                { l: "Status", v: "● Running" }, { l: "Uptime", v: "00:00:12" },
              ].map(c => (
                <div key={c.l} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="text-xs uppercase tracking-wider text-slate-500">{c.l}</div>
                  <div className="text-lg font-semibold mt-1">{c.v}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
              Get started →
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (projectType === "python") {
    return (
      <div className="h-full w-full overflow-auto bg-white text-slate-900 font-serif">
        <div className="min-h-full p-10 bg-gradient-to-b from-emerald-50 to-white">
          <div className="max-w-2xl mx-auto">
            <div className="text-xs font-mono text-slate-500 mb-2">localhost:{port}</div>
            <h1 className="text-3xl font-bold mb-3">Flask App: {repoName}</h1>
            <p className="text-slate-600">Hello, World! This is your Python application running in a Docker container.</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="p-3 rounded bg-emerald-50 border border-emerald-200">✓ Server: gunicorn 21.2.0</li>
              <li className="p-3 rounded bg-emerald-50 border border-emerald-200">✓ Workers: 4</li>
              <li className="p-3 rounded bg-emerald-50 border border-emerald-200">✓ Bound: 0.0.0.0:{port}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full w-full overflow-auto bg-slate-950 text-slate-100 font-mono text-sm p-10">
      <div className="max-w-2xl">
        <div className="text-xs text-slate-500 mb-2">localhost:{port}</div>
        <pre className="text-emerald-400">
{`{
  "service": "${repoName}",
  "status": "healthy",
  "port": ${port},
  "uptime_s": 14,
  "version": "1.0.0"
}`}
        </pre>
      </div>
    </div>
  );
};
