import { useState } from "react";
import { Download, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowDiagram } from "./FlowDiagram";
import { cn } from "@/lib/utils";

const tabs = ["Diagram", "Summary", "Transcript"] as const;
type Tab = typeof tabs[number];

export function ResultsState() {
  const [activeTab, setActiveTab] = useState<Tab>("Diagram");

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Tab bar + actions */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                activeTab === tab
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "Diagram" && (
          <div>
            {/* Ambiguity notice */}
            <div className="flex items-start gap-2.5 bg-secondary/50 border border-border rounded-lg p-3 mb-6 text-sm">
              <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">2 ambiguous steps detected.</span>{" "}
                Some decision points may need manual review for accuracy.
              </p>
            </div>

            <FlowDiagram />

            {/* Process info */}
            <div className="mt-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground mb-2">Customer Request Processing</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                This workflow describes how incoming customer requests are received, validated, assigned to the appropriate team, reviewed for approval, and either fulfilled or returned for revision before the customer is notified of the outcome.
              </p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Steps</span>
                  <p className="font-semibold text-foreground">10</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Actors</span>
                  <p className="font-semibold text-foreground">4</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Decision Points</span>
                  <p className="font-semibold text-foreground">2</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Summary" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-4">Process Summary</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                The customer request processing workflow begins when a customer submits a request through the online portal. The system automatically validates the input data for completeness and correctness.
              </p>
              <p>
                Based on the request type, the system determines whether it can be auto-assigned to a general team or needs routing to a specialist. Both paths converge at a review stage where the assigned team processes the request.
              </p>
              <p>
                An approval decision gate determines the final outcome: approved requests are fulfilled and the customer is notified, while rejected requests are returned for revision, creating a feedback loop until resolution.
              </p>
            </div>
          </div>
        )}

        {activeTab === "Transcript" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-4">Original Transcript</h2>
            <div className="bg-card border border-border rounded-lg p-5 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {"So basically, when a customer submits a request, the system first checks if everything is filled out correctly. Then it figures out if it can just assign it automatically or if it needs a specialist to look at it.\n\nOnce someone picks it up, they review it and decide whether to approve it. If it's good, they fulfill the request and notify the customer. If not, they send it back and the team has to take another look.\n\nThe main teams involved are the customer service team, the routing system, the specialists, and management for approvals."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
