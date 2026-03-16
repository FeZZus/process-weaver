import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  "Transcribing audio",
  "Extracting process steps",
  "Identifying actors & teams",
  "Building flow diagram",
];

interface ProcessingStateProps {
  onComplete: () => void;
}

export function ProcessingState({ onComplete }: ProcessingStateProps) {
  const [completed, setCompleted] = useState<number>(0);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => {
        setCompleted(i + 1);
        if (i === steps.length - 1) {
          setTimeout(onComplete, 600);
        }
      }, (i + 1) * 1200)
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="w-full max-w-sm animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground mb-1 text-center">Analyzing process</h2>
        <p className="text-sm text-muted-foreground mb-8 text-center">This usually takes a few seconds</p>

        <div className="space-y-4">
          {steps.map((step, i) => {
            const isDone = i < completed;
            const isActive = i === completed;
            return (
              <div key={step} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center animate-fade-in">
                      <Check className="w-3.5 h-3.5 text-success-foreground" />
                    </div>
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin-slow" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                  )}
                </div>
                <span className={`text-sm ${isDone ? "text-foreground font-medium" : isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
