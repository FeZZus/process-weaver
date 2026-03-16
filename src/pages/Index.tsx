import { useState, useCallback } from "react";
import { Users } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { EmptyState } from "@/components/EmptyState";
import { InputState } from "@/components/InputState";
import { ProcessingState } from "@/components/ProcessingState";
import { ResultsState } from "@/components/ResultsState";
import { PeoplePanel } from "@/components/PeoplePanel";

type AppState = "empty" | "input-audio" | "input-transcript" | "processing" | "results";

const mockHistory = [
  { id: "1", title: "Customer Request Processing", timestamp: "2 hours ago" },
  { id: "2", title: "Employee Onboarding Flow", timestamp: "Yesterday" },
  { id: "3", title: "Invoice Approval Pipeline", timestamp: "3 days ago" },
];

const Index = () => {
  const [state, setState] = useState<AppState>("empty");
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [peopleOpen, setPeopleOpen] = useState(false);

  const handleNew = () => {
    setState("empty");
    setActiveHistoryId(null);
  };

  const handleSelectHistory = (id: string) => {
    setActiveHistoryId(id);
    setState("results");
  };

  const handleRecord = () => setState("input-audio");
  const handleUpload = () => setState("input-audio");
  const handlePaste = () => setState("input-transcript");
  const handleRemove = () => setState("empty");
  const handleProcess = () => setState("processing");
  const handleComplete = useCallback(() => {
    setState("results");
    setActiveHistoryId("1");
  }, []);

  const showPeopleIcon = state === "results";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        history={mockHistory}
        activeId={activeHistoryId}
        onSelect={handleSelectHistory}
        onNew={handleNew}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        {showPeopleIcon && (
          <div className="absolute top-3 right-4 z-30">
            <button
              onClick={() => setPeopleOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Users className="w-4 h-4" />
              People
            </button>
          </div>
        )}

        {state === "empty" && (
          <EmptyState onRecord={handleRecord} onUpload={handleUpload} onPaste={handlePaste} />
        )}
        {state === "input-audio" && (
          <InputState mode="audio" fileName="process_recording.mp3" onRemove={handleRemove} onProcess={handleProcess} />
        )}
        {state === "input-transcript" && (
          <InputState mode="transcript" onRemove={handleRemove} onProcess={handleProcess} />
        )}
        {state === "processing" && (
          <ProcessingState onComplete={handleComplete} />
        )}
        {state === "results" && <ResultsState />}
      </div>

      <PeoplePanel open={peopleOpen} onClose={() => setPeopleOpen(false)} />
    </div>
  );
};

export default Index;
