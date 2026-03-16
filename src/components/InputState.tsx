import { FileAudio, FileText, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, ChangeEvent } from "react";

interface InputStateProps {
  mode: "audio" | "transcript";
  onRemove: () => void;
  onProcess: (options?: { transcript?: string; file?: File }) => void;
}

export function InputState({ mode, onRemove, onProcess }: InputStateProps) {
  const [transcript, setTranscript] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Auto-load default test audio from public/test.mp3 on first render in audio mode
  useEffect(() => {
    if (mode !== "audio" || file) return;

    let cancelled = false;

    const loadDefaultAudio = async () => {
      try {
        const res = await fetch("/test.mp3");
        if (!res.ok) return;
        const blob = await res.blob();
        if (cancelled) return;
        const testFile = new File([blob], "test.mp3", { type: blob.type || "audio/mpeg" });
        setFile(testFile);
      } catch {
        // swallow; user can still upload their own file
      }
    };

    loadDefaultAudio();

    return () => {
      cancelled = true;
    };
  }, [mode, file]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected || null);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="w-full max-w-lg animate-fade-in">
        {mode === "audio" ? (
          <div className="bg-card border border-border rounded-lg p-5 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <FileAudio className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {file ? file.name : "No audio file selected"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file ? "Ready to analyze" : "Choose a recorded or uploaded audio file"}
                  </p>
                </div>
              </div>
              <button onClick={onRemove} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Transcript</span>
              </div>
              <button onClick={onRemove} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your process description here... e.g. 'First, the customer submits a request through the portal. Then the manager reviews it and either approves or sends it back...'"
              className="min-h-[180px] bg-card resize-none text-sm"
            />
          </div>
        )}

        <Button
          onClick={() =>
            onProcess(
              mode === "transcript"
                ? { transcript }
                : file
                ? { file }
                : undefined
            )
          }
          className="w-full gap-2"
          disabled={(mode === "transcript" && !transcript.trim()) || (mode === "audio" && !file)}
        >
          Analyze Process
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
