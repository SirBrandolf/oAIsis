/**
 * Download IPA phonics files and create placeholders for missing sounds.
 * Run from backend: npm run download-phonics
 * Uses src/config/phonicsMap.js. Replace placeholder files when real recordings arrive.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  IPA_BASE,
  PHONICS_IPA_SOURCES,
  PHONICS_PLACEHOLDERS
} from "../src/config/phonicsMap.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/audio/phonics/en");

async function download(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let err = 0;
  for (const [assetId, [subdir, filename]] of Object.entries(PHONICS_IPA_SOURCES)) {
    const url = `${IPA_BASE}/${subdir}/${encodeURIComponent(filename)}`;
    const outPath = path.join(OUT_DIR, `${assetId}.mp3`);
    try {
      const buf = await download(url);
      fs.writeFileSync(outPath, buf);
      console.log(`OK ${assetId}.mp3`);
      ok++;
    } catch (e) {
      console.error(`FAIL ${assetId}: ${e.message}`);
      err++;
    }
  }

  const placeholderPath = path.join(OUT_DIR, "placeholder.mp3");
  if (!fs.existsSync(placeholderPath)) {
    const first = fs.readdirSync(OUT_DIR).find(f => f.endsWith(".mp3"));
    if (first) {
      fs.copyFileSync(path.join(OUT_DIR, first), placeholderPath);
      console.log("OK placeholder.mp3 (copied from " + first + ")");
    } else {
      console.warn("No .mp3 in " + OUT_DIR + "; add placeholder.mp3 manually for fallback.");
    }
  }

  let placeholdersCreated = 0;
  for (const assetId of PHONICS_PLACEHOLDERS) {
    const outPath = path.join(OUT_DIR, `${assetId}.mp3`);
    if (!fs.existsSync(outPath) && fs.existsSync(placeholderPath)) {
      fs.copyFileSync(placeholderPath, outPath);
      console.log("OK " + assetId + ".mp3 (placeholder)");
      placeholdersCreated++;
    }
  }

  console.log(
    "\nDone: " + ok + " downloaded, " + err + " failed, " + placeholdersCreated + " placeholders. Files in " + OUT_DIR
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
