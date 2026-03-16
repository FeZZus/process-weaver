import { useState, useEffect } from "react";
import { Download, RefreshCw, Loader2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FlowDiagram } from "./FlowDiagram";
import { cn } from "@/lib/utils";
import type { Workflow } from "@/types/workflow";

const tabs = ["Diagram", "Transcript"] as const;
type Tab = (typeof tabs)[number];

interface ResultsStateProps {
  workflow: Workflow | null;
  transcript: string | null;
  onRegenerate?: (editedSummary: string) => Promise<void>;
}

export function ResultsState({ workflow, transcript, onRegenerate }: ResultsStateProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Diagram");
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [pendingReview, setPendingReview] = useState<Set<string>>(new Set());

  const togglePendingReview = (actorName: string) => {
    setPendingReview((prev) => {
      const next = new Set(prev);
      if (next.has(actorName)) next.delete(actorName);
      else next.add(actorName);
      return next;
    });
  };

  useEffect(() => {
    if (regenerateOpen && workflow) {
      setEditedSummary(workflow.summary);
    }
  }, [regenerateOpen, workflow]);

  const handleRegenerateSubmit = async () => {
    if (!onRegenerate || !editedSummary.trim()) return;
    setIsRegenerating(true);
    try {
      await onRegenerate(editedSummary.trim());
      setRegenerateOpen(false);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <p className="text-sm text-muted-foreground">
          No workflow available to display yet. Analyze a process to see results.
        </p>
      </div>
    );
  }

  const decisionCount = workflow.nodes.filter((n) => n.type === "decision").length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Tab bar + actions */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                activeTab === tab
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
            <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => setRegenerateOpen(true)}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "Diagram" && (
          <div>
            <FlowDiagram nodes={workflow.nodes} edges={workflow.edges} />

            {/* Process info: summary (left) + people (right) in 2 columns */}
            <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: title, summary, stats */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {workflow.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {workflow.summary}
                </p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Steps</span>
                    <p className="font-semibold text-foreground">
                      {workflow.nodes.length}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actors</span>
                    <p className="font-semibold text-foreground">
                      {workflow.actors.length}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Decision Points</span>
                    <p className="font-semibold text-foreground">
                      {decisionCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: People & Teams */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  People & Teams
                </h3>
                {workflow.actors.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No actors were detected for this process.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {workflow.actors.map((actor) => {
                      const isPending = pendingReview.has(actor.name);
                      return (
                        <div
                          key={actor.name}
                          role="button"
                          tabIndex={0}
                          onClick={() => togglePendingReview(actor.name)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              togglePendingReview(actor.name);
                            }
                          }}
                          className={cn(
                            "group relative border border-border rounded-lg p-3 pr-9 cursor-pointer transition-colors",
                            isPending
                              ? "bg-secondary border-border"
                              : "bg-secondary/50"
                          )}
                        >
                          <p className="text-sm font-medium text-foreground">
                            {actor.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {actor.role}
                          </p>
                          {isPending && (
                            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground italic">
                              waiting for review
                            </span>
                          )}
                          <Flag
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Transcript" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Original Transcript
            </h2>
            <div className="bg-card border border-border rounded-lg p-5 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {transcript || "No transcript available."}
            </div>
          </div>
        )}
      </div>

      {/* Regenerate dialog */}
      <Dialog open={regenerateOpen} onOpenChange={setRegenerateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Regenerate from summary</DialogTitle>
            <DialogDescription>
              Edit the summary below and submit to regenerate the process flow, actors, and diagram.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            placeholder="Process summary..."
            className="min-h-[160px] resize-none text-sm"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRegenerateOpen(false)}
              disabled={isRegenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegenerateSubmit}
              disabled={isRegenerating || !editedSummary.trim()}
              className="gap-2"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
