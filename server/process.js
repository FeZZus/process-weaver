import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { transcript } = req.body ?? {};

    if (!transcript || typeof transcript !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'transcript' in request body." });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      temperature: 0,
      instructions: `
You extract business workflows from transcripts.

Return only structured data that matches the provided JSON schema.

Model the workflow as a simple directed process from start to end.

Rules:
- Prefer the fewest nodes needed to accurately represent the workflow.
- Prefer a linear sequence unless the transcript clearly describes a branch.
- Only use a decision node when the transcript explicitly contains a condition, approval, rejection, yes/no split, or alternative path.
- Each edge must connect two existing node ids.
- Never connect one node to many others unless it is a decision node.
- Non-decision nodes should usually have exactly one outgoing edge.
- Decision nodes usually have 2 outgoing edges.
- Use edge labels only for branch meanings like "Yes", "No", "Approved", or "Rejected".
- Include at least 1 actor.
- Include at least 1 start node and 1 end node.
- Do not invent missing branches, actors, or departments.
- If uncertain, choose the simplest plausible flow.
- Use short, concrete labels like "Review invoice" or "Manager approves".
- Keep the summary to 2-4 sentences.
      `,
      input: `Transcript:\n${transcript}`,
      text: {
        format: {
          type: "json_schema",
          name: "process_flow",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["title", "summary", "actors", "nodes", "edges"],
            properties: {
              title: {
                type: "string",
              },
              summary: {
                type: "string",
              },
              actors: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["name", "role"],
                  properties: {
                    name: { type: "string" },
                    role: { type: "string" },
                  },
                },
              },
              nodes: {
                type: "array",
                minItems: 2,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["id", "label", "type"],
                  properties: {
                    id: { type: "string" },
                    label: { type: "string" },
                    type: {
                      type: "string",
                      enum: ["start", "process", "decision", "end"],
                    },
                  },
                },
              },
              edges: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["source", "target", "label"],
                  properties: {
                    source: { type: "string" },
                    target: { type: "string" },
                    label: {
                      anyOf: [{ type: "string" }, { type: "null" }],
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const raw = response.output_text;
    const parsed = JSON.parse(raw);

    return res.json(parsed);
  } catch (error) {
    console.error("Process extraction error:", error);
    return res
      .status(500)
      .json({ error: "Failed to extract process from transcript." });
  }
});

export default router;

