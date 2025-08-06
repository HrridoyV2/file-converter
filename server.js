import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

// Upload & Convert
app.post("/convert", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const inputPath = req.file.path;
  const outputPath = path.join("uploads", `${Date.now()}.wav`);

  exec(`ffmpeg -i ${inputPath} ${outputPath}`, (err) => {
    if (err) return res.status(500).send(err);

    res.download(outputPath, "output.wav", () => {
      // Cleanup files after download
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.get("/", (req, res) => {
  res.send("MP4 to WAV API is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
