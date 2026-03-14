import express from "express";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { lessons } from "./content/lessons.js";
import {
  AudioPlaybackService,
  SpeechRecognitionService,
  PronunciationEvaluator
} from "./services/audioService.js";
import { getPhonicsAudioUrl, hasPhonicsFile } from "./services/phonicsLibrary.js";

const app = express();
const port = process.env.PORT || 4000;
const LLM_SERVICE_URL = process.env.LLM_SERVICE_URL || null;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const audioService = new AudioPlaybackService();
const speechService = new SpeechRecognitionService();
const evaluator = new PronunciationEvaluator();

const DIPHTHONG_IDS = new Set([
  "phonics-ice", "phonics-ow-diphthong", "phonics-oy",
  "phonics-er", "phonics-air", "phonics-y-oo",
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "../../frontend/dist");
// Scenario (phrase) audio: public/audio/phrases/<lang>/. Phonics: public/audio/phonics/<lang>/.
const audioDir = path.resolve(__dirname, "../public/audio");

app.use("/audio", express.static(audioDir));

app.get("/api/scenes", (_req, res) => {
  res.json({
    targetLanguage: lessons.targetLanguage,
    scenes: lessons.scenes.map(({ id, title }) => ({ id, title }))
  });
});

app.get("/api/scenes/:sceneId/cards", (req, res) => {
  const { sceneId } = req.params;
  const scene = lessons.scenes.find(s => s.id === sceneId);

  if (!scene) {
    res.status(404).json({ error: "Scene not found" });
    return;
  }

  const isFable = scene.id === "fable";
  const cards = scene.cards.map(card => {
    const isAdvanced = card.isAdvanced || isFable;
    if (isAdvanced) {
      return {
        cardId: card.cardId,
        emoji: card.emoji,
        imagePlaceholder: card.imagePlaceholder ?? null,
        phrase: card.phrase,
        isAdvanced: true,
        audioUrlEn: `/audio/stories/${card.cardId}_en.mp3`,
        audioUrlRh: `/audio/stories/${card.cardId}_rh.mp3`,
        phonicsWords: []
      };
    }
    return {
      cardId: card.cardId,
      emoji: card.emoji,
      imagePlaceholder: card.imagePlaceholder,
      phrase: card.phrase,
      audioUrl: audioService.getAudioUrl(card.cardId, lessons.targetLanguage),
      phonicsWords: Array.isArray(card.phonicsWords)
        ? card.phonicsWords.map(wordEntry => ({
            word: wordEntry.word,
            sounds: wordEntry.sounds.map(s => {
              const ids = s.audioAssetId;
              const isMulti = Array.isArray(ids);
              const singleId = isMulti ? null : ids;
              const resolveUrl = id =>
                id && hasPhonicsFile(id)
                  ? getPhonicsAudioUrl(id, lessons.targetLanguage, "/audio")
                  : null;
              return {
                letters: s.letters,
                silent: !ids || (isMulti && ids.length === 0),
                audioUrl: isMulti ? null : resolveUrl(singleId),
                audioUrls: isMulti ? ids.map(resolveUrl).filter(Boolean) : null,
                diphthong: !!(singleId && DIPHTHONG_IDS.has(singleId))
              };
            })
          }))
        : []
    };
  });

  res.json({
    sceneId: scene.id,
    title: scene.title,
    cards
  });
});

app.post("/api/recognize", async (req, res) => {
  if (!LLM_SERVICE_URL) {
    res.status(503).json({
      error: "Model service not configured",
      detail: "Set LLM_SERVICE_URL (e.g. http://localhost:8001) and restart the backend."
    });
    return;
  }

  const { expectedPhrase, targetLanguage } = req.body || {};

  if (!expectedPhrase) {
    res.status(400).json({ error: "expectedPhrase is required" });
    return;
  }

  try {
    const recognition = await speechService.recognize(
      null,
      expectedPhrase,
      targetLanguage || lessons.targetLanguage
    );
    const evaluation = evaluator.evaluate(expectedPhrase, recognition.recognizedText);
    res.json({ expectedPhrase, ...recognition, evaluation });
  } catch (err) {
    console.error("Recognize error:", err);
    res.status(502).json({ error: "Model service error", detail: err.message });
  }
});

app.post("/api/verify-audio", upload.single("audio"), async (req, res) => {
  if (!LLM_SERVICE_URL) {
    res.status(503).json({
      error: "Model service not configured",
      detail: "Set LLM_SERVICE_URL (e.g. http://localhost:8001) and restart the backend."
    });
    return;
  }

  if (!req.file || !req.file.buffer) {
    res.status(400).json({ error: "Audio file is required" });
    return;
  }

  const expectedPhrase = (req.body && req.body.expectedPhrase) ? String(req.body.expectedPhrase).trim() : null;

  try {
    const form = new FormData();
    form.append("audio", new Blob([req.file.buffer], { type: req.file.mimetype || "audio/webm" }), req.file.originalname || "audio.webm");
    if (expectedPhrase) form.append("expectedPhrase", expectedPhrase);

    const proxyRes = await fetch(`${LLM_SERVICE_URL}/verify-audio`, {
      method: "POST",
      body: form
    });

    if (!proxyRes.ok) {
      const text = await proxyRes.text();
      throw new Error(text || `Model service returned ${proxyRes.status}`);
    }

    const data = await proxyRes.json();
    res.json(data);
  } catch (err) {
    console.error("Verify-audio error:", err);
    res.status(502).json({ error: "Model service error", detail: err.message });
  }
});

app.use(express.static(frontendDir));

app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
