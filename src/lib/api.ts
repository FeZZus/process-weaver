import type { Workflow } from "@/types/workflow";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3001";

export async function transcribeAudio(file: File): Promise<{ transcript: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to transcribe audio");
  }

  const data = (await res.json()) as { transcript: string };
  return data;
}

export async function processTranscript(transcript: string): Promise<Workflow> {
  const res = await fetch(`${API_BASE}/api/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) {
    throw new Error("Failed to process transcript");
  }

  const data = (await res.json()) as Workflow;
  return data;
}

