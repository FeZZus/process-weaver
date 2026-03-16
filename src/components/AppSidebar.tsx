import { Plus, Search, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

interface AppSidebarProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function AppSidebar({ history, activeId, onSelect, onNew }: AppSidebarProps) {
  return (
    <aside className="w-[260px] h-screen flex flex-col border-r border-border bg-card shrink-0">
      {/* Logo */}
      <div className="p-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <AudioLines className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground tracking-tight">FlowMind</span>
      </div>

      {/* New Analysis */}
      <div className="px-4 pb-3">
        <Button onClick={onNew} className="w-full justify-center gap-2" size="sm">
          <Plus className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search history..." className="pl-8 h-8 text-sm bg-muted/50 border-0" />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2">
        {history.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-8 px-4">
            Your analysis history will appear here
          </p>
        )}
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-md mb-0.5 transition-colors relative group",
              activeId === item.id
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            )}
          >
            {activeId === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
            )}
            <p className={cn(
              "text-sm truncate",
              activeId === item.id ? "font-medium text-foreground" : "text-foreground/80"
            )}>
              {item.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.timestamp}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
