import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUpload: () => void;
}

export function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="max-w-lg text-center animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
          Turn messy process<br />descriptions into clarity.
        </h1>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Upload an audio file — and get a structured process flow diagram in seconds.
        </p>

        <Button onClick={onUpload} size="lg" className="gap-2 px-8">
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>
    </div>
  );
}
