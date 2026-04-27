import { useEffect, useRef } from "react";
import { Copy, Download, Trash2, Terminal, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { LogEntry, RunStatus } from "@/types/runner";
import { cn } from "@/lib/utils";

interface LogsPanelProps {
  logs: LogEntry[];
  status: RunStatus;
  onClear: () => void;
}

const levelStyles: Record<LogEntry["level"], string> = {
  info: "text-foreground/85",
  success: "text-success",
  warn: "text-warning",
  error: "text-destructive",
  command: "text-primary font-semibold",
  system: "text-accent",
};

const levelPrefix: Record<LogEntry["level"], string> = {
  info: " ",
  success: "✓",
  warn: "!",
  error: "✗",
  command: "›",
  system: "▶",
};

export const LogsPanel = ({ logs, status, onClear }: LogsPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const isStreaming = status === "cloning" || status === "detecting" || status === "installing" || status === "running";

  const copyLogs = async () => {
    const text = logs.map(l => `[${new Date(l.ts).toISOString()}] ${l.text}`).join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Logs copied to clipboard");
  };

  const downloadLogs = () => {
    const text = logs.map(l => `[${new Date(l.ts).toISOString()}] ${l.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coderunner-logs-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs downloaded");
  };

  return (
    <div className="flex flex-col h-full glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11 border-b border-border/60 bg-background-elevated/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
          </div>
          <div className="flex items-center gap-2 ml-3 text-xs font-mono text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            <span>execution.log</span>
            {isStreaming && (
              <span className="flex items-center gap-1 text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>streaming</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton onClick={copyLogs} title="Copy logs" disabled={logs.length === 0}>
            <Copy className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton onClick={downloadLogs} title="Download logs" disabled={logs.length === 0}>
            <Download className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton onClick={onClear} title="Clear" disabled={logs.length === 0}>
            <Trash2 className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>

      {/* Logs body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-[12.5px] leading-relaxed bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-fg))] relative"
      >
        {logs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="px-4 py-3">
            {logs.map((log, i) => (
              <LogLine key={log.id} log={log} index={i} />
            ))}
            {isStreaming && (
              <div className="flex items-center gap-2 text-primary mt-1">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="terminal-cursor" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 h-7 border-t border-border/60 bg-background-elevated/60 flex items-center justify-between text-[10.5px] font-mono text-muted-foreground flex-shrink-0">
        <span>{logs.length} lines</span>
        <span className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>BASH</span>
          <span className="text-success">● ws://server/logs</span>
        </span>
      </div>
    </div>
  );
};

const LogLine = ({ log, index }: { log: LogEntry; index: number }) => {
  const time = new Date(log.ts).toLocaleTimeString("en-GB", { hour12: false });
  const isError = log.level === "error";
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-2 py-0.5 -mx-2 rounded animate-slide-in-left hover:bg-white/[0.02] transition-colors",
        isError && "bg-destructive/5 border-l-2 border-destructive/60 pl-1.5"
      )}
      style={{ animationDelay: `${Math.min(index * 8, 200)}ms` }}
    >
      <span className="text-muted-foreground/50 select-none flex-shrink-0 text-[11px] tabular-nums mt-0.5">
        {time}
      </span>
      <span className={cn("flex-shrink-0 select-none w-3 text-center font-bold", levelStyles[log.level])}>
        {levelPrefix[log.level]}
      </span>
      <span className={cn("whitespace-pre-wrap break-all flex-1", levelStyles[log.level])}>
        {log.text}
      </span>
    </div>
  );
};

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-3">
    <div className="relative">
      <div className="absolute inset-0 bg-primary/30 blur-2xl" />
      <Terminal className="relative h-12 w-12 text-primary" strokeWidth={1.2} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Awaiting execution</p>
      <p className="text-[11px] font-mono text-muted-foreground/60 mt-1">
        Enter a repo URL and hit <span className="text-primary">Run Project</span> to stream logs
      </p>
    </div>
  </div>
);

const IconButton = ({ children, onClick, title, disabled }: { children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
  >
    {children}
  </button>
);
