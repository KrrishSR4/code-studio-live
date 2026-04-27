import { useEffect } from "react";
import { TopBar } from "@/components/runner/TopBar";
import { RepoInputBar } from "@/components/runner/RepoInputBar";
import { StepsRail } from "@/components/runner/StepsRail";
import { LogsPanel } from "@/components/runner/LogsPanel";
import { PreviewPanel } from "@/components/runner/PreviewPanel";
import { StatusBar } from "@/components/runner/StatusBar";
import { HistoryPanel } from "@/components/runner/HistoryPanel";
import { useRunner } from "@/hooks/useRunner";

const Index = () => {
  const runner = useRunner();

  // SEO
  useEffect(() => {
    document.title = "CodeRunner Cloud — Run any GitHub repo in a sandbox";
    const meta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    meta("description", "Paste a GitHub repo URL and run it instantly inside an isolated Docker container with live logs and preview.");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <RepoInputBar
        onRun={runner.run}
        onStop={runner.stop}
        onRetry={runner.retry}
        status={runner.status}
        currentUrl={runner.repoUrl}
      />
      <StepsRail steps={runner.steps} />

      {/* Main workspace */}
      <main className="flex-1 container py-4">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-15rem)] min-h-[560px]">
          {/* Sidebar - History */}
          <aside className="hidden xl:block col-span-2">
            <HistoryPanel history={runner.history} onSelect={runner.run} />
          </aside>

          {/* Logs */}
          <section className="col-span-12 lg:col-span-6 xl:col-span-5 min-h-[400px] lg:min-h-0">
            <LogsPanel logs={runner.logs} status={runner.status} onClear={runner.clearLogs} />
          </section>

          {/* Preview */}
          <section className="col-span-12 lg:col-span-6 xl:col-span-5 min-h-[400px] lg:min-h-0">
            <PreviewPanel
              status={runner.status}
              projectType={runner.projectType}
              repoName={runner.repoName}
            />
          </section>
        </div>
      </main>

      <StatusBar
        status={runner.status}
        projectType={runner.projectType}
        repoName={runner.repoName}
        elapsedMs={runner.elapsedMs}
      />
    </div>
  );
};

export default Index;
