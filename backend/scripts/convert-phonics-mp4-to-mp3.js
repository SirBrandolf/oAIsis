/**
 * Extract audio from phonics .mp4 files into .mp3.
 * Run from backend: npm run convert-phonics-audio
 * Looks in backend/public/audio/phonics/en for phonics-*.mp4 and writes phonics-*.mp3.
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, "../public/audio/phonics/en");

async function getFfmpegPath() {
  try {
    const ffmpegStatic = await import("ffmpeg-static");
    return ffmpegStatic.default;
  } catch {
    return "ffmpeg";
  }
}

function runFfmpeg(ffmpegPath, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: "pipe" });
    let stderr = "";
    proc.stderr.on("data", d => {
      stderr += d.toString();
    });
    proc.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(stderr || "ffmpeg failed"));
    });
  });
}

async function main() {
  const ffmpegPath = await getFfmpegPath();
  if (ffmpegPath === "ffmpeg") {
    console.warn(
      "ffmpeg-static not found; using system ffmpeg. If it fails, run: npm install ffmpeg-static"
    );
  }

  if (!fs.existsSync(AUDIO_DIR)) {
    console.error("Audio directory not found:", AUDIO_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(AUDIO_DIR).filter(f => /^phonics-.*\.mp4$/i.test(f));
  if (!files.length) {
    console.warn("No phonics-*.mp4 files found in", AUDIO_DIR);
    return;
  }

  let ok = 0;
  let err = 0;

  for (const file of files) {
    const src = path.join(AUDIO_DIR, file);
    const mp3Name = file.replace(/\.mp4$/i, ".mp3");
    const dest = path.join(AUDIO_DIR, mp3Name);
    try {
      await runFfmpeg(ffmpegPath, [
        "-y",
        "-i",
        src,
        "-vn",
        "-acodec",
        "mp3",
        dest
      ]);
      console.log("OK", file, "->", mp3Name);
      ok++;
    } catch (e) {
      console.error("FAIL", file, ":", e.message.slice(0, 120));
      err++;
    }
  }

  console.log("\nDone:", ok, "converted,", err, "failed. Directory:", AUDIO_DIR);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

