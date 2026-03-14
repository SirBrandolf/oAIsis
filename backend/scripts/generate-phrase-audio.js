/**
 * Generates natural-sounding TTS audio for each phrase in lessons.
 * Output: one MP3 per card, named by cardId (e.g. home-hello.mp3).
 * Requires OPENAI_API_KEY in env; uses OpenAI TTS (gpt-4o-mini-tts, voice marin).
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";
import { lessons } from "../src/content/lessons.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.OPENAI_TTS_VOICE || "marin";

function getProjectRoot() {
  return path.resolve(__dirname, "../..");
}

function getOutputDir() {
  const root = getProjectRoot();
  const lang = lessons.targetLanguage || "en";
  return path.join(root, "frontend", "public", "audio", lang);
}

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Set it in oAIsis/.env or in the environment."
    );
  }
  return new OpenAI({ apiKey });
}

async function generateOne(client, phrase, cardId, outputDir) {
  const outPath = path.join(outputDir, `${cardId}.mp3`);
  const response = await client.audio.speech.create({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    input: phrase,
    response_format: "mp3",
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

async function main() {
  const client = getClient();
  const outputDir = getOutputDir();
  const cards = lessons.scenes.flatMap((scene) =>
    scene.cards.map((card) => ({ ...card, sceneId: scene.id }))
  );

  console.log(
    `Generating ${cards.length} phrase audios (model=${TTS_MODEL}, voice=${TTS_VOICE}) into ${outputDir}`
  );

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    try {
      const outPath = await generateOne(
        client,
        card.phrase,
        card.cardId,
        outputDir
      );
      console.log(`[${i + 1}/${cards.length}] ${card.cardId} -> ${outPath}`);
    } catch (err) {
      console.error(`Failed ${card.cardId}:`, err.message);
      throw err;
    }
  }

  console.log("Done.");
}

main();
