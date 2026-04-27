import { Check, Circle, Loader2, X } from "lucide-react";
import type { RunStep } from "@/types/runner";
import { cn } from "@/lib/utils";

interface StepsRailProps {
  steps: RunStep[];
}

export const StepsRail = ({ steps }: StepsRailProps) => {
  if (steps.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-border/60 bg-background-elevated/30">
      <div className="flex items-center gap-1 overflow-x-auto">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
            <StepBadge step={step} />
            {i < steps.length - 1 && (
              <div className={cn(
                "h-px w-6 sm:w-8 transition-colors duration-500",
                step.status === "done" ? "bg-success/60" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StepBadge = ({ step }: { step: RunStep }) => {
  const Icon = step.status === "done" ? Check
    : step.status === "active" ? Loader2
    : step.status === "failed" ? X
    : Circle;

  return (
    <div className={cn(
      "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
      step.status === "pending" && "text-muted-foreground/60",
      step.status === "active" && "text-primary bg-primary/10 border border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
      step.status === "done" && "text-success bg-success/10 border border-success/20",
      step.status === "failed" && "text-destructive bg-destructive/10 border border-destructive/30",
    )}>
      <Icon className={cn(
        "h-3.5 w-3.5 flex-shrink-0",
        step.status === "active" && "animate-spin",
        step.status === "pending" && "fill-current opacity-30"
      )} strokeWidth={step.status === "pending" ? 2 : 3} />
      <span className="whitespace-nowrap">{step.label}</span>
    </div>
  );
};
