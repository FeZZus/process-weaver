export type WorkflowNodeType = "start" | "process" | "decision" | "end";

export interface WorkflowActor {
  name: string;
  role: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: WorkflowNodeType;
}

export interface WorkflowEdge {
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  title: string;
  summary: string;
  actors: WorkflowActor[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

