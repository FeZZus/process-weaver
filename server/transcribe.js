import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI, { toFile } from "openai";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing file field 'file' in form data." });
    }

    // Debug: log what was actually uploaded
    // eslint-disable-next-line no-console
    console.log("Uploaded file info:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    // Read the uploaded file and wrap it with a proper filename
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileForOpenAI = await toFile(fileBuffer, req.file.originalname);

    const response = await openai.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file: fileForOpenAI,
    });

    const transcript = response.text || "";

    // Clean up temporary file
    fs.unlink(req.file.path, () => {});

    return res.json({ transcript });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Transcription error:", error);
    return res.status(500).json({ error: "Failed to transcribe audio." });
  }
});

export default router;

