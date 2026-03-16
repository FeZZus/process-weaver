import { X, Users } from "lucide-react";

interface PeoplePanelProps {
  open: boolean;
  onClose: () => void;
}

const actors = [
  {
    name: "Customer Service Team",
    description: "Receives and validates incoming customer requests, handles initial triage.",
  },
  {
    name: "Routing System",
    description: "Automatically determines assignment path based on request type and complexity.",
  },
  {
    name: "Specialist Team",
    description: "Handles complex or non-standard requests requiring domain expertise.",
  },
  {
    name: "Management",
    description: "Reviews processed requests and makes final approval or rejection decisions.",
  },
];

export function PeoplePanel({ open, onClose }: PeoplePanelProps) {
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
          {actors.map((actor) => (
            <div key={actor.name} className="bg-secondary/50 border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">{actor.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{actor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
