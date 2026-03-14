## Backend (Node/Express API)

This backend exposes a small, audio‑oriented API used by the frontend:

- `GET /api/scenes` – list available scenes (e.g., "At Home", "At the Market").
- `GET /api/scenes/:sceneId/cards` – list cards in a scene with emoji, placeholder image, phrase text, and an `audioUrl`.
- `POST /api/recognize` – (placeholder) endpoint to evaluate a learner's spoken attempt against an expected phrase.

All lesson content is defined as data, and the audio / speech logic is contained in service modules so we can later plug in real TTS or ASR (Claude, etc.) without touching the UI.

---

### Project layout

- `package.json` – Node dependencies and scripts.
- `src/index.js` – Express app and HTTP routes.
- `src/content/lessons.js` – Scene and card data (what we teach).
- `src/services/audioService.js` – Audio URL generation, speech recognition stub, and pronunciation evaluator.

Key classes:

- **`AudioPlaybackService`**
  - Method: `getAudioUrl(audioAssetId, targetLanguage)`.
  - Turns an opaque `audioAssetId` from content into a concrete URL like `/audio/en/en-home-hello-1.mp3`.
  - This is where you will later route to a TTS provider if you want dynamic audio generation.

- **`SpeechRecognitionService`**
  - Method: `recognize(audioBlob, expectedPhrase, targetLanguage)`.
  - Currently returns a stub that "recognizes" the expected phrase.
  - This is where you will later call an external ASR model (e.g., Claude audio APIs or other speech models).

- **`PronunciationEvaluator`**
  - Method: `evaluate(expectedPhrase, recognizedText)`.
  - Encapsulates comparison and scoring logic.
  - When you add more nuanced logic or multiple languages, extend this class rather than changing routes.

---

### Phonics audio (one-time setup)

Market scene cards use phonics segment audio. To fetch all IPA sound files (from [PhoneticFlashCards](https://github.com/joshstephenson/PhoneticFlashCards)) into the repo in one go, run once from the repo root:

```bash
cd backend
npm run download-phonics
```

This downloads the mapped consonant/vowel clips into `backend/public/audio/en/`. The backend serves them at `/audio/en/` and the frontend uses them for the small listen buttons on market cards.

---

### Running the backend on macOS

Prerequisites:

- Node.js 18+ (install via `brew install node` or from nodejs.org).
- `npm` (bundled with Node).

Steps (from the repo root, e.g., `~/Downloads/oaisis`):

```bash
cd backend
npm install
npm start
```

The server will start on port **4000** by default:

- Base URL: `http://localhost:4000/api`

You can test it with:

```bash
curl http://localhost:4000/api/scenes
```

---

### Where to plug in TTS (Claude, etc.)

There are two main integration points:

- **1. Audio generation (TTS)**
  - File: `src/services/audioService.js`
  - Class: `AudioPlaybackService`
  - Method: `getAudioUrl(audioAssetId, targetLanguage)`
  - Recommended pattern:
    - Replace or extend this method so that:
      - It checks whether an audio file already exists for `audioAssetId`.
      - If not, it calls your TTS provider (e.g., Claude or another service) to synthesize speech from the phrase text.
      - It stores the generated file (e.g., on disk or in object storage) and returns a URL pointing to it.
    - Keep all external API keys and endpoints in environment variables (e.g., `CLAUDE_TTS_API_KEY`, `CLAUDE_TTS_URL`) and access them only from this service.

- **2. Speech recognition (ASR)**
  - File: `src/services/audioService.js`
  - Class: `SpeechRecognitionService`
  - Method: `recognize(audioBlob, expectedPhrase, targetLanguage)`
  - Recommended pattern:
    - Update the `/api/recognize` route in `src/index.js` to accept a real audio payload (e.g., multipart/form‑data or base64 encoded audio).
    - Pass that audio into `SpeechRecognitionService.recognize`.
    - Inside the service, call your ASR provider (Claude audio or other service), and return `{ recognizedText, confidence }`.
    - `PronunciationEvaluator` will then compare `recognizedText` with `expectedPhrase`.

By concentrating all TTS/ASR calls in `audioService.js`, the rest of the code (routes and frontend) stays unchanged when you swap or upgrade models.

