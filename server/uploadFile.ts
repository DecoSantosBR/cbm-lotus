import { Router } from "express";
import { storagePut } from "./storage";

const router = Router();

router.post("/upload-file", async (req, res) => {
  try {
    const { file, filename, mimeType } = req.body;

    if (!file || !filename) {
      return res.status(400).json({ error: "File and filename are required" });
    }

    // Convert base64 to buffer
    const base64Data = file.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const extension = filename.split(".").pop() || "bin";
    const uniqueFilename = `course-files/${timestamp}-${randomSuffix}.${extension}`;

    // Upload to S3
    const { url, key } = await storagePut(uniqueFilename, buffer, mimeType || "application/octet-stream");

    res.json({ url, key: uniqueFilename });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

export default router;
