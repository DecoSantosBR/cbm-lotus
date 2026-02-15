import { Router } from "express";
import { storagePut } from "./storage";

const router = Router();

router.post("/upload-image", async (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image || !filename) {
      return res.status(400).json({ error: "Image and filename are required" });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const extension = filename.split(".").pop();
    const uniqueFilename = `course-images/${timestamp}-${randomSuffix}.${extension}`;

    // Upload to S3
    const { url } = await storagePut(uniqueFilename, buffer, `image/${extension}`);

    res.json({ url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
