import { cn } from "@/lib/utils";

interface FlowNode {
  id: string;
  label: string;
  type: "start" | "step" | "decision" | "end";
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

const nodes: FlowNode[] = [
  { id: "1", label: "Customer submits request", type: "start" },
  { id: "2", label: "System validates input", type: "step" },
  { id: "3", label: "Auto-assignable?", type: "decision" },
  { id: "4", label: "Route to specialist", type: "step" },
  { id: "5", label: "Auto-assign to team", type: "step" },
  { id: "6", label: "Review & process", type: "step" },
  { id: "7", label: "Approved?", type: "decision" },
  { id: "8", label: "Fulfill request", type: "step" },
  { id: "9", label: "Return for revision", type: "step" },
  { id: "10", label: "Notify customer", type: "end" },
];

const nodePositions: Record<string, { x: number; y: number }> = {
  "1": { x: 300, y: 30 },
  "2": { x: 300, y: 110 },
  "3": { x: 300, y: 195 },
  "4": { x: 120, y: 290 },
  "5": { x: 480, y: 290 },
  "6": { x: 300, y: 375 },
  "7": { x: 300, y: 460 },
  "8": { x: 480, y: 550 },
  "9": { x: 120, y: 550 },
  "10": { x: 300, y: 640 },
};

const edges: FlowEdge[] = [
  { from: "1", to: "2" },
  { from: "2", to: "3" },
  { from: "3", to: "4", label: "No" },
  { from: "3", to: "5", label: "Yes" },
  { from: "4", to: "6" },
  { from: "5", to: "6" },
  { from: "6", to: "7" },
  { from: "7", to: "8", label: "Yes" },
  { from: "7", to: "9", label: "No" },
  { from: "8", to: "10" },
  { from: "9", to: "6" },
];

function NodeBox({ node, x, y }: { node: FlowNode; x: number; y: number }) {
  const w = 160;
  const h = node.type === "decision" ? 50 : 44;

  return (
    <g>
      {node.type === "decision" ? (
        <g transform={`translate(${x}, ${y})`}>
          <rect
            x={-w / 2}
            y={-h / 2}
            width={w}
            height={h}
            rx={8}
            className="fill-card stroke-border"
            strokeWidth={1.5}
            strokeDasharray="6 3"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground text-xs font-medium"
          >
            {node.label}
          </text>
        </g>
      ) : (
        <g transform={`translate(${x}, ${y})`}>
          <rect
            x={-w / 2}
            y={-h / 2}
            width={w}
            height={h}
            rx={8}
            className={cn(
              "stroke-border",
              node.type === "start"
                ? "fill-primary"
                : node.type === "end"
                ? "fill-accent"
                : "fill-card"
            )}
            strokeWidth={1.5}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className={cn(
              "text-xs font-medium",
              node.type === "start" || node.type === "end"
                ? "fill-primary-foreground"
                : "fill-foreground"
            )}
          >
            {node.label}
          </text>
        </g>
      )}
    </g>
  );
}

function EdgeLine({ from, to, label }: { from: { x: number; y: number }; to: { x: number; y: number }; label?: string }) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  // Orthogonal routing
  let path: string;
  if (from.x === to.x) {
    path = `M ${from.x} ${from.y + 22} L ${to.x} ${to.y - 22}`;
  } else {
    const midY = from.y + 50;
    path = `M ${from.x} ${from.y + 25} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y - 22}`;
  }

  return (
    <g>
      <path d={path} fill="none" className="stroke-border" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
      {label && (
        <text x={mx + (from.x !== to.x ? 0 : 10)} y={my - 4} textAnchor="middle" className="fill-muted-foreground text-[10px] font-medium">
          {label}
        </text>
      )}
    </g>
  );
}

export function FlowDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 640 700" className="w-full max-w-2xl mx-auto" style={{ minHeight: 500 }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-border" />
          </marker>
        </defs>

        {edges.map((edge, i) => (
          <EdgeLine
            key={i}
            from={nodePositions[edge.from]}
            to={nodePositions[edge.to]}
            label={edge.label}
          />
        ))}

        {nodes.map((node) => (
          <NodeBox key={node.id} node={node} x={nodePositions[node.id].x} y={nodePositions[node.id].y} />
        ))}
      </svg>
    </div>
  );
}
