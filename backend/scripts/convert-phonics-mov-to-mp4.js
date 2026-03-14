/**
 * Convert phonics .mov files to .mp4 and rename to asset IDs.
 * Place .mov files in project root (oaisis/) with names: B.mov, P.mov, W.mov, R.mov,
 * Zh.mov, "Long i.mov", Ow.mov, Oy.mov.
 * Run from backend: npm run convert-phonics-video
 * Output: backend/public/audio/phonics/en/phonics-*.mp4
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Project root (oaisis) and output dir
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(__dirname, "../public/audio/phonics/en");

/** .mov filename (no path) -> output asset name (e.g. phonics-b.mp4) */
const MOV_TO_ASSET = {
  "B.mov": "phonics-b.mp4",
  "P.mov": "phonics-p.mp4",
  "W.mov": "phonics-w.mp4",
  "R.mov": "phonics-r.mp4",
  "Zh.mov": "phonics-zh.mp4",
  "Long i.mov": "phonics-ice.mp4",
  "Ow.mov": "phonics-ow-diphthong.mp4",
  "Oy.mov": "phonics-oy.mp4",
};

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
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(stderr || "ffmpeg failed"))));
  });
}

async function main() {
  const ffmpegPath = await getFfmpegPath();
  if (ffmpegPath === "ffmpeg") {
    console.warn("ffmpeg-static not found; using system ffmpeg. Run: npm install ffmpeg-static");
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let err = 0;

  for (const [movName, outName] of Object.entries(MOV_TO_ASSET)) {
    const src = path.join(PROJECT_ROOT, movName);
    const dest = path.join(OUT_DIR, outName);
    if (!fs.existsSync(src)) {
      console.warn("Skip (not found):", movName);
      continue;
    }
    try {
      await runFfmpeg(ffmpegPath, [
        "-y", "-i", src,
        "-c:v", "libx264", "-c:a", "aac",
        "-movflags", "+faststart",
        dest
      ]);
      console.log("OK", movName, "->", outName);
      ok++;
    } catch (e) {
      console.error("FAIL", movName, ":", e.message.slice(0, 80));
      err++;
    }
  }

  console.log("\nDone:", ok, "converted,", err, "failed. Output:", OUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
