Turn audio process descriptions into structured process flow diagrams. Upload an audio file, get a transcript, then an extracted workflow (nodes, edges, actors, summary) rendered as an interactive diagram.

---
# I made a video and put it in the zipped folder. Please do watch it! It's more interesting than reading all this.

## Rough project flow

- **Input:** User uploads an audio file (e.g. someone describing a process).
- **Transcription:** Backend sends the file to OpenAI’s transcription API and returns plain text.
- **Extraction:** That text is sent to an LLM (OpenAI Responses API) with a fixed prompt so the model returns **strict JSON**: title, summary, actors, and a graph (nodes + edges) representing the process.
- **Output:** The frontend shows a React Flow diagram (with layout via dagre), a summary block, and a “People & Teams” list. A “Regenerate” path lets the user edit the summary and re-run extraction to get an updated workflow.


## Run locally

1. **Env:** In project root, add a `.env` with `OPENAI_API_KEY` (and optionally `PORT=3001`).
2. **Backend:** `npm run dev:server` (Express on port 3001).
3. **Frontend:** `npm run dev` (Vite dev server). Use the Upload File flow; the default test file is `public/test.mp3` if present.

---



## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (Vite + React + TypeScript)                            │
│  - EmptyState → Upload File → InputState (file picker + Analyze)  │
│  - ProcessingState (while APIs run)                               │
│  - ResultsState: FlowDiagram (React Flow + dagre), summary,      │
│                  People & Teams, Regenerate dialog               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │  POST /api/transcribe (multipart file)
                            │  POST /api/process     (JSON { transcript })
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend (Express, Node)                                         │
│  - /api/transcribe: multer → OpenAI audio transcriptions         │
│    (gpt-4o-mini-transcribe), returns { transcript }             │
│  - /api/process:     JSON body → OpenAI Responses API            │
│    (e.g. gpt-4.1-mini), returns Workflow JSON                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                    OpenAI (transcription + LLM)


## Main files

| Area | Path |
|------|------|
| API server | `server/index.js` |
| Transcribe route | `server/transcribe.js` |
| Process route | `server/process.js` |
| Workflow types | `src/types/workflow.ts` |
| API client | `src/lib/api.ts` |
| App state & pipeline | `src/pages/Index.tsx` |
| Diagram | `src/components/FlowDiagram.tsx` |
| Results (summary, people, regenerate) | `src/components/ResultsState.tsx` |
