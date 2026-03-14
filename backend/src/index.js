import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { lessons } from "./content/lessons.js";
import {
  AudioPlaybackService,
  SpeechRecognitionService,
  PronunciationEvaluator
} from "./services/audioService.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const audioService = new AudioPlaybackService();
const speechService = new SpeechRecognitionService();
const evaluator = new PronunciationEvaluator();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "../../frontend/dist");

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

  const cards = scene.cards.map(card => ({
    cardId: card.cardId,
    emoji: card.emoji,
    imagePlaceholder: card.imagePlaceholder,
    phrase: card.phrase,
    audioUrl: audioService.getAudioUrl(card.audioAssetId, lessons.targetLanguage)
  }));

  res.json({
    sceneId: scene.id,
    title: scene.title,
    cards
  });
});

app.post("/api/recognize", async (req, res) => {
  const { expectedPhrase, targetLanguage } = req.body || {};

  if (!expectedPhrase) {
    res.status(400).json({ error: "expectedPhrase is required" });
    return;
  }

  const recognition = await speechService.recognize(
    null,
    expectedPhrase,
    targetLanguage || lessons.targetLanguage
  );

  const evaluation = evaluator.evaluate(expectedPhrase, recognition.recognizedText);

  res.json({
    expectedPhrase,
    ...recognition,
    evaluation
  });
});

app.use(express.static(frontendDir));

app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
