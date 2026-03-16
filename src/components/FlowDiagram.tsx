import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge as ReactFlowEdge,
  type Node as ReactFlowNode,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import type { WorkflowNode, WorkflowEdge } from "@/types/workflow";
import dagre from "dagre";

interface FlowDiagramProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 70;

function getLayoutedPositions(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 80 });

  // clear any existing nodes/edges to avoid duplicating between renders
  dagreGraph.nodes().forEach((n) => dagreGraph.removeNode(n));

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const withPos = dagreGraph.node(node.id);
    return {
      id: node.id,
      position: {
        x: withPos.x - nodeWidth / 2,
        y: withPos.y - nodeHeight / 2,
      },
    };
  });
}

export function FlowDiagram({ nodes, edges }: FlowDiagramProps) {
  const positioned = useMemo(
    () => getLayoutedPositions(nodes, edges),
    [nodes, edges]
  );

  const rfNodes: ReactFlowNode[] = useMemo(
    () =>
      nodes.map((node) => {
        const pos = positioned.find((p) => p.id === node.id);
        const isStartOrEnd = node.type === "start" || node.type === "end";

        return {
          id: node.id,
          data: { label: node.label },
          position: pos ? pos.position : { x: 0, y: 0 },
          style: {
            background: isStartOrEnd ? "#B0B0B0" : "#EEEEEE",
            color: "#222222",
            padding: 8,
            borderRadius: 8,
            fontSize: 12,
            border: isStartOrEnd ? "1px solid #888888" : "1px solid #DDDDDD",
            minWidth: 140,
            textAlign: "center",
          },
        };
      }),
    [nodes, positioned]
  );

  const rfEdges: ReactFlowEdge[] = useMemo(
    () =>
      edges.map((edge, index) => ({
        id: `${edge.source}-${edge.target}-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: false,
        style: { stroke: "#AAAAAA", strokeWidth: 1.5 },
        labelStyle: { fill: "#666666", fontSize: 11 },
        labelBgStyle: { fill: "#F9F9F7", stroke: "#DDDDDD" },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: "#AAAAAA",
        },
      })),
    [edges]
  );

  return (
    <div
      className="w-full h-[460px] rounded-lg overflow-hidden"
      style={{
        backgroundColor: "#F9F9F7",
        border: "1px solid #DDDDDD",
      }}
    >
      <ReactFlow nodes={rfNodes} edges={rfEdges} fitView>
        <Background gap={16} size={1} color="#DDDDDD" />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}

