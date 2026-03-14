## oAIsis – Audio‑First English Learning

### What this repo contains

- `backend/`: Node/Express API that serves lesson content and also serves the frontend.
- `frontend/`: React UI (audio‑first cards) that talks to the backend.

### Quick start (macOS or Windows with Node 18+)

1. Open a terminal in the project root (`oaisis`), then:

   ```bash
   cd backend
   npm install
   npm start
   ```

2. Open a browser and go to:

   - `http://localhost:4000/` – React app (scenes + cards)
   - `http://localhost:4000/api/scenes` – API test endpoint

You do **not** need to run anything inside `frontend/`; the backend serves it for you.

### More details

For architecture and extension points (e.g., wiring in TTS/ASR providers like Claude), see:

- `backend/README.md`
- `frontend/README.md`