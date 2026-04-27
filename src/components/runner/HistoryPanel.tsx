import { History, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { RunHistoryItem } from "@/types/runner";
import { projectTypeMeta } from "@/lib/runnerEngine";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  history: RunHistoryItem[];
  onSelect: (url: string) => void;
}

export const HistoryPanel = ({ history, onSelect }: HistoryPanelProps) => {
  return (
    <div className="glass rounded-xl overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border/60 bg-background-elevated/60 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <History className="h-3.5 w-3.5" />
          <span>recent.runs</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{history.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <p className="text-xs text-muted-foreground">
              No runs yet. <br />
              <span className="text-muted-foreground/60">History will appear here.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((item) => (
              <HistoryRow key={item.id} item={item} onClick={() => onSelect(item.repoUrl)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryRow = ({ item, onClick }: { item: RunHistoryItem; onClick: () => void }) => {
  const Icon = item.status === "success" ? CheckCircle2 : item.status === "failed" ? XCircle : Loader2;
  const color = item.status === "success" ? "text-success" : item.status === "failed" ? "text-destructive" : "text-primary";
  const meta = projectTypeMeta[item.projectType];
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2.5 rounded-lg hover:bg-muted/60 border border-transparent hover:border-border transition-all group"
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", color)} />
        <span className="text-sm font-medium truncate flex-1">{item.repoName}</span>
        <span className="text-[10px] font-mono text-muted-foreground">
          {(item.durationMs / 1000).toFixed(1)}s
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10.5px] font-mono pl-5">
        <span className={meta.color}>{meta.label}</span>
        {item.port ? (
          <>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">:{item.port}</span>
          </>
        ) : null}
        <span className="text-muted-foreground/50 ml-auto">
          {new Date(item.startedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </button>
  );
};
