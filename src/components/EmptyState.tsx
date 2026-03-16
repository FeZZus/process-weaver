import { Mic, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRecord: () => void;
  onUpload: () => void;
  onPaste: () => void;
}

export function EmptyState({ onRecord, onUpload, onPaste }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="max-w-lg text-center animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
          Turn messy process<br />descriptions into clarity.
        </h1>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Record audio, upload a file, or paste a transcript — and get a structured process flow diagram in seconds.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Button onClick={onRecord} size="lg" className="gap-2 px-8">
            <Mic className="w-4 h-4" />
            Record Audio
          </Button>
          <Button onClick={onUpload} variant="outline" size="lg" className="gap-2 px-8">
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
          <button
            onClick={onPaste}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mt-1"
          >
            Paste Transcript
          </button>
        </div>
      </div>
    </div>
  );
}
