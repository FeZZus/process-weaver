import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { EmptyState } from "@/components/EmptyState";
import { InputState } from "@/components/InputState";
import { ProcessingState } from "@/components/ProcessingState";
import { ResultsState } from "@/components/ResultsState";
import type { Workflow } from "@/types/workflow";
import { transcribeAudio, processTranscript } from "@/lib/api";

type AppState = "empty" | "input-audio" | "input-transcript" | "processing" | "results";

const mockHistory = [
  { id: "1", title: "Customer Request Processing", timestamp: "2 hours ago" },
  { id: "2", title: "Employee Onboarding Flow", timestamp: "Yesterday" },
  { id: "3", title: "Invoice Approval Pipeline", timestamp: "3 days ago" },
];

const Index = () => {
  const [state, setState] = useState<AppState>("empty");
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNew = () => {
    setState("empty");
    setActiveHistoryId(null);
    setWorkflow(null);
    setTranscript(null);
    setError(null);
  };

  const handleSelectHistory = (id: string) => {
    setActiveHistoryId(id);
    setState("results");
  };

  const handleUpload = () => setState("input-audio");
  const handleRemove = () => setState("empty");

  const handleProcess = async (options?: { transcript?: string; file?: File }) => {
    try {
      setError(null);
      setState("processing");

      let finalTranscript = options?.transcript ?? null;

      if (options?.file) {
        const result = await transcribeAudio(options.file);
        finalTranscript = result.transcript;
        setTranscript(result.transcript);
      } else if (options?.transcript) {
        setTranscript(options.transcript);
      }

      if (!finalTranscript) {
        throw new Error("No transcript available to process.");
      }

      const workflowResult = await processTranscript(finalTranscript);
      setWorkflow(workflowResult);
      setState("results");
      setActiveHistoryId(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Something went wrong while analyzing the process. Please try again.");
      setState("empty");
    }
  };

  const handleRegenerate = async (editedSummary: string) => {
    try {
      setError(null);
      setState("processing");
      const workflowResult = await processTranscript(editedSummary);
      setWorkflow(workflowResult);
      setTranscript(editedSummary);
      setState("results");
      setActiveHistoryId(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Something went wrong while regenerating. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        history={mockHistory}
        activeId={activeHistoryId}
        onSelect={handleSelectHistory}
        onNew={handleNew}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {state === "empty" && (
          <EmptyState onUpload={handleUpload} />
        )}
        {state === "input-audio" && (
          <InputState mode="audio" onRemove={handleRemove} onProcess={handleProcess} />
        )}
        {state === "input-transcript" && (
          <InputState mode="transcript" onRemove={handleRemove} onProcess={handleProcess} />
        )}
        {state === "processing" && (
          <ProcessingState onComplete={() => {}} />
        )}
        {state === "results" && (
          <ResultsState
            workflow={workflow}
            transcript={transcript}
            onRegenerate={handleRegenerate}
          />
        )}

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground text-xs px-3 py-2 rounded-md shadow-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
