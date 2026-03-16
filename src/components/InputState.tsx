import { FileAudio, FileText, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface InputStateProps {
  mode: "audio" | "transcript";
  fileName?: string;
  onRemove: () => void;
  onProcess: (text?: string) => void;
}

export function InputState({ mode, fileName, onRemove, onProcess }: InputStateProps) {
  const [transcript, setTranscript] = useState("");

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
                  <p className="text-sm font-medium text-foreground">{fileName || "recording.mp3"}</p>
                  <p className="text-xs text-muted-foreground">Audio file • ~3:24</p>
                </div>
              </div>
              <button onClick={onRemove} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
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
          onClick={() => onProcess(mode === "transcript" ? transcript : undefined)}
          className="w-full gap-2"
          disabled={mode === "transcript" && !transcript.trim()}
        >
          Analyze Process
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
