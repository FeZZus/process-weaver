import { X, Users } from "lucide-react";
import type { WorkflowActor } from "@/types/workflow";

interface PeoplePanelProps {
  open: boolean;
  onClose: () => void;
  actors: WorkflowActor[];
}

export function PeoplePanel({ open, onClose, actors }: PeoplePanelProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/10 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[340px] bg-card border-l border-border z-50 flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">People & Teams</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {actors.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No actors were detected for this process.
            </p>
          ) : (
            actors.map((actor) => (
              <div key={actor.name} className="bg-secondary/50 border border-border rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-1">
                  {actor.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {actor.role}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
