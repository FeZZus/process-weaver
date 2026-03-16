import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import transcribeRouter from "./transcribe.js";
import processRouter from "./process.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/transcribe", transcribeRouter);
app.use("/api/process", processRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});

